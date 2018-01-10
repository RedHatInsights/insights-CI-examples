# Jenkins Integration
1. Create a new pipeline.
2. Using 'pipeline from SCM', select this repository.
3. Set script path to `examples/jenkins/Jenkinsfile`
4. Save
5. Click `Build Now` to run a Jenkins build.
6. When build is finished, observe the results by clicking on the build in the `Build History` pane.
7. Observe any failed tests.

If you want to ignore any specific error keys, or severity during the build, edit the `.insightsignore` file and commit this change to the repo. The `.insightsignore` file is a JSON-formatted file that looks like the following:

```
    "ignore_rule": [
    ],
    "ignore_severity": [
        "INFO",
        "WARN",
        "ERROR"
    ]
```
In this example config, we ignore all but CRITICAL severity rules.
