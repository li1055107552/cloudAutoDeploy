/**
 * @description 免费证书申请
 * @param {string} DomainName 申请的证书域名
 * @returns  CertificateId
 * @returns  Data
 * @returns  RequestId
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
    const action = "ApplyCertificate"
    const version = "2019-12-05"
    const timestamp = parseInt(String(new Date().getTime() / 1000))
    const date = utils.getDate(timestamp)
    // DvAuthMethod: DNS_AUTO = 自动DNS验证，DNS = 手动DNS验证，FILE = 文件验证。
    // DomainName: 申请的域名
    // const payload = `{"DvAuthMethod":"DNS_AUTO","DomainName":"${event.DomainName}"}`
    const payload = `{"DvAuthMethod":"DNS","DomainName":"${event.DomainName}"}`

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

