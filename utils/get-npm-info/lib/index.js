
import urlJoin from 'url-join'
import axios from 'axios'
import semver from 'semver'
async function getNpmInfo(pkgName, registry) {
    if (!pkgName) {
        return null
    }

    const reg = registry || getDefaultRegistry();

    const url = urlJoin(reg, pkgName);

    const res = await axios.get(url)

    return res.data;

}


export function getDefaultRegistry(isOrigin = false) {
    return isOrigin ? 'https//registry.npmjs.org' : 'https://registry.npm.taobao.org'
}

async function getNpmVersions(pkgName, registry) {
    const versions = (await getNpmInfo(pkgName, registry)).versions;
    return versions ? Object.keys(versions) : null

}

// 获取高于当前的版本号
function getSemverVersions(baseVersion, versions) {
    return versions
        .filter(version =>
            semver.satisfies(version, `>=${baseVersion}`)
        )
        .sort((a, b) => {
            return semver.gt(b, a) ? 1 : -1
        })

}

export async function getNpmSemverVersions(baseVersion, pkgName, registry) {
    const versions = await getNpmVersions(pkgName, registry);
    const newVersions = getSemverVersions(baseVersion, versions);
    console.log(newVersions, 'newVersions')
    if (newVersions && newVersions.length > 0) {
        return newVersions[0]
    }
    return null
}


export async function getNpmLatestVersion(pkgName, registry) {
    const versions = await getNpmVersions(pkgName, registry);
    if (versions) {
        return versions
            .sort((a, b) => {
                return semver.gt(b, a) ? 1 : -1
            })[0]
    }
    return null


}

