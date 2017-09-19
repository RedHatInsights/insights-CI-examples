# Specify base image here
FROM registry.access.redhat.com/rhel

ENV HOME = /root
ENV APP_ROOT = $HOME/app

WORKDIR $HOME

COPY insights-client* .
RUN yum install -y ./insights-client*
