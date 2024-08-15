/**
 * @description 主动触发证书验证
 * @param {String} CertificateId
 * @returns  CertificateId
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
    const action = "CompleteCertificate"
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

