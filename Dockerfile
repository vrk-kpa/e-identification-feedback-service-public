# Pull base image
FROM e-identification-docker-virtual.vrk-artifactory-01.eden.csc.fi/e-identification-base-node

# Deploy project
ADD ./src /data00/deploy/src
ADD ./package.json /data00/deploy/
COPY conf/ansible /data00/templates/store/ansible
COPY feedback.yml.template /data00/templates/store/

RUN cd /data00/deploy && \
    npm install

# Expose port
EXPOSE 8443

# Set default command on run
CMD node --harmony /data00/deploy/src/app.js --configPath=/data00/deploy/config/feedback.yml
