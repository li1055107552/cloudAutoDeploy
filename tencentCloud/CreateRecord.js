/**
 * @description 添加一条DNS解析记录
 * @param {Object} DvAuths
 * @param {String} DvAuths.DvAuthDomain
 * @param {String} DvAuths.DvAuthKeySubDomain
 * @param {String} DvAuths.DvAuthValue
 * @returns  RecordId
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
    const action = "CreateRecord"
    const version = "2021-03-23"
    const timestamp = parseInt(String(new Date().getTime() / 1000))
    const date = utils.getDate(timestamp)
    const payload = JSON.stringify({
        Domain: event.DvAuths.DvAuthDomain,
        RecordType: event.DvAuths.DvAuthVerifyType,
        RecordLine: "默认",
        Value: event.DvAuths.DvAuthValue,
        SubDomain: event.DvAuths.DvAuthSubDomain
    })

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

    // {
    //     "Response": {
    //         "RecordId": 1836700472,
    //             "RequestId": "cbbc4b2b-1a2d-4566-8cb7-945f2372d3c0"
    //     }
    // }

}

