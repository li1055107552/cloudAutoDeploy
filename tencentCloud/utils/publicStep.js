/**
 * @description 处理公共的步骤
 * @returns {promise} 返回一个请求结果
 */

const https = require("https")
const utils = require("./utils")
const log = require("./log")

module.exports = (
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
) => {
    //#region ************* 步骤 1：拼接规范请求串 *************
    const signedHeaders = "content-type;host"
    const hashedRequestPayload = utils.getHash(payload)
    const httpRequestMethod = "POST"
    const canonicalUri = "/"
    const canonicalQueryString = ""
    const canonicalHeaders =
        "content-type:application/json; charset=utf-8\n" + "host:" + host + "\n"

    const canonicalRequest =
        httpRequestMethod +
        "\n" +
        canonicalUri +
        "\n" +
        canonicalQueryString +
        "\n" +
        canonicalHeaders +
        "\n" +
        signedHeaders +
        "\n" +
        hashedRequestPayload
    //#endregion

    //#region ************* 步骤 2：拼接待签名字符串 *************
    const algorithm = "TC3-HMAC-SHA256"
    const hashedCanonicalRequest = utils.getHash(canonicalRequest)
    const credentialScope = date + "/" + service + "/" + "tc3_request"
    const stringToSign =
        algorithm +
        "\n" +
        timestamp +
        "\n" +
        credentialScope +
        "\n" +
        hashedCanonicalRequest
    //#endregion
        
    //#region ************* 步骤 3：计算签名 *************
    const kDate = utils.sha256(date, "TC3" + SECRET_KEY)
    const kService = utils.sha256(service, kDate)
    const kSigning = utils.sha256("tc3_request", kService)
    const signature = utils.sha256(stringToSign, kSigning, "hex")
    //#endregion

    //#region ************* 步骤 4：拼接 Authorization *************
    const authorization =
        algorithm +
        " " +
        "Credential=" +
        SECRET_ID +
        "/" +
        credentialScope +
        ", " +
        "SignedHeaders=" +
        signedHeaders +
        ", " +
        "Signature=" +
        signature
    //#endregion
    
    //#region ************* 步骤 5：构造并发起请求 *************
    const headers = {
        Authorization: authorization,
        "Content-Type": "application/json; charset=utf-8",
        Host: host,
        "X-TC-Action": action,
        "X-TC-Timestamp": timestamp,
        "X-TC-Version": version,
    }

    if (region) {
        headers["X-TC-Region"] = region
    }
    if (TOKEN) {
        headers["X-TC-Token"] = TOKEN
    }

    const options = {
        hostname: host,
        method: httpRequestMethod,
        headers,
    }

    return new Promise((resolve, reject) => {
        console.log(`${httpRequestMethod} ${utils.getDateFormat(timestamp)} --- ${action}`)
        log(`${httpRequestMethod} ${utils.getDateFormat(timestamp)} --- ${action}`)

        const req = https.request(options, (res) => {
            let data = ""
            res.on("data", (chunk) => {
                data += chunk
            })
    
            res.on("end", () => {
                const res = JSON.parse(data)
                
                log(`${action} --- ${JSON.stringify(res.Response, null, 2)}`)
                resolve(res.Response)
            })
        })
    
        req.on("error", (error) => {
            // console.error(error)
            reject(error)
        })
    
        req.write(payload)
    
        req.end()
    })
    //#endregion
}