/**
 * @description 下载证书
 * @returns  DownloadCertificateUrl
 * @returns  DownloadFilename
 * @returns  RequestId
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

module.exports = async (event, context) => {


    // 要下载的 ZIP 文件的 URL
    const fileUrl = event.DownloadCertificateUrl;

    // 本地保存路径
    const filePath = path.join(__dirname, event.DownloadFilename);

    // 发起 HTTPS 请求
    return new Promise((resolve, reject) => {
        https.get(fileUrl, (response) => {
            // 检查响应状态码
            if (response.statusCode !== 200) {
                console.error(`Failed to get '${fileUrl}' (${response.statusCode})`);
                return;
            }
    
            // 创建文件流来写入数据
            const file = fs.createWriteStream(filePath);
    
            // 将响应的数据管道到文件流中
            response.pipe(file);
    
            // 处理完成事件
            file.on('finish', () => {
                file.close();
                console.log('Download completed successfully!');
                resolve(filePath)
            });
    
            // 处理错误事件
            file.on('error', (err) => {
                fs.unlink(filePath, () => { }); // 删除部分下载的文件
                console.error(`Error writing to file: ${err.message}`);
                resolve("")
            });
    
        }).on('error', (err) => {
            console.error(`Error with request: ${err.message}`);
            resolve({filePath, msg: `Error with request: ${err.message}`})
        });
    }) 



}