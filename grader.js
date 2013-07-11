#!/Usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "http://safe-shelf-8421.herokuapp.com/";


//returns file name if file exists otherwise logs error
 var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    //console.log(instr);
    return instr;
};

/*

 var assertHTMLExists = function(inurl) {
  rest.get(inurl).on('complete', function(result) {
    if (result instanceof Error) {
      console.log('Error: ' + result.message);
      process.exit(1); 
    } else {
       var instr;
    }
  });    
}; 


assertHTMLExists('www.yahoo.com');

*/

//cheerio is like beautiful soup in python. Allows us to access the dom elements via api

var cheerioHtmlFile = function(input) {
   return cheerio.load(fs.readFileSync(input));
};

//json.parse convets a json string to a javascript object. Returns an object or an array.

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(input, checksfile, key) {
    if (key == 'f') //if it is a file, load from file.
        $ = cheerioHtmlFile(input);
    else //if not, it is html code
        $ = cheerio.load(input);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    //javascript supports java style for loop and python style for loop as well
    for(var ii in checks) {
       //The checks array will contain information regarding the dom object, its prev, next and the parent. To see this output uncomment the console.log line below.  
       var present = $(checks[ii]).length > 0;
       //console.log($(checks[ii]));
       //dictionary from array  
       out[checks[ii]] = present;
    }
    return out;
};


// helper function for url, uses rest api. 
var checkURL = function(url, checksfile) {
   rest.get(url).on('complete', function(result) {
    if (result instanceof Error) {
      console.log('Error: ' + result.message);
      process.exit(1); 
    } else {
        var checkJson = checkHtmlFile(result, checksfile);
        var outJson = JSON.stringify(checkJson, null, 4);
        console.log(outJson);
    }
  });
} 

/* clones a function. this way we can add data to the second function without affecting the first function. see the example below. 

var funcB = funcA.clone(); // where clone() is my extension
funcB.newField = {...};    // without affecting funcA

*/

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};


if(require.main == module) {
    
    //commander is like arg parse in python. Parses the command line arguments, displays help etc.,See CommanderTest.js for sample usage
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <url_html>', 'URL of the index file')
        .parse(process.argv);

    // takes the html file and json file and 
    if (program.url){
      var checkJson = checkURL(program.url, program.checks);
    } else {    
      var checkJson = checkHtmlFile(program.file, program.checks,'f');    
      var outJson = JSON.stringify(checkJson, null, 4);
      console.log(outJson);
    }
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
