# How to contribute

Support and contributons from the open source community are essential for keeping
MEAN.js up to date and always improving! There are a few guildlines that we need
contributors to follow to keep the project consistent, as well as allow us to keep
maintaining MEAN.js in a reasonable amount of time.

## Getting Started

Before you begin making changes:
* Submit an Issue on Github, assuming one does not already exist.
* Clearly describe the issue, including the steps to reproduce the issue.
	* If it's a new feature, enhancement, or restructure, Explain your reasonings on why you think it should be added, as well as a particular use case.

## Making Changes

* Create a topic branch from the master branch.
* Check for unnecessary whitespace / changes with `git diff --check` before committing.
	* Also check that your code is formatted properly with spaces (hint: Use .editorconfig)
* Keep git commit messages clear and appropriate
	* If possible, please "squash" your commits to as few commits as possible/reasonable.
* Make Sure you have added any tests necessary to test your code.
	* Run __all__ the tests to ensure nothing else was acciddently broken.
	* Don't rely on the existing tests to see if you've broken code elsewhere, test the changes you made in a browser to!
* Update the Documentation too go along with any changes in functionality / improvements in a seperate pull request against the gh-pages branch.

## Submitting the Pull Request
* Push your changes to your topic branch on your fork of the repo.
* Submit a pull request from your topic branch to the master branch on the MEANJS repository.
* Be sure to tag any issues your pull request is taking care of / contributing to.
* Small changes are usually accepted and merged in within a week (provided that 2 collaborators give the okay)
* Larger changes usually spark further discussion and possible changes prior to being merged in.
