'use strict';

var fs = require('fs');

var gulp = require('gulp');
var util = require('gulp-util');
var execSync = require('child_process').execSync;
var wrap = require('linewrap')(4, 120);


function stripHTML(line) {
    // quick and dirty HTML tag removal
    return line.replace(/<.+?>/g, '');
}


// test task that outputs insights scan results in xunit format
gulp.task('insights:xunit', function () {
    var imageID = execSync('docker images insights/jenkins-example --quiet').toString();
    // run insights scan and collect output
    const insightsCommand = 'sudo insights-client --analyze-image-id=' + imageID;
    const results = JSON.parse(execSync(insightsCommand).toString());

    // If you want to ignore a particular test, add its id to .insightsignore
    var ignore_rule = [];
    var ignore_sev = [];
    try {
        var ignore = JSON.parse(fs.readFileSync('.insightsignore').toString());
        ignore_rule = ignore.ignore_rule;
        ignore_sev = ignore.ignore_severity;
    } catch (err) {
        // file DNE
        // ignore = [];
    }

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
        if (ignore_rule.indexOf(id) != -1 ||
            ignore_sev.indexOf(report.severity) != -1 ) {
            summary.ignored++;
        }

        // skip ack'ed rules
        else if (report.acks.length > 0) {
            summary.skips++;
        }

        else {
            var test = '<testcase id="' + id + '" name="' + stripHTML(report.title.plain) + '" time="0.0">\n';
            test += '<failure message="' + stripHTML(report.summary.plain) +'" type="'+report.severity+'">\n';
            test += id + '\n\n';
            test += 'Description: ' + stripHTML(report.description.plain) + '\n\n';
            test += 'Details: ' + stripHTML(report.details.plain) + '\n\n';
            test += 'Resolution: ' + stripHTML(report.resolution.plain) + '\n';
            test += '</failure>\n';
            test += '</testcase>\n';

            tests.push(test);
        }
    }

    // output results
    var outfile = fs.openSync('insights_scan.xml', 'w+');
    fs.writeSync(outfile, '<testsuites name="Insights results">\n');
    fs.writeSync(outfile, '<testsuite name="Insights scan" tests="'+summary.tests+'" failures="'+summary.failures+
        '" ignored="'+summary.ignored+'" skipped="'+summary.skips+'" timestamp="" time="0.0">\n');
    tests.forEach(function(t) {
        fs.writeSync(outfile, t);
    });
    fs.writeSync(outfile, '</testsuite>\n');
    fs.writeSync(outfile, '</testsuites>\n');
    fs.closeSync(outfile);

});


gulp.task('test', ['insights:xunit']);
gulp.task('default', ['test']);
