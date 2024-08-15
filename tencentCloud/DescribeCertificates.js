/**
 * @description 获取证书列表
 * @returns Certificates[]
 * @returns RequestId
 * @returns TotalCount
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
    const action = "DescribeCertificates"
    const version = "2019-12-05"
    const timestamp = parseInt(String(new Date().getTime() / 1000))
    const date = utils.getDate(timestamp)
    const payload = "{}"

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

