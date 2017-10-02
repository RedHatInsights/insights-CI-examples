# Specify base image here
FROM registry.access.redhat.com/rhel

# install node
RUN yum install -y \
        https://rpm.nodesource.com/pub_6.x/el/7/x86_64/nodejs-6.11.3-1nodesource.x86_64.rpm \
        gcc-c++ \
        make ; \
    yum clean all

# setup build account
WORKDIR /home/build

COPY . .

RUN useradd build --home-dir /home/build ; \
    chown -R build:build /home/build

USER build

RUN npm install --only=prod

CMD npm start