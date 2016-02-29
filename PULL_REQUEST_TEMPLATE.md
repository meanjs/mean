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
