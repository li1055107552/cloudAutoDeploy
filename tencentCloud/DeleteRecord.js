/**
 * @description 删除一条DNS解析记录
 * @param {String} Domain
 * @param {String} RecordId
 * @returns  RequestId
 */

const utils = require("./utils/utils")
const publicStep = require("./utils/publicStep")

module.exports = async (event, context) => {

    const SECRET_ID = event.SECRET_ID
    const SECRET_KEY = event.SECRET_KEY
    const TOKEN = event.TOKEN

    const host = "dnspod.tencentcloudapi.com"
    const service = "dnspod"
    const region = ""
    const action = "DeleteRecord"
    const version = "2021-03-23"
    const timestamp = parseInt(String(new Date().getTime() / 1000))
    const date = utils.getDate(timestamp)
    const payload = `{"Domain":"${event.Domain}","RecordId":${event.RecordId}}`

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

