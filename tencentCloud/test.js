const handle = require("./main")

const DomainName = "test.dnspod.cn"

// 单独执行，可以手动申请一个 DomainName证书 并自动部署
async function test() {

    await handle({
        Domain: DomainName
    })

    console.log('finish')
}
test()