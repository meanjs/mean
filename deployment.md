# Deployment

## Overview

We user [Heroku](https://heroku.com/) with [Github](https://github.com/) as our deployment platform. Our workflow includes review branches, a development site, and a production site. Currently, Heroku is set up to link all three of these in a pipeline. More details are provided below.

For database hosting, we use [mlab](https://mlab.com/home/) and have three databases. One is for testing. One is for development, and one is for production.

## Credentials

To gain access to Heroku, mlab, or to be added to the repo, please email ryanclementsuf@gmail.com or fluidmdiff@yahoo.com. For security reasons, we are not putting credentials in the repo.

## Github

The way we set up github isn't special. The way branches are set up in git hub are as follows:
```

| Master
 \ 
  | Develop
   \
    | Your Branch
    
```

## Heroku

### General Overview

Heroku CLI is not needed for deployment. We spent a lot of work to avoid having to deploy via the command line because of the horrendous documentation and host of issues we faced with it. In addition, it is so much easier to have heroku take care of those things for us.

We set up a pipeline with three stages in heroku. The first stage is review branches, which creates a site for each pull request you make. The second stage is our test site which auto deploys every time a merge is made into the develop branch in github. The third stage is our production site, which gets deployed to when you press a button on the test site stage.

### Review branches

Review branches auto deploy whenever a pull request is created in github. It is highly recommended that these are frequently used in development. We have personally seen so many UI and deployment issues early on because of this feature. Because we could catch bugs earlier, we could fix them faster.

### Necessary files

Deployment works in heroku because of two files. The first is called "Procfile" which is in the root directory of the repo. This file contains the command heroku will run to start the app. This file is necessary regardless of whether auto deployment is set up. For the purposes of this app, it is unlikely that this file will ever change. The other file is called "app.json" which is also in the root directory. This file contains information for heroku to create review apps. In this file you would put any information about environment variables, addons, and such that heroku would need to know to dynamically create an app.

### Settings

The apps in heroku are able to connect with mlab because of the config vars we put in which can be configured in the settings section of each of the apps. Additionally, we hooked up the pipeline in heroku to github via the settings tab. This integration includes review branches, and auto deployment.