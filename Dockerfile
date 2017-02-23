# Pull base image
FROM dev-docker-registry.kapa.ware.fi/e-identification-base-node

# Deploy project
ADD ./src /data00/deploy/src
ADD ./package.json /data00/deploy/
COPY conf/ansible /data00/templates/store/ansible

RUN cd /data00/deploy && \
    npm install

# Expose port
EXPOSE 8443

# Set default command on run
CMD node --harmony /data00/deploy/src/app.js --configPath=/data00/deploy/config/feedback.yml
