# Build:
# docker build -t meanjs/mean .
#
# Run:
# docker run -it meanjs/mean
#
# Compose:
# docker-compose up -d
FROM ubuntu:latest
MAINTAINER MEAN.JS

# Set development environment as default
ENV NODE_ENV development

# 80 = HTTP, 443 = HTTPS, 3000 = MEAN.JS server, 5858 = node debug, 35729 = livereload
EXPOSE 80 443 3000 5858 35729

# Install Utilities
RUN curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash - \
 && apt-get update -q \
 && apt-get install -yqq \
 wget \ 
 aptitude \
 htop \
 vim \
 git \
 traceroute \
 dnsutils \
 curl \
 ssh \
 sudo \
 tree \
 tcpdump \
 nano \
 psmisc \
 gcc \
 make \
 build-essential \
 libfreetype6 \
 libfontconfig \
 libkrb5-dev \
 ruby \
 nodejs \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install gem sass for grunt-contrib-sass
RUN gem install sass

ADD . /opt/mean.js
WORKDIR /opt/mean.js

RUN mkdir -p /opt/mean.js/public/lib \
 && npm install --quiet -g grunt-cli gulp bower yo mocha karma-cli pm2 \
 && npm install --quiet \
 && bower install --quiet --allow-root --config.interactive=false \
 && npm cache clean 
 
# Run MEAN.JS server
CMD ["npm", "start"]
