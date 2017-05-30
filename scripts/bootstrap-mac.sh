#!/bin/bash
echo "  Installing Mean.js prerequisites."
echo ""

# Check for Homebrew
if [ -z `which brew` ];
then
  echo "  Installing Homebrew for you."
    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)" > /tmp/homebrew-install.log
fi

# Make sure we’re using the latest Homebrew
brew update

# Tap versions to install older packages
brew tap homebrew/versions

# Upgrade any already-installed formulae
brew upgrade
echo ""

echo "  Installing Nodejs using NVM."
brew install nvm
source $(brew --prefix nvm)/nvm.sh
nvm install 0.12.7
echo ""
echo "*************************************************************************"
echo "** Please add \`source \$(brew --prefix nvm)/nvm.sh\` to your             **"
echo "** ~/.profile to source nvm on login.                                  **"
echo "*************************************************************************"
echo ""

echo "  Installing Mongodb."
brew install mongodb
echo ""
echo "*************************************************************************"
echo "**  Please create the data dir before running mongod:                  **"
echo "**  \`mkdir -p /data/db\`                                                **"
echo "*************************************************************************"
echo ""

echo "  Installing Bower."
npm install -g bower
echo ""

echo "  Installing Grunt."
npm install -g grunt-cli
echo ""

echo "  Installing Sass."
gem install sass
echo ""
