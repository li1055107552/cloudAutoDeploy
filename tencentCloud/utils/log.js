const fs = require("fs")

module.exports = (msg) => {
    fs.appendFileSync("log", `${msg}\n\n`)
}