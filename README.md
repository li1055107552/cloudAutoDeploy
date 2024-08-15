# SSL免费证书自动续费

## 腾讯云

### 使用流程

1. 登录[控制台](https://console.cloud.tencent.com/)，[创建密钥](https://console.cloud.tencent.com/cam/capi)
2. 填写 `main.js` 中的`SECRET_ID` 和 `SECRET_KEY`
3. 编写定时脚本

    ```bash
    # /path/to/script.sh

    #!/usr/bin/sudo bash
    echo "$(date +"%Y-%m-%d %H:%M:%S")"
    node /path/to/main.js
    ```

    ```bash
    $ sudo chmod +x /path/to/script.sh
    $ sudo crontab -e
    # 每天0点执行
    0 0 * * * /path/to/script.sh
    ```

### 执行流程

1. 获取证书列表
2. 过滤出 "已签发" 且 "三天内过期的" 证书
3. 申请新的免费证书
4. 轮询证书状态：
    - 待验证：
        1. 新增一条DNS记录
        2. 主动触发证书验证
    - 已通过：
        1. 删除DNS记录
5. 获取新证书下载链接
6. 下载新证书(nginx)
7. 解压缩(zip)
8. 放置证书

## 阿里云