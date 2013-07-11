#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander');

program
  .version('0.0.1')
  .option('-p, --peppers', 'Add peppers')
  .option('-P, --pineapple', 'Add pineapple')
  .option('-b, --bbq', 'Add bbq sauce')
  .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble') //type is the variable here, default is marble. 
  .parse(process.argv);

console.log('you ordered a pizza with:');
if (program.peppers) console.log('  - peppers');
if (program.pineapple) console.log('  - pineapple');
if (program.bbq) console.log('  - bbq');
console.log('  - %s cheese', program.cheese);

/*

Invocation

./Commandertest.js
>> you ordered a pizza with:
    - marble cheese


./Commandertest.js -p or ./Commandertest.js -peppers
>> you ordered a pizza with:
    - peppers
    - marble cheese

./Commandertest.js -c Pepperjack

>> you ordered a pizza with:
    - Pepperjack cheese
*/
