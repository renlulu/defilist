var fs = require('fs');
const execSync = require('child_process').execSync;
// import { execSync } from 'child_process';  // replace ^ if using ES modules

// const output = execSync('ls', { encoding: 'utf-8' });  // the default is 'buffer'
// console.log('Output was:\n', output);

var files = fs.readdirSync('.');
files.forEach(file => {
    console.log(file);
    const output = execSync('truffle-flattener ' + file + ' >> ' + '../flatten/' + file , { encoding: 'utf-8' });
    console.log('Output was:\n', output);
})