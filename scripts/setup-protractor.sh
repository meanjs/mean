#!/bin/bash -x

if [[ "$TRAVIS_NODE_VERSION" == "6" || "$TRAVIS_NODE_VERSION" == "7" ]]
then
  npm install protractor
  export DISPLAY=:99.0
  bash -e /etc/init.d/xvfb start
  ./node_modules/protractor/bin/webdriver-manager update --standalone --firefox
  ./node_modules/protractor/bin/webdriver-manager start 2>&1 &
fi
