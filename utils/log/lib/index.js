
import log from 'npmlog';
// 判断是否debug模式
log.level = process.env.LOG_LEVEL ?? 'info';

// log.heading = 'xwq-cli';

log.addLevel('success', 2000, { fg: 'red', bold: true })

export default log


