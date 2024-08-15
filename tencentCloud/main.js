const getDescribeCertificates = require("./DescribeCertificates")
const getApplyCertificate = require("./ApplyCertificate")
const getDescribeCertificate = require("./DescribeCertificate")
const getDescribeDownloadCertificateUrl = require("./DescribeDownloadCertificateUrl")
const DownloadCertificate = require("./DownloadCertificate")
const CompleteCertificate = require("./CompleteCertificate")
const CreateRecord = require("./CreateRecord")
const DeleteRecord = require("./DeleteRecord")
const unzip = require("./unzip")

const SECRET_ID = ""
const SECRET_KEY = ""
const TOKEN = ""

// 检测证书状态
async function CheckCertificateStatus(ApplyCertificate) {

    let DvAuths = null;
    let CreateRecordRes = null;
    let CompleteCertificateRes = null;

    async function polling() {
        // ************* 步骤 4：获取证书信息 *************
        let DescribeCertificate = await getDescribeCertificate({ SECRET_ID, SECRET_KEY, CertificateId: ApplyCertificate.CertificateId })

        if (DescribeCertificate.Status === 0 /** 待验证 */) {
            DvAuths = DescribeCertificate.DvAuthDetail.DvAuths[0]

            // ************* 步骤 5-1：更新一条DNS记录 *************
            if (CreateRecordRes == null) {
                CreateRecordRes = await CreateRecord({
                    SECRET_ID,
                    SECRET_KEY,
                    DvAuths
                })
                console.log("CertificateId: ",DescribeCertificate.CertificateId)
            }

            // ************* 步骤 5-2：主动触发证书验证 *************
            CompleteCertificateRes = await CompleteCertificate({ SECRET_ID, SECRET_KEY, TOKEN, CertificateId: ApplyCertificate.CertificateId })

            await new Promise(resolve => {
                setTimeout(resolve, 10 * 1000)
            })
            return polling()

        }
        else if (DescribeCertificate.Status === 1 /** 已通过 */) {

            // ************* 步骤 5-3：删除一条DNS记录 *************
            if (CompleteCertificateRes && ApplyCertificate.CertificateId == CompleteCertificateRes.CertificateId) {
                let DeleteRecordRes = await DeleteRecord({
                    SECRET_ID,
                    SECRET_KEY,
                    TOKEN,
                    Domain: DvAuths.DvAuthDomain,
                    RecordId: CreateRecordRes.RecordId
                })
                console.log("DeleteRecordRes", DeleteRecordRes)
            }

            return Promise.resolve()
        }
    }

    return await polling()

}

async function handle(item) {
    const DomainName = item.Domain

    // ************* 步骤 3：申请证书 *************
    const ApplyCertificate = await getApplyCertificate({ SECRET_ID, SECRET_KEY, TOKEN, DomainName })


    // ************* 步骤 4 5：检测证书状态 *************
    await CheckCertificateStatus(ApplyCertificate)


    // ************* 步骤 6：获取下载证书链接 *************
    const DescribeDownloadCertificateUrl = await getDescribeDownloadCertificateUrl({ SECRET_ID, SECRET_KEY, CertificateId: ApplyCertificate.CertificateId, ServiceType: "nginx" })


    if (DescribeDownloadCertificateUrl.DownloadCertificateUrl && DescribeDownloadCertificateUrl.DownloadFilename) {

        // ************* 步骤 7：下载证书 *************
        var filePath = await DownloadCertificate({
            DownloadCertificateUrl: DescribeDownloadCertificateUrl.DownloadCertificateUrl,
            DownloadFilename: DescribeDownloadCertificateUrl.DownloadFilename
        })

        // ************* 步骤 8：解压缩 *************
        let pathRes = await unzip({filePath, DomainName})


        // ************* 步骤 9：放置证书 *************
        const fs = require('fs')
        fs.copyFileSync(pathRes.nginx.crt, `/etc/nginx/${DomainName}_bundle.crt`)
        fs.copyFileSync(pathRes.nginx.key, `/etc/nginx/${DomainName}.key`)
        fs.rmSync(filePath, { recursive: true })
        fs.rmSync(pathRes.nginx.zipDirPath, { recursive: true })
    }

}

async function main() {

    // ************* 步骤 1：获取证书列表 *************
    const DescribeCertificates = await getDescribeCertificates({ SECRET_ID, SECRET_KEY })


    // ************* 步骤 2：过滤出将要到期的证书 *************
    let Certificates = DescribeCertificates.Certificates
    let CertificatesMap = new Map()

    // 2-1: 找出 Domain 对应证书最晚的过期时间
    Certificates.forEach(item => {
        //#region item.Status: 
        /**
         * item.Status: 
         * 0：审核中
         * 1：已通过
         * 2：审核失败
         * 3：已过期
         * 4：验证方式为 DNS_AUTO 类型的证书，已添加DNS记录
         * 5：企业证书，待提交
         * 6：订单取消中
         * 7：已取消
         * 8：已提交资料，待上传确认函
         * 9：证书吊销中
         * 10：已吊销
         * 11：重颁发中
         * 12：待上传吊销确认函
         * 13：免费证书待提交资料状态
         * 14：已退款
         */
        //#endregion
        if (item.Status != 1) return // 只处理"已签发"的证书

        if (CertificatesMap.has(item.Domain)) {
            let oldItem = CertificatesMap.get(item.Domain)
            if (oldItem.CertEndTime >= item.CertEndTime) {
                return
            }
        }
        CertificatesMap.set(item.Domain, item)
    })

    // 2-2: 找出三天内过期的
    let time = Date.now()
    let Iterator = CertificatesMap.values()
    while (item = Iterator.next().value) {
        let CertEndTime = new Date(item.CertEndTime).getTime()
        if (CertEndTime - time <= 3 * 24 * 60 * 60 * 1000) {
            handle(item)
        }
    }

    console.log('finish')
}

main()
module.exports = handle