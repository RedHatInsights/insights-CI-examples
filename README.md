This repository contains information to help you integrate Insights docker-format image 
scanning into a build or CI/CD pipeline.  See the README files in each examples for more
information.  Generally, the insights integration code is in the associated gulpfiles.


## Introduction
There are many ways to build an image but they generally fall into two categories: builds 
that directly produce the image and builds that produce content that gets injected into an
image by a separate process.  The latter category exists largely because creating an image
effectively requires root privileges and centralized build services are typically
unwilling to let users run arbitrary build code at such an elevated privilege.  Open Shift
Source-to-image (S2I) builds are one example of this approach.

Insights supports scanning local images by specified id as well as scanning
from within a running container and easily integrates into either type of build.

The results of an Insights scan on an image or container are returned immediately
and are not stored by Red Hat - they will not show up on http://access.redhat.com/insights

## Installing the Insights Client
To install the insights client you will need a properly entitled Red Hat Network (RHN) 
subscription and a registered Red Hat Enterprise Linux (rhel) system.

If you are installing the client on a build machine then that machine should be registered.

If you are installing the client inside a builder image then you have two options:

- Register the image itself, then install the client, then unregister the system (be careful
about publishing a registered image: it will contain your registration credentials!)

- The rhel 7 base image will inherit the RHN credentials of its host, so you
can just build your builder image on a registered system.  For example: if you run rhel 7
on your laptop, and your laptop is registered, a container running a rhel 7 image will
inherit your laptop's registration and can yum install any software your laptop is
entitled to.

In either case, install the client by:
```
# yum -y --enablerepo=rhel-7-server-insights-3-rpms install insights-client
```

## Configuring the Insights Client
For either style of build the client requires proper credentials to scan an image.  

If the client is installed on a registered system it will use the RHN credentials by
default.

In the builder image case you will need to provide basic authentication credentials through
the INSIGHTS_USERNAME and INSIGHTS_PASSWORD environment variables.  You can alternately
supply credentials in /etc/insight-client/insights.conf.

## Running the Insights Client
To scan an image, use the --analyze-image-id option.  Pass the id of the image to scan
a particular image or omit it if running the client within a container.

External case:
```
$ insights-client --analyze-image-id=4a974767fba6
```

Insights client inside container:
```
$ insights-client --analyze-container
```

## Interpreting the Results
The client will write the results of the scan to stdout in the following format.  Results are not saved by Red Hat 
and will not be available at http://access.redhat.com/insights

Client JSON response:

```
{
  "version": "1.3",
  "system": {},
  "reports": {
    "rule_id": {
      "rule_data": {},
      "title": {
        "plain": "markdown format title",
        "html": "<p>html format title<p/>"
      },
      "summary": {},
      "description": {},
      "details": {},
      "reference": {},
      "resolution": {},
      "severity": "INFO",
      "category": "Security",
      "impact": "1",
      "likelihood": "1",
      "reboot_required": false,
      "acknowledged": false
    }
  },
  "upload": {
  }
}
```