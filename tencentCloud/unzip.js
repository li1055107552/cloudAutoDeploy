/**
 * @description 解压缩证书
 * 
 */
const exec = require('child_process').execSync;
const path = require('path');

module.exports = async (event, context) => {
    const filePath = event.filePath
    const DomainName = event.DomainName

    exec(`unzip ${filePath}`);

    // nginx
    const zipDirPath = path.join(path.dirname(filePath), DomainName + "_nginx")

    let crt = path.join(zipDirPath, DomainName + "_bundle.crt")
    let key = path.join(zipDirPath, DomainName + ".key")

    return {
        nginx: {
            zipDirPath, crt, key
        }
    }
}