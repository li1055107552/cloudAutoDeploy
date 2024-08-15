
const crypto = require("crypto")

function sha256(message, secret = "", encoding) {
    const hmac = crypto.createHmac("sha256", secret)
    return hmac.update(message).digest(encoding)
}

function getHash(message, encoding = "hex") {
    const hash = crypto.createHash("sha256")
    return hash.update(message).digest(encoding)
}

function getDate(timestamp) {
    const date = new Date(timestamp * 1000)
    const year = date.getUTCFullYear()
    const month = ("0" + (date.getUTCMonth() + 1)).slice(-2)
    const day = ("0" + date.getUTCDate()).slice(-2)
    return `${year}-${month}-${day}`
}

function getDateFormat(timestamp) {
    const date = new Date(timestamp * 1000)
    const year = date.getUTCFullYear()
    const month = ("0" + (date.getUTCMonth() + 1)).slice(-2)
    const day = ("0" + date.getUTCDate()).slice(-2)
    const hour = ("0" + date.getUTCHours()).slice(-2)
    const minute = ("0" + date.getUTCMinutes()).slice(-2)
    const second = ("0" + date.getUTCSeconds()).slice(-2)
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

module.exports = {
    sha256,
    getHash,
    getDate,
    getDateFormat
}