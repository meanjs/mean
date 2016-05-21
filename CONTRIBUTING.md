# How to contribute

Support and contributions from the open source community are essential for keeping
MEAN.js up to date and always improving! There are a few guidelines that we need
contributors to follow to keep the project consistent, as well as allow us to keep
maintaining MEAN.js in a reasonable amount of time.

## Creating an Issue

Before you create a new Issue:
* Check the [Issues](https://github.com/meanjs/mean/issues) on Github to ensure one doesn't already exist.
* Clearly describe the issue, including the steps to reproduce the issue.
* If it's a new feature, enhancement, or restructure, Explain your reasoning on why you think it should be added, as well as a particular use case.

## Making Changes

* Create a topic branch from the master branch.
* Check for unnecessary whitespace / changes with `git diff --check` before committing.
	* Also check that your code is formatted properly with spaces (hint: Use [.editorconfig](http://editorconfig.org/))
* Keep git commit messages clear and appropriate
	* If possible, please "squash" your commits to as few commits as possible/reasonable such as one commit for implementation, one for tests, and one for documentation before finally squashing to one commit when getting the LGTM from a collaborator.
  * Follow the commit message guidelines below.
* Make Sure you have added any tests necessary to test your code.
	* Run __all__ the tests to ensure nothing else was accidently broken.
	* Don't rely on the existing tests to see if you've broken code elsewhere; test the changes you made in a browser too!
* Update the Documentation to go along with any changes in functionality / improvements in a separate pull request against the gh-pages branch.

## Commit Message Guidelines
```
Header
Blank Line
Body
Blank Line
Footer

The header should look like:
<type>(<scope>): <subject>

The body should have any necessary detailed info about the commit:
An example, references as to where this idea came from, etc.

The footer should have all the issues tagged:
Fixes #123, Fixes #456

So a commit should like like:
feat(users): Add new Yahoo authentication

Yahoo authentication idea proposed by @codydaig
Example implementation in file.js

Fixes #82
```

* Types: 
  * feat - Features, Enhancements, and overall Improvements
  * fix - Fixes, Bugs, HotFixs, etc...
  * doc - Changes to the Documentation and doesn't actually touch any code.
* Scope:
  * The scope should be where the change took place.
  * Examples: users, core, config, articles
* Subject:
  * The subject line should be clear and concise as to what is being accomplished in the commit.
* General Rules:
  * No Line in the Commit message can be longer than 80 characters.
* Refrence: [Angular Conventions](https://github.com/ajoslin/conventional-changelog/blob/master/conventions/angular.md)


## Submitting the Pull Request

* Push your changes to your topic branch on your fork of the repo.
* Submit a pull request from your topic branch to the master branch on the MEAN.JS repository.
* Be sure to tag any issues your pull request is taking care of / contributing to.
	* By adding "Closes #xyz" to a commit message will auto close the issue once the pull request is merged in.
* Small changes are usually accepted and merged in within a week (provided that 2 collaborators give the okay)
* Larger changes usually spark further discussion and possible changes prior to being merged in.

## Documentation (meanjs.org)

The code for the documentation and the website are located in the meanjs/mean repo on the gh-pages branch. The website is hosted by github pages and generated using jekyll. See the README in the gh-pages branch for more information on how to get your dev enviorment set-up.

## Generating a new Release

For those who will be generating releases:
* Don't forget to update the changelog!
  * `conventional-changelog -r 1 | cat - CHANGELOG.md | tee CHANGELOG.md`
