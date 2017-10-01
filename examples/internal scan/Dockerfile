# Specify base image here
FROM registry.access.redhat.com/rhel

# install insights client
RUN yum -y --enablerepo=rhel-7-server-insights-3-rpms install insights-client ; \
    yum clean all

# install node
RUN yum install -y \
        https://rpm.nodesource.com/pub_6.x/el/7/x86_64/nodejs-6.11.3-1nodesource.x86_64.rpm \
        gcc-c++ \
        make ; \
    yum clean all

# install build tools
RUN su -c 'npm install -g gulp-cli'

# setup build account
RUN adduser build

ENV HOME = /home/build
ENV APP_ROOT = $HOME/app
WORKDIR $HOME

USER build
