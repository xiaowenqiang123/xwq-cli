import { packageDirectory } from 'pkg-dir';

import { readFile } from 'fs/promises'
import path, { resolve } from 'path';
import fse from 'fs-extra'
import npminstall from 'npminstall'
import log from '@xwq-cli/log'
import { pathExists } from 'path-exists' // 判断路径是否存在

import { getDefaultRegistry, getNpmLatestVersion } from '@xwq/get-npm-info'

export default class Package {
    constructor(options) {
        const { packageName, packageVersion, storePath, targetPath } = options;
        this.packageName = packageName;
        this.packageVersion = packageVersion;
        this.storePath = storePath;
        this.targetPath = targetPath;
    }

    get catchFilePath() {
        // 拼接路径
        return path.resolve(this.storePath, `_${this.packageName}@${this.packageVersion}@${this.packageName}`)
    }

    async getRootFilePath() {
        // 获取package.json的目录
        // 读取package.json
        // 寻找入口文件 找到main
        // 不同平台的路径兼容。
        const path = await packageDirectory({ cwd: this.targetPath });
        if (path) {
            const res = await readFile(resolve(path, 'package.json'));
            if (res) {
                const file = JSON.parse(res.toString());
                return file.main ? resolve(path, file.main) : null // 会存在路径兼容的问题
            }
        }
        return null;
    }

    async install() {
        try {
            const res = await npminstall({
                root: this.targetPath,
                registry: getDefaultRegistry(),
                storeDir: this.storePath,
                pkgs: [
                    { name: this.packageName, version: this.packageVersion }
                ]

            })
        } catch (error) {
            log.error('error', '当前库不存在')
        }
    }

    async exist() {
        // 未传入 -tp的值
        if (this.storePath) {
            await this.prepare()
            return pathExists(this.catchFilePath)
        } else {
            return pathExists(this.targetPath)
        }
    }

    async prepare() {
        // 事先创建目录
        if (this.storePath && ! await pathExists(this.storePath)) {
            await fse.mkdirp(this.storePath)
        }

        // 获取到最新的版本号 用于拼接路径
        if (this.packageVersion === 'latest') {
            this.packageVersion = await getNpmLatestVersion(this.packageName)
        }
    }
    update() {
        // 1 获取最新的版本号
        // 2 检查最新版本号路径是否存在
        // 3. 不存在则直接安装最新的
    }

}

