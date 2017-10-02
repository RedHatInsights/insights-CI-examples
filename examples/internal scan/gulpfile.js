'use strict';

var gulp = require('gulp');
var util = require('gulp-util');
var execSync = require('child_process').execSync;
var wrap = require('linewrap')(4, 120);
var fs = require('fs');

gulp.task('test', function (done) {
    // start insights scan and collect output
    const insightsCommand = 'cat output.json';
    const results = JSON.parse(execSync(insightsCommand).toString());

    var found = 0;
    var processed = 0;

    var ignore = fs.readFileSync('.insightsignore').toString().replace(/"|'/g, '').split("\n");

    // loop through each report in the response
    console.log();
    for (var id in results.reports) {
        var report = results.reports[id];
        processed++;

        if (ignore.indexOf(id) != -1) {
            console.log(util.colors.cyan('Ignoring rule:'), id);
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

    if (found > 0) {
        console.log(util.colors.red('Test Failed!\n'));
    }

    done((found ? -1 : 0));
});

