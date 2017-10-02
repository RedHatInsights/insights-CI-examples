'use strict';

var fs = require('fs');

var gulp = require('gulp');
var util = require('gulp-util');
var execSync = require('child_process').execSync;
var wrap = require('linewrap')(4, 120);
var mocha = require('gulp-mocha');

// run mocha tests
gulp.task('mocha', function() {
    return gulp.src(['test/*.test.js'], { read: false })
    .pipe(mocha({
        reporter: 'spec'
    }));
});

// run Insights scan
gulp.task('insights', function (done) {
    // run insights scan and collect output
    const insightsCommand = 'insights-client --analyze-container';
    const results = JSON.parse(execSync(insightsCommand).toString());

    var found = 0;
    var processed = 0;

    // If you want to ignore a particular test, add its id to .insightsignore
    var ignore = fs.readFileSync('.insightsignore').toString().replace(/"|'/g, '').split("\n");

    // loop through each report in the response
    console.log();
    for (var id in results.reports) {
        var report = results.reports[id];
        processed++;

        if (ignore.indexOf(id) != -1) {
            console.log(util.colors.cyan('Ignoring rule:'), id);
        }

        else if (report.acks.length > 0) {
            console.log(util.colors.cyan('Skipping acknowledged rule:'), id);
        }

        else {
            found++;

            // print a quick summary of the report
            console.log(util.colors.blue('\n           **** ' + id + ' ****\n'));
            console.log(util.colors.green('title:\n'), wrap(report.title.plain));
            console.log(util.colors.green('\nseverity:'), report.severity, util.colors.green('     category:'), report.category);
            console.log(util.colors.green('\nsummary:\n'), wrap(report.summary.plain));
            console.log(util.colors.green('\ndescription:\n'), wrap(report.description.plain));
            console.log(util.colors.green('\ndetails:\n'), wrap(report.details.plain));
            console.log(util.colors.green('\nresolution:\n'), wrap(report.resolution.plain));
            console.log();
        }
    }

    console.log(util.colors.blue('\nReports Processed:'), processed, util.colors.blue('   Problems Found:'), found, '\n');

    //
    if (found > 0) {
        console.log(util.colors.red('Test Failed!\n'));
    }

    done((found ? -1 : 0));
});


// test task that outputs insights scan results in xunit format
gulp.task('insights:xunit', function () {
    // run insights scan and collect output
    const insightsCommand = 'insights-client --analyze-container';
    const results = JSON.parse(execSync(insightsCommand).toString());

    // If you want to ignore a particular test, add its id to .insightsignore
    var ignore = fs.readFileSync('.insightsignore').toString().replace(/"|'/g, '').split("\n");

    var summary = {
        tests: 0,
        failures: 0,
        ignored: 0,
        skips: 0
    };

    var tests = [];

    // loop through each report in the response
    for (var id in results.reports) {
        var report = results.reports[id];
        summary.tests++;

        // ignore rules in .insightsignore
        if (ignore.indexOf(id) != -1) {
            summary.ignored++;
        }

        // skip ack'ed rules
        else if (report.acks.length > 0) {
            summary.skips++;
        }

        else {
            var test = '<testcase classname="' + id + '" name="' + report.title.plain + '" time="0.0">\n';
            test += '<failure message="'+report.summary.plain+'" type="'+report.severity+'">\n';
            test += 'Description: ' + report.description.plain + '\n\n';
            test += 'Details: ' + report.details.plain + '\n\n';
            test += 'Resolution: ' + report.resolution.plain + '\n';
            test += '</failure>\n';
            test += '</testcase>\n';

            tests.push(test);
        }
    }

    // output results
    var outfile = fs.openSync('insights_scan.xml', 'w+');
    fs.writeSync(outfile, '<testsuite name="Insights scan" tests="'+summary.tests+'" failures="'+summary.failures+
        '" ignored="'+summary.ignored+'" skipped="'+summary.skips+'" timestamp="" time="0.0">\n');
    fs.writeSync(outfile, tests);
    fs.writeSync(outfile,  '</testsuite>\n');
    fs.closeSync(outfile);

});


gulp.task('test', ['insights']);
gulp.task('default', ['test']);
