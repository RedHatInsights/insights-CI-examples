This repository contains information to help you integrate Insights docker-format image 
scanning into a build or CI/CD pipeline.  See the examples directory for sample code.


## Introduction
There are many ways to build an image but they generally fall into two categories: builds 
that directly produce the image and builds that produce content that gets injected into an
image by a separate process.  The latter category exists largely because creating an image
effectively requires root privileges and centralized build services are typically
unwilling to let users run arbitrary build code at such an elevated privilege.  Open Shift
Source-to-image (S2I) builds are one example of this approach.

Insights supports scanning local images by specified id as well as scanning
from within a running container and easily integrates into either type of build.

## Installing the Insights Client
To install the insights client you will need a properly entitled Red Hat Network (RHN) 
subscription and a registered Red Hat Enterprise Linux (rhel) system.

If you are installing the client on a build machine then that machine should be registered.

If you are installing the client inside a builder image then you have two options:

- Register the image itself, then install the client, then unregister the system (be careful
about publishing an image containing registration credentials!)

- The rhel 7 base image will inherit the RHSM credentials of its host (<links!>), so you 
can just build your builder image on a registered system.

In either case, install the client by:

```
# yum --enablerepo=rhel-7-server-insights-3-rpms install insights-client
```

## Configuring the Insights Client
For either style of build the client requires proper credentials to scan an image.  

If the client is installed on a registered system it will use the RHSM credentials by 
default.

In the builder image case you will need to provide basic auth credentials either by
storing them in /etc/insight-client/insights.conf (<check>) or, preferably, through environment
variables (<get vars from Richard>)

## Running the Insights Client
You will likely want to include Insights scanning
as part of other testing performed on the image.  Simply install the Insights client 
alongside your other test tools and run a scan as part of your test suite.

For the external case:
For builder images:
< get the magic flags from Richard and document those here>

## Interpreting the Results
- document json format?

- for rhel systems only

