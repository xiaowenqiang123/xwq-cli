import path from 'path'
import semver from 'semver'
import colors from 'colors/safe.js';
import { Command } from 'commander';
import userHome from 'user-home' // 获取用户的主目录
import dotenv from 'dotenv' // 加载env文件
import { fileURLToPath } from 'url'

import { pathExists } from 'path-exists' // 判断路径是否存在
import rootCheck from 'root-check';
import exec from '@xwq-cli/exec'
import { getNpmSemverVersions } from '@xwq-cli/get-npm-info'
import log from '@xwq-cli/log'
import * as constance from './constance.js';
const program = new Command();;

import { readFile } from 'fs/promises';

const pkg = JSON.parse(await readFile(fileURLToPath(new URL('../package.json', import.meta.url))));

export default function core() {
    try {
        prepare()
        registerCommands()
    } catch (error) {
        log.error(error)
    }

}


function prepare() {
    checkVersion();
    checkNodeVersion()
    checkRoot()
    checkUserHome()
    checkEnv()
    checkGlobalVersion()
}


// check version
function checkVersion() {
    log.notice('cli', pkg.version)
}

function checkNodeVersion() {
    const currentVersion = process.version;
    const lowestVersion = constance.LOWEST_NODE_VERSION;
    const res = semver.gte(currentVersion, lowestVersion);
    if (!res) {
        throw new Error(colors.red('need higher version ' + lowestVersion))
    }
}
// 用户降级。
function checkRoot() {
    rootCheck()
    console.log(process.getuid())
}

// 检查是否存在用户目录
function checkUserHome() {
    log.info('用户主目录', userHome)
    if (userHome || !pathExistsSync(userHome)) {
        // throw new Error(colors.red('当前登录用户主目录不存在'))
    }
}


// 检查env 文件
async function checkEnv() {
    // const dotenvPath = path.resolve(userHome, '.env');
    // // 解析出来的环境变量会直接放入process.env 中
    // console.log(dotenvPath)
    // console.log(await pathExists(dotenvPath))
    // if (await pathExists(dotenvPath)) {
    //     const config = dotenv.config({
    //         path: dotenvPath
    //     })
    // } else {
    //     createDefaultConfig()

    // }
    createDefaultConfig()
}

function createDefaultConfig() {
    const cliConfig = {
        home: userHome, // 脚手架的主目录
    }
    cliConfig.cliHome = process.env.CLI_HOME_PATH ? path.join(userHome, process.env.CLI_HOME_PATH) : path.join(userHome, constance.DEFAULT_CLI_HOME);

    // 赋值给环境变量 用户缓存路径
    process.env.CLI_HOME_PATH = cliConfig.cliHome
}


async function checkGlobalVersion() {
    const currentVersion = pkg.version
    const latestVersion = await getNpmSemverVersions(currentVersion, 'url-join')
    if (latestVersion && semver.gt(latestVersion, currentVersion)) {
        log.warn(colors.yellow(`当前${pkg.name} 版本为:${currentVersion} 最新版本为:${latestVersion} 请手动更新`))
    }
}

// 注册命令
function registerCommands() {
    const version = pkg.version;
    program
        .name(Object.keys(pkg.bin)[0])
        .version(version)
        .usage('<command> [options]')
        .option('-d --debug', '是否开启debug模式', false)
        .option('-tp --targetPath <pathName>', '是否指定本地调试路径', '')

    program
        .command('init <projectName>')
        .option('-f --force', '当前文件名已存在,强行覆盖', false)
        .option('-m --module', '当前文件名已存在,强行覆盖', false)
        .action(exec)


    // 通过监听是否输入debug参数，是否开启debug模式
    program.on('option:debug', () => {
        process.env.LOG_LEVEL = 'verbose';
        log.level = process.env.LOG_LEVEL
        log.verbose('tset', '123123')
    })
    // targetPath 放入环境变量中
    program.on('option:targetPath', () => {
        process.env.CLI_TARGET_PATH = program.getOptionValue('targetPath');
    })

    // 处理未命中的命令 提示可以使用的命令
    program.on('command:*', (obj) => {
        const registeredCommands = program.commands.map(command => command.name())
        log.error('未知命令', obj.join(','))
        log.info('可用的命令', registeredCommands.join(','))
    })
    program.parse(process.argv)

    // 当未输入任何参数的时候或者输入未知的options 打印出帮助信息
    if (program.args.length < 1) {
        program.outputHelp();
    }

}