[![MEAN.JS Logo](http://meanjs.org/img/logo-small.png)](http://meanjs.org/)

# The Website
This branch of the repository is for the http://meanjs.org/ website which inludes the documentation for the [MEAN.JS Project](https://github.com/meanjs/mean). 

# Testing / Contributing
This website uses [Jekyll!](http://jekyllrb.com/) to serve web pages, which means you need to install jekyll on your computer to test it! 

## Installing Jekyll:
If you already have ruby installed on your system, then this might work out of the box for you
```
gem install jekyll
```

## Installing Jekyll on Ubuntu (14.04)
```
# we need ruby and nodejs dependencies 
apt-get install ruby ruby-dev make gcc nodejs

# installing jekyll with sudo
sudo gem install jekyll
```

## To test the gh-pages documentation branch for MEAN.JS run jekyll:
```
jekyll serve
```
Jekyll will then build the documentation website locally (usually takes a few minutes), and then it will make it available on http://127.0.0.1:4000/ for browsing the project documentation locally.