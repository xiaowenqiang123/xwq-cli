#!/usr/bin/env node



import { fileURLToPath } from 'url'
import importLocal from 'import-local'
import core from '../lib/index.js'
if (importLocal(fileURLToPath(import.meta.url))) {
    log.info('cli', '正在使用本地的库')
} else {
    core(process.argv.slice(2))
}

// const commander = require('commander'); // include commander in git clone of commander repo
// const program = new commander.Command();

// program9
//     .version('0.1.0')
//     .argument('<username>', 'user to login')
//     .argument('[password]', 'password for user, if required', 'no password given')
//     .action((username, password) => {
//         console.log('username:', username);
//         console.log('password:', password);
//     }).parse(process.argv);

// const options = program.opts();
// console.log(options)
// // if (options.debug) console.log(options);
// // console.log('pizza details:');
// // if (options.small) console.log('- small pizza size');
// // if (options.pizzaType) console.log(`- ${options.pizzaType}`);

// // // Try the following:
// // //    node options-common.js -p
// // //    node options-common.js -d -s -p vegetarian
// // //    node options-common.js --pizza-type=cheese
// // console.log(options)