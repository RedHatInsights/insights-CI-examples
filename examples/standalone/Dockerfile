# Specify base image here
FROM registry.access.redhat.com/rhel

# install insights client
RUN yum install -y http://insights-api.usersys.redhat.com/repo/insights-client-3.0.0-0.fc26.noarch.rpm ; \
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
