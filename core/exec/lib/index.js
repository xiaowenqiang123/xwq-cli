
import Package from '@xwq-cli/package'
import path from 'path'

const SETTINGS = {
    // init: '@xwq-cli/init'
    init: 'url-join'
}

const CATH_DIR = 'dependence'

export default async function exec(...args) {
    let targetPath = process.env.CLI_TARGET_PATH;
    const homePath = process.env.CLI_HOME_PATH;
    let storePath = '' // 存放下载包的路径
    let pkg;
    // 拿到命令的名称 对应上面的SETTINGS
    const command = args[args.length - 1];
    const packageName = SETTINGS[command.name()]
    const packageVersion = 'latest';
    // 用户未输入targetPath 
    if (!targetPath) {
        targetPath = path.resolve(homePath, CATH_DIR)
        storePath = path.resolve(targetPath, 'node_modules')
        pkg = new Package({
            targetPath,
            storePath,
            packageName,
            packageVersion

        })
        if (await pkg.exist()) {
            // 存在 则更新
            console.log(66)
            pkg.update()
        } else {
            // 不存在 则安装
            console.log(222333)
            await pkg.install()
        }
    } else {
        pkg = new Package({
            targetPath,
            storePath,
            packageName,
            packageVersion

        })
    }

    const rootPath = await pkg.getRootFilePath()

    if (rootPath) {
        const module = await import(rootPath)
        module.default.apply(null, args)

    }


}


