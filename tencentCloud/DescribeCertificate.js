/**
 * @description 获取证书信息
 * @param {string} CertificateId
 * @returns RequestId
 * 
    "CertBeginTime": "2024-08-14 08:00:00",
    "CertEndTime": "2024-11-13 07:59:59",
    "CertificateId": "HE1JBa05",
    "Deployable": true,
    "Domain": "test.tenyding.cn",
    "InsertTime": "2024-08-15 01:26:06",
    "PackageType": "83",
    "RequestId": "",
    // 状态。0：审核中，1：已通过，2：审核失败，3：已过期，4：验证方式为 DNS_AUTO 类型的证书， 已添加DNS记录，5：企业证书，待提交，6：订单取消中，7：已取消，8：已提交资料， 待上传确认函，9：证书吊销中，10：已吊销，11：重颁发中，12：待上传吊销确认函，13：免费证书待提交资料状态，14：已退款，
    "Status": 1,    
    "StatusMsg": "CA-REVIEWING",
    "StatusName": "已颁发",
    "ValidityPeriod": "3",
    "VerifyType": "DNS_AUTO",
    "VulnerabilityStatus": "INACTIVE"
 */

const utils = require("./utils/utils")
const publicStep = require("./utils/publicStep")

module.exports = async (event, context) => {

    const SECRET_ID = event.SECRET_ID
    const SECRET_KEY = event.SECRET_KEY
    const TOKEN = event.TOKEN
    
    const host = "ssl.tencentcloudapi.com"
    const service = "ssl"
    const region = ""
    const action = "DescribeCertificate"
    const version = "2019-12-05"
    const timestamp = parseInt(String(new Date().getTime() / 1000))
    const date = utils.getDate(timestamp)
    const payload = `{"CertificateId":"${event.CertificateId}"}`

    const resp = await publicStep(
        SECRET_ID,
        SECRET_KEY,
        TOKEN,
        host,
        service,
        region,
        action,
        version,
        timestamp,
        date,
        payload
    )
    
    return resp
    console.log('finish')
}