[33mcommit 4f89e8266e5b2b5f6b1836097436a79a4162bda1[m
Author: Andrew Throener <athroener@gmail.com>
Date:   Tue Sep 1 10:00:28 2015 -0500

    test fix

[33mcommit c980198e2e539eb362433e9f5eeb245f01eb0572[m
Author: Andrew Throener <athroener@gmail.com>
Date:   Tue Sep 1 09:58:38 2015 -0500

    Removed resolve from list and created controller test

[33mcommit 2f6e6f91216ae537f94d0cae96a103eefe4557b7[m
Merge: fd82800 40cc691
Author: Andrew Throener <athroener@gmail.com>
Date:   Tue Sep 1 09:37:23 2015 -0500

    Conflict fixes

[33mcommit 40cc69161e1a0ae184d82d7d61f2d15f2978dd2c[m
Merge: 7051345 57079e2
Author: Liran Tal <liran.tal@gmail.com>
Date:   Tue Sep 1 16:35:40 2015 +0300

    Merge pull request #864 from codydaig/bug/cfconfig
    
    [bug] Remove non CF specific files [closes #861]

[33mcommit 70513452b017e33ee09ac95c8206d967cb58a493[m
Merge: 0e3f638 7c286b0
Author: Liran Tal <liran.tal@gmail.com>
Date:   Tue Sep 1 16:22:36 2015 +0300

    Merge pull request #811 from lirantal/feature/code-coverage
    
    Adding coverage report for server-side tests using istanbul

[33mcommit 0e3f638a5103ece0751bb685319b27da88daa263[m
Merge: 16b481f e1d69b8
Author: Liran Tal <liran.tal@gmail.com>
Date:   Tue Sep 1 13:38:31 2015 +0300

    Merge pull request #851 from lirantal/feature/security-nsp-ci-packages-up-to-date
    
    Security check as part of our CI

[33mcommit 16b481fa2e46088398d4a96b9808aacc149072a7[m
Merge: 8335aa7 14b8dd4
Author: Liran Tal <liran.tal@gmail.com>
Date:   Mon Aug 31 08:58:45 2015 +0300

    Merge pull request #863 from mleanos/hotfix/user-model-tests-roles
    
    [hotfix] Fixed User model tests

[33mcommit 57079e22ece4cde0aef427eee163810a141c4731[m
Author: Cody B. Daig <cody@daig.me>
Date:   Sun Aug 30 22:02:15 2015 -0700

    Remove non CF specific files

[33mcommit 14b8dd4dce27776a61673523a2af39c1d4f81b45[m
Author: mleanos <michael.leanos@gmail.com>
Date:   Sun Aug 30 15:53:29 2015 -0700

    Fixed User model tests
    
    PR #840 changed the global var `user` to `user1`. This was merged and
    then #858 was merged, which was still referencing the global var as
    `user` in the new *roles* tests. This was causing jshint failures from
    the new
    
    This change updates the new *roles* tests to use `user1`

[33mcommit 8335aa7070e7cbd258db3f0c3e8d9796e6e7ca9e[m
Merge: 6af137d 263adcc
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sun Aug 30 21:55:58 2015 +0300

    Merge pull request #858 from mleanos/admin-users-require-role
    
    Admin users require role

[33mcommit 6af137d81a51847627c024c20172e7dbf280a5e6[m
Merge: 67491a8 6db8a4e
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sun Aug 30 21:22:28 2015 +0300

    Merge pull request #840 from lirantal/feature/users_module_tests_%
    
    Major Fixing and Refactoring tests

[33mcommit 67491a8198f0919b216cf22150a5ae526334d847[m
Merge: 85d2a1a 80b63b5
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sat Aug 29 13:23:47 2015 +0300

    Merge pull request #845 from lirantal/feature/sessionCookie-refactoring-params
    
    Session Cookie Configuration enhancements

[33mcommit 263adccd443c53659b45b390f7fcfc875f980c99[m
Author: mleanos <michael.leanos@gmail.com>
Date:   Fri Aug 28 18:19:33 2015 -0700

    User model tests for roles
    
    Added tests for the User model's roles field.
    
    Should be able to update existing user with valid roles
    Should NOT be able to update existing user WITHOUT a role
    Should NOT be able to update existing user with INVALID role

[33mcommit bbbe8772f2e9e51ee89eec1826551b14e35b8048[m
Author: mleanos <michael.leanos@gmail.com>
Date:   Fri Aug 28 17:41:13 2015 -0700

    Admin Users require role
    
    These changes make the role field required in the User model. Changes to
    the Admin user edit view were added to provide validation for the role
    field.
    
    As an added enhancement, the user's roles are displayed in the Admin
    user list view.

[33mcommit 85d2a1a943ccb5a3cfdb801e20fafff16924ea1f[m
Merge: e03b892 1fa9776
Author: Liran Tal <liran.tal@gmail.com>
Date:   Fri Aug 28 21:50:59 2015 +0300

    Merge pull request #853 from Gym/task-enhancements
    
    Gulp task enhancements - template cache

[33mcommit e03b892ff0ce283188d5187011650f63ffea4044[m
Merge: e415dc3 814b856
Author: Liran Tal <liran.tal@gmail.com>
Date:   Fri Aug 28 04:34:26 2015 +0300

    Merge pull request #832 from codydaig/fix/dockerSASS
    
    [fix] Install ruby and SASS with Docker [Closes #789]

[33mcommit e1d69b8c770bd261dc6b921290a62193eacbe2b2[m
Author: Liran Tal <liran.tal@gmail.com>
Date:   Mon Aug 24 19:37:57 2015 +0300

    Adding the NSP tool to audit our packages version for known security vulnerabilities as part of the CI process

[33mcommit e415dc33ebe44f334fda4cb83fb9b5c14bf82573[m
Merge: a004b66 8128570
Author: Liran Tal <liran.tal@gmail.com>
Date:   Thu Aug 27 21:44:08 2015 +0300

    Merge pull request #852 from mleanos/chat-empty-message
    
    [fix] Empty Chat Messages

[33mcommit a004b662898368257ccf97347816e39e4721e905[m
Merge: ff59de0 ab82acb
Author: Ilan Biala <ilan.biala@gmail.com>
Date:   Thu Aug 27 00:26:31 2015 -0400

    Merge pull request #850 from vaucouleur/filenames
    
    Rename files using convention verb-object.client

[33mcommit fd8280040be396f54b3989961de742207dbdbd23[m
Author: Andrew Throener <athroener@gmail.com>
Date:   Wed Aug 26 18:53:08 2015 -0500

    Reverted to action- views

[33mcommit 6db8a4e4fa6cdaa56217408529ca7302be79f468[m
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sat Aug 22 19:26:52 2015 +0300

    Major Fixing and Refactoring tests
    
    1. Refactoring variables usage through-out the tests
    2. Fixing correct error handler tests were previously these would report a false positive isue
    3. Fixing recent unit tests to be added as part of the main save method suite
    4. Fixing an issue with the tests which didn't clean the user1 entry in the db and so tests following it would fail regardless of the validation
    5. Fixing one test to actually be valid use case

[33mcommit ab82acb51b36f56ce587a9b8f20ef66de7aa1fdf[m
Author: Sebastien Vaucouleur <sebastien@vaucouleur.com>
Date:   Mon Aug 24 20:30:58 2015 +0200

    Renamed files using convention verb-object.client.etc. Closes #817
    
    Renamed files using convention verb-object.client.etc. Closes #817

[33mcommit ff59de0c2052e3fd714af24a3276a145c7dd35a1[m
Merge: 01bd98b 3bf07fe
Author: Liran Tal <liran.tal@gmail.com>
Date:   Wed Aug 26 11:36:32 2015 +0300

    Merge pull request #774 from Gym/remove-data-prefix
    
    Remove 'data' prefix from attributes

[33mcommit 1fa977679c967e17adc12537db6880cf60335e8d[m
Author: Ryan Hutchison <rhutchison@asicentral.com>
Date:   Fri Jul 24 20:28:04 2015 -0400

    Task enhancements
    
    lint is already referenced in build task.
    
    missing env:prod
    
    add client/server test tasks
    
    Add template cache and autoprefixer.
    
    Update .jshintrc

[33mcommit 9bff102ba1cfc16f9fa8fa3ede252dae81c0b82e[m
Author: Andrew Throener <athroener@gmail.com>
Date:   Tue Aug 25 23:35:43 2015 -0500

    View name updates.  Test updates

[33mcommit 3bf07fe4ec54f640e07ad9b656a267e0dc4ef3e8[m
Author: Ryan Hutchison <ryan@gym.com>
Date:   Fri Aug 7 23:53:32 2015 -0400

    Remove data- prefix from attributes

[33mcommit 01bd98b386c0b2a459befb9bcf3762e50b1e5381[m
Merge: 05355b9 8015476
Author: Liran Tal <liran.tal@gmail.com>
Date:   Tue Aug 25 16:19:22 2015 +0300

    Merge pull request #759 from Gym/client-side-validation
    
    client-side form validation with ng-messages.

[33mcommit 05355b986dafb4e9e8fd62bf88a0bd39bb6af9e6[m
Merge: 2b015b0 b249512
Author: Liran Tal <liran.tal@gmail.com>
Date:   Tue Aug 25 16:14:06 2015 +0300

    Merge pull request #842 from Gym/fb-enhancements
    
    Facebook authentication

[33mcommit 2b015b065a82a94a1cd4df44e00e50201a523c16[m
Merge: 979c4e5 ed89f9e
Author: Liran Tal <liran.tal@gmail.com>
Date:   Tue Aug 25 16:13:31 2015 +0300

    Merge pull request #796 from trainerbill/UnauthorizedRoute2
    
    Unauthorized client side routing

[33mcommit 812857027928751c3e0176d999c0e527c0890fdb[m
Author: mleanos <michael.leanos@gmail.com>
Date:   Mon Aug 24 23:23:55 2015 -0700

    [fix] Empty Chat Messages
    
    Disables the submit button on the Chat form, when no message is present.
    Also, removed the `data-` prefix from the various Chat view elements.

[33mcommit 801547602b7de8ddbc3c51345d114b245e3cb561[m
Author: Ryan Hutchison <ryan@gym.com>
Date:   Wed Aug 5 00:40:54 2015 -0400

    client-side form validation with ng-messages.
    
    remove data prefix from attributes.
    
    fix tests

[33mcommit 80b63b5cd24d29dc8404693a51bed688cfae808a[m
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sun Aug 23 23:59:22 2015 +0300

    Refactoring the Session Cookie configuration and adding more configurale parameters

[33mcommit ed89f9ea088b23fbedd9ec856c9177cd29758f38[m
Author: Andrew Throener <athroener@gmail.com>
Date:   Thu Aug 13 12:45:38 2015 -0500

    Unauthorized client routing
    
    Added Auth Interceptor tests
    
    cleaned up test
    
    Update routes

[33mcommit e80f96a78cb89615d6b0937c34ac6375cee4111c[m
Author: Andrew Throener <athroener@gmail.com>
Date:   Mon Aug 24 17:02:49 2015 -0500

    Tests fixes

[33mcommit b3e161fbf3f34d76605114649862b5b90c1cb7ad[m
Merge: 0843a17 979c4e5
Author: Andrew Throener <athroener@gmail.com>
Date:   Mon Aug 24 15:07:54 2015 -0500

    Merge branch 'master' of github.com:meanjs/mean into ArticleControllerRefactor

[33mcommit 0843a1787a9d6192ddb393b3b9b42c9170485602[m
Author: Andrew Throener <athroener@gmail.com>
Date:   Mon Aug 24 12:24:40 2015 -0500

    Test fixes

[33mcommit 979c4e56a431ff02bceb3e7871fdbe0885c16710[m
Merge: b8147cb 4a65439
Author: Liran Tal <liran.tal@gmail.com>
Date:   Mon Aug 24 09:40:16 2015 +0300

    Merge pull request #846 from lirantal/feature/refresh-homepage-links
    
    Refreshing the M.E.A.N links and description in the homepage

[33mcommit 4a65439b19ba5e2654c8c42ac93dc1de50893f44[m
Author: Liran Tal <liran.tal@gmail.com>
Date:   Mon Aug 24 00:17:02 2015 +0300

    Refreshing the M.E.A.N links and description in the homepage

[33mcommit b8147cb278568407900ed1ec35554289035e772d[m
Merge: cfe71bb 9fdd2a0
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sun Aug 23 23:40:44 2015 +0300

    Merge pull request #844 from Gym/404-behavior
    
    mask exception route for 404 responses.

[33mcommit cfe71bb3de02ab10522b56bf671badab5110e9ff[m
Merge: 51196c5 c6d2683
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sun Aug 23 23:40:14 2015 +0300

    Merge pull request #843 from Gym/bug-previous-state
    
    [Bug] Previous State (History)

[33mcommit 51196c54b35b98885aebe0fbd598a69fec8ef46d[m
Merge: b1f814e 3527537
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sun Aug 23 14:13:45 2015 +0300

    Merge pull request #841 from Gym/master
    
    local.example.js still has old fb auth callback

[33mcommit c6d26831fc235bbb221779c9495828cd399afb36[m
Author: Ryan Hutchison <ryan@gym.com>
Date:   Sun Aug 23 03:10:58 2015 -0400

    do not save state to previous (history) for routes marked ignoreState.

[33mcommit 9fdd2a0b9c279b72b57ab1ed95137165dbf70fbd[m
Author: Ryan Hutchison <ryan@gym.com>
Date:   Sun Aug 23 03:59:43 2015 -0400

    mask exception route, but show not-found page.

[33mcommit b2495120c3268ebc20e9cecfa50995d27e47fb0e[m
Author: Ryan Hutchison <ryan@gym.com>
Date:   Sun Aug 23 00:48:17 2015 -0400

    use pushstate, fall back to window.location.hash.
    
    current implementation does double redirect due to '#!'

[33mcommit 27d2818834e45a1fa7c079a15bce59936f8ad3fd[m
Author: Ryan Hutchison <ryan@gym.com>
Date:   Sun Aug 23 00:32:36 2015 -0400

    Closes #202 - if user does not authorize email scope, email will not be mapped.  Username will be generated from first initial of first name and last name.
    
    .jshint latedef set to nofunc.

[33mcommit 3527537258b3632a2d4248b2ceaaffaadb3ef0f8[m
Author: Ryan Hutchison <ryan@gym.com>
Date:   Sat Aug 22 21:06:43 2015 -0400

    local.example.js still has old fb auth callback

[33mcommit b1f814e82a8d18f8a0ac7651c0c0953594650e06[m
Merge: 7b880e9 4b43c4e
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sat Aug 22 19:31:47 2015 +0300

    Merge pull request #836 from Gym/0.4.1
    
    Correct <br /> Tags and set Title

[33mcommit 4b43c4ef32a46af6fae0a73b0eb7e17e54ee62ee[m
Author: Meistercoach83 <Meistercoach83@users.noreply.github.com>
Date:   Sun Aug 16 21:55:49 2015 +0200

    Correct <br /> Tags and set Title

[33mcommit 7b880e986d91d1d361d2460e453b13d274a2f30a[m
Merge: 9450c82 5c287f5
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sat Aug 22 00:40:30 2015 +0300

    Merge pull request #830 from codydaig/bug/password
    
    [fix] Was storing a 6 char password in plain text [fixes #829]

[33mcommit 9450c82a73db62a9222f203011611b847353437a[m
Merge: 37b0bdd 2892fe3
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sat Aug 22 00:40:17 2015 +0300

    Merge pull request #790 from ryanjbaxter/bluemix-button
    
    Added Deploy To Bluemix button to the README

[33mcommit 37b0bdde41827dbb7862d31f5a2cd9775d14d048[m
Merge: bed01ce 601cf9f
Author: Liran Tal <liran.tal@gmail.com>
Date:   Fri Aug 21 22:39:06 2015 +0300

    Merge pull request #835 from simison/patch-12
    
    Link to editorconfig.org from CONTRIBUTING.md

[33mcommit e315872bd3ee5b0e3aad680a0d3e29c8270a8679[m
Merge: 339e9e7 bed01ce
Author: Andrew Throener <athroener@gmail.com>
Date:   Fri Aug 21 08:48:18 2015 -0500

    Merge branch 'master' of github.com:meanjs/mean into ArticleControllerRefactor

[33mcommit 601cf9f3c59b2f01680969d4c178d0d77b2e4787[m
Author: Mikael Korpela <mikael@ihminen.org>
Date:   Fri Aug 21 15:36:22 2015 +0200

    Link to editorconfig from CONTRIBUTING.md

[33mcommit bed01ceb32ab485d0a336868df3fcfbd1e8fcba5[m
Merge: 72067fd ef7ce74
Author: Liran Tal <liran.tal@gmail.com>
Date:   Fri Aug 21 15:02:55 2015 +0300

    Merge pull request #815 from codydaig/docs/Contributing
    
    Created Contributing.md

[33mcommit 7c286b00bbdbf4a3048c3e90adfb4d4f65dd3a44[m
Author: Liran Tal <liran.tal@gmail.com>
Date:   Wed Aug 19 21:49:30 2015 +0300

    adding support for coveralls integration for mean.js to report live project code coverage information

[33mcommit ef7ce7467545d483c99ec6ddfdbb6ec87f8b01f2[m
Author: Cody B. Daig <cody@daig.me>
Date:   Sun Aug 16 15:10:41 2015 -0700

    [docs] Contributing.md

[33mcommit 814b856c976a518c91f51d2e15e32c7414ea2b43[m
Author: Cody B. Daig <cody@daig.me>
Date:   Thu Aug 20 14:40:57 2015 -0700

    [fix] Install ruby and SASS with Docker

[33mcommit 5c287f583b9e8526f086b1797c99bf52a338a797[m
Author: Cody B. Daig <cody@daig.me>
Date:   Thu Aug 20 09:26:07 2015 -0700

    [fix] Was storing a 6 char password in plain text [fixes #829]

[33mcommit 72067fda63bcaf608f0dfda9218bd5b5741b800e[m
Merge: 6474718 195cbe5
Author: Liran Tal <liran.tal@gmail.com>
Date:   Thu Aug 20 09:13:50 2015 +0300

    Merge pull request #827 from mleanos/hotfix/default-env-client-path
    
    [hotfix] Added missing /client/ path

[33mcommit 6474718f3bdb933b49e46c1e30bfd225451f8914[m
Merge: bc31d45 74f58bb
Author: Liran Tal <liran.tal@gmail.com>
Date:   Thu Aug 20 09:10:35 2015 +0300

    Merge pull request #826 from codydaig/test/userEmail
    
    [test] Allow an email with sub domains

[33mcommit 195cbe55a54517db02a0f6320f4bef3c27ed23d2[m
Author: mleanos <michael.leanos@gmail.com>
Date:   Wed Aug 19 19:35:43 2015 -0700

    Added missing /client/ path
    
    Added the missing /client/ path to the favicon & log in the default env
    config.

[33mcommit 74f58bbbd6759a05133556e55e2afef871d4f444[m
Author: Cody B. Daig <cody@daig.me>
Date:   Wed Aug 19 19:08:44 2015 -0700

    [test] Allow an email with sub domains

[33mcommit bc31d4538ca683ffe058ca0530f7a8b406d18eb7[m
Merge: 2e8d659 5754b03
Author: Liran Tal <liran.tal@gmail.com>
Date:   Wed Aug 19 22:17:17 2015 +0300

    Merge pull request #821 from codydaig/fix/editorconfig
    
    Changed .html files to have 2 spaces instead of tabs

[33mcommit 2e8d659e70595fbd5ab2a528631cf79af4a66b1f[m
Merge: a1570c4 d188326
Author: Liran Tal <liran.tal@gmail.com>
Date:   Wed Aug 19 22:15:15 2015 +0300

    Merge pull request #824 from lirantal/bugfix/localjs-env-params-used-for-tests
    
    Fixed issue where if local.js exists then grunt test will run on that…

[33mcommit d18832641a2fddaeba52d8c9a2593f29bcd448e4[m
Author: Liran Tal <liran.tal@gmail.com>
Date:   Wed Aug 19 18:02:40 2015 +0300

    Fixed issue where if local.js exists then grunt test will run on that environment config and possibly delete collections
    
    We only extend the config object with the local.js custom/local environment if we are on production or development environment. If test environment is used we don't merge it with local.js to avoid running test suites on a prod/dev environment (which delete records and make modifications)

[33mcommit a1570c41cf5ab31944af51f42de7cc429aaa7c97[m
Merge: 98f3e8c d737696
Author: Liran Tal <liran.tal@gmail.com>
Date:   Wed Aug 19 21:51:14 2015 +0300

    Merge pull request #825 from seanemmer/master
    
    Corrected 'prod' task in gulpfile

[33mcommit d737696ab0f576edd1334c3166da53096f073834[m
Author: Sean Emmer <sean.emmer@gmail.com>
Date:   Wed Aug 19 11:41:05 2015 -0700

    Corrected 'prod' task in gulpfile

[33mcommit 98f3e8cff5ade782af76ef9c6b13de6aa4ad974f[m
Merge: d6d2b41 384fb7d
Author: Liran Tal <liran.tal@gmail.com>
Date:   Wed Aug 19 13:14:53 2015 +0300

    Merge pull request #816 from lirantal/feature/secure-mode-sslcerts-configurable
    
    Configurable SSL mode options

[33mcommit d6d2b410accab7eccd7dacd4a4c0fdc8631510ce[m
Merge: 793187c 3b5e13e
Author: Liran Tal <liran.tal@gmail.com>
Date:   Wed Aug 19 09:13:26 2015 +0300

    Merge pull request #820 from pgrodrigues/master
    
    fix default session cookie maxAge

[33mcommit 339e9e77ad1ab6816d15f43ad3660aeef3e03ea3[m
Author: Andrew Throener <athroener@gmail.com>
Date:   Tue Aug 18 16:38:39 2015 -0500

    Route updates from code review

[33mcommit b3e39513419397cd57bf412709ee3626dfa74071[m
Author: Andrew Throener <athroener@gmail.com>
Date:   Tue Aug 18 14:30:57 2015 -0500

    Fixed edit authentiction issue

[33mcommit 21fa7dc1ead3777fbfa8bba68067b91af8b46e71[m
Merge: dced51b 793187c
Author: Andrew Throener <athroener@gmail.com>
Date:   Tue Aug 18 14:03:03 2015 -0500

    Changed to resolve in UI router.  Split the controllers.

[33mcommit 5754b03fa0e406a4ec5368a514ff3b9278c7e9d1[m
Author: Cody B. Daig <cody@daig.me>
Date:   Tue Aug 18 09:35:56 2015 -0700

    Changed .html files to have 2 spaces instead of tabs

[33mcommit 3b5e13e356dab9308af9ddc3c76edfdc5e23d2ae[m
Author: Pedro Rodrigues <pgrodrigues@users.noreply.github.com>
Date:   Tue Aug 18 16:26:01 2015 +0100

    fix default session cookie maxAge

[33mcommit 793187cffe50c419ef5f2479ea62996ed20fbe30[m
Merge: 5b78706 ec3af65
Author: Liran Tal <liran.tal@gmail.com>
Date:   Tue Aug 18 08:22:20 2015 +0300

    Merge pull request #810 from cdriscol/menus_service_issue
    
    Fixing Menus service remove bugs.

[33mcommit 5b787069be420a80509e79d568cd22668a00e802[m
Merge: 1f0f1b7 792488e
Author: Liran Tal <liran.tal@gmail.com>
Date:   Mon Aug 17 23:11:35 2015 +0300

    Merge pull request #812 from mleanos/bug/socket-session-key
    
    Fixed bug with Socket IO session

[33mcommit 384fb7d24cd548206ba7c870aac359b0c5f4ec45[m
Author: Liran Tal <liran.tal@gmail.com>
Date:   Mon Aug 17 08:48:27 2015 +0300

    adding support for a configurable ssl-mode and and ssl cert/key files in the environment configuration

[33mcommit 792488e47f3bbf1ef2c8a4a30fe55da770129eab[m
Author: mleanos <michael.leanos@gmail.com>
Date:   Sat Aug 15 22:03:39 2015 -0700

    Fixed bug with Socket IO session
    
    New enhancements to the Express session, added "sessionId" as the new
    default session key. Previously, the express session was using the
    default "connect.sid" key. This caused the Socket configuration to be
    unable to find the session id, thus causing issues with the Socket. One
    suck issue, was that the same Socket would be used for all users
    connected to the server.
    
    This also adds a bit more error handling of the Socket server
    configuration. Using the `return next()` pattern.

[33mcommit 725203200786f018680691ad1f9cd37fec0cb367[m
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sun Aug 16 00:19:52 2015 +0300

    Adding coverage report for server-side tests using istanbul

[33mcommit ec3af65661fc919ac183aa8953eb20c11467ecfe[m
Author: cdriscol <drizkol@gmail.com>
Date:   Sat Aug 15 12:40:00 2015 -0600

    Fixing Menus service remove bugs.

[33mcommit 1f0f1b7d0efb3c48c778d11c63443f64d0b82dc7[m
Merge: 114706e 8fc9b50
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sat Aug 15 10:00:13 2015 +0300

    Merge pull request #806 from pgrodrigues/master
    
    fix some typos

[33mcommit 114706eff47c5c6a402bee796694b6cbfe89c273[m
Merge: a5250c3 1f7bfdd
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sat Aug 15 09:59:31 2015 +0300

    Merge pull request #780 from codydaig/feature/issue583
    
    Make TopBar Public By Default

[33mcommit a5250c36a2ebd0659579bde38804473f74c5c486[m
Merge: 86b16c9 851973f
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sat Aug 15 09:57:30 2015 +0300

    Merge pull request #805 from vaucouleur/master
    
    Fixed end tags in the page header of the user edit page

[33mcommit 1f7bfddf0b3abf88948a682182b7512189eb49e3[m
Author: Cody B. Daig <cody@daig.me>
Date:   Fri Aug 14 15:56:16 2015 -0600

    Make tests pass

[33mcommit 9fc6091ab76a20f0843efca067c8031f1136689a[m
Author: Cody B. Daig <cody@daig.me>
Date:   Fri Aug 14 15:46:23 2015 -0600

    Code from mleanos

[33mcommit e68b4226bde7131fd17c6f345f539df0384462d1[m
Author: Cody B. Daig <cody@daig.me>
Date:   Sat Aug 8 18:13:08 2015 -0700

    Make TopBar Public By Default

[33mcommit 8fc9b50ad0d7cb23629334b3713c1438b408a642[m
Author: Pedro Rodrigues <pgrodrigues@users.noreply.github.com>
Date:   Fri Aug 14 17:27:39 2015 +0100

    fix some typos

[33mcommit 851973f459cc0c804bf4f643eac8455926e981bc[m
Author: Sebastien Vaucouleur <vaucouleur@gmail.com>
Date:   Fri Aug 14 17:26:55 2015 +0200

    Fixed end tags in page header

[33mcommit 86b16c93f61d628022986553382ccaf5eb4dc849[m
Merge: 84926ab d319f92
Author: Liran Tal <liran.tal@gmail.com>
Date:   Fri Aug 14 17:21:49 2015 +0300

    Merge pull request #758 from trainerbill/PathRefactor
    
    Initial commit to return /client to the URL include paths

[33mcommit 84926abd0f96e141f47ca194b8efb1beb52bef29[m
Merge: d9a8647 0aa5e68
Author: Liran Tal <liran.tal@gmail.com>
Date:   Fri Aug 14 16:30:20 2015 +0300

    Merge pull request #804 from lirantal/feature/session-expiration-enhancement-2
    
    Adding support for configurable session expiration time

[33mcommit 0aa5e6864338a1ea84277e3c2bcc9e90d794c664[m
Author: Liran Tal <liran.tal@gmail.com>
Date:   Fri Aug 14 15:24:31 2015 +0300

    Adding support for configurable session expiration time

[33mcommit d9a8647a6bac0fae53e95a99eba0cf33c7edb87a[m
Merge: 7200426 89050d5
Author: Liran Tal <liran.tal@gmail.com>
Date:   Fri Aug 14 13:41:47 2015 +0300

    Merge pull request #799 from lirantal/feature/users_module_tests_4
    
    Adding suite of tests for the e-mail validation field in the users model

[33mcommit 7200426e28c2a326e00787ad868069785624ae6e[m
Merge: d41490c 360c3a4
Author: Liran Tal <liran.tal@gmail.com>
Date:   Fri Aug 14 10:11:00 2015 +0300

    Merge pull request #798 from lirantal/feature/security-enhancements-session
    
    Express sessionKey configuration option

[33mcommit dced51b537a7e814645fc71cc037d9af5ea19835[m
Author: Andrew Throener <athroener@gmail.com>
Date:   Thu Aug 13 15:10:10 2015 -0500

    Article route / controller refactor

[33mcommit d41490c14860a135b3b0729b863d75eb01882f47[m
Merge: 820355c ea97f2e
Author: Liran Tal <liran.tal@gmail.com>
Date:   Thu Aug 13 22:13:23 2015 +0300

    Merge pull request #793 from trainerbill/SeedDB2
    
    Database seeding

[33mcommit 89050d562880cff0e10c77888c0bce53b4cb24bb[m
Author: Liran Tal <liran.tal@gmail.com>
Date:   Thu Aug 13 21:56:19 2015 +0300

    Adding suite of tests for the e-mail validation field in the users model

[33mcommit 360c3a4d3b66d3ee4a63043f4b3a08c04855d38a[m
Author: Liran Tal <liran.tal@gmail.com>
Date:   Thu Aug 13 21:42:44 2015 +0300

    Adding support for sessionKey configuration parameter to allow to easily change the session key that is used to hold the session value. The default is a generic sessionId key to introduce security through obscurity.

[33mcommit d319f9203f9d3dbde0d6bc59c7aa654bafc0861f[m
Author: Andrew Throener <athroener@gmail.com>
Date:   Tue Aug 4 16:57:32 2015 -0500

    Initial commit to return /client to the URL include paths
    
    Conflict Resolve
    
    Fixed Karma testing
    
    Added back cacheIDFromPath as I am not sure what that does.  Just removed the replaceing of /client

[33mcommit ea97f2e7d83281a5bf34cb294ce9f1483135dbf2[m
Author: Andrew Throener <athroener@gmail.com>
Date:   Thu Aug 13 09:37:24 2015 -0500

    Database seeding

[33mcommit 820355c85ea0f880d1aec6d3ac63dc58251d80b8[m
Merge: 609d958 8b29833
Author: Liran Tal <liran.tal@gmail.com>
Date:   Thu Aug 13 16:30:26 2015 +0300

    Merge pull request #791 from pgrodrigues/master
    
    remove double esnext entry in .jshintrc

[33mcommit 8b2983361ccb81d044b6d4ab625acd91adc61405[m
Author: Pedro Rodrigues <pgrodrigues@users.noreply.github.com>
Date:   Thu Aug 13 13:06:30 2015 +0100

    remove double esnext entry in .jshintrc

[33mcommit 609d95824d61c82f9879f0b84070875f8dd8626e[m
Merge: 0be1b11 463f5b9
Author: Liran Tal <liran.tal@gmail.com>
Date:   Thu Aug 13 13:42:19 2015 +0300

    Merge pull request #771 from lirantal/bugfix/fix_user_module_async_tests
    
    Fixing user model test's last test which fail or report a false positive

[33mcommit 0be1b11a201893ac33cd059da47c026498942746[m
Merge: 3064b28 cbebed9
Author: Liran Tal <liran.tal@gmail.com>
Date:   Wed Aug 12 19:21:29 2015 +0300

    Merge pull request #781 from codydaig/bug/listArticlesAuth
    
    Allow Guests to view Articles

[33mcommit 2892fe3d2f4646c95c6eda8bf4dc8cea6ad02c27[m
Author: Ryan J Baxter <rbaxter85@apache.org>
Date:   Tue Aug 11 20:23:06 2015 -0400

    Added Deploy To Bluemix button to the README

[33mcommit 3064b2882048beebf5ff6fc9c3f9599a5650c764[m
Merge: c959180 cb9d7e3
Author: Liran Tal <liran.tal@gmail.com>
Date:   Tue Aug 11 14:35:25 2015 +0300

    Merge pull request #787 from Gym/spaces
    
    fix indentation

[33mcommit cb9d7e3db69b3f4feb066590be444e7911668230[m
Author: Ryan Hutchison <ryan@gym.com>
Date:   Tue Aug 11 01:01:12 2015 -0400

    fix indentation

[33mcommit c9591804810dcb83264ca7f94e57f997b31de84d[m
Merge: 21f1f4e 9149dc4
Author: Liran Tal <liran.tal@gmail.com>
Date:   Mon Aug 10 19:29:59 2015 +0300

    Merge pull request #766 from lirantal/feature/jshint-deprecated-options
    
    Updating JSHINT settings

[33mcommit 9149dc495070fbe45ab69e22b994579372eb9254[m
Author: Liran Tal <liran.tal@gmail.com>
Date:   Thu Aug 6 09:46:03 2015 +0300

    removing deprecated options in the latest versiosn of jshint which will be replaced by adding JSCS settings

[33mcommit 21f1f4e073e651f0f1286a0c80e6706b9e9b743c[m
Merge: 21d87e9 019e420
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sun Aug 9 21:50:34 2015 +0300

    Merge pull request #773 from codydaig/patch-2
    
    Remove Dev Branch Badges

[33mcommit cbebed918860e47bc96ac5367f86d0897a6842ca[m
Author: Cody B. Daig <cody@daig.me>
Date:   Sat Aug 8 18:40:59 2015 -0700

    Allow Guests to view Articles

[33mcommit 019e42000797a85bb2d401520e79841385a6a117[m
Author: Cody B. Daig <codydaig@users.noreply.github.com>
Date:   Fri Aug 7 19:14:04 2015 -0700

    Remove Dev Branch Badges

[33mcommit 463f5b944f37856a7d10c3d8641441ce8a317486[m
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sat Aug 8 00:42:11 2015 +0300

    fixing up a user model test which was not setup correctly without the async done() callback, which led to false postivies. Adding timeouts to the test ensures that the test completes in time, otherwise mocha's 2s timeout will fail the test

[33mcommit 21d87e9378e3598b75918c1f250701a71533a172[m
Merge: 0f3259f 2f60b2b
Author: Liran Tal <liran.tal@gmail.com>
Date:   Fri Aug 7 09:24:48 2015 +0300

    Merge branch 'ryanjbaxter-0.4.0-cf'

[33mcommit 2f60b2bac98c54498bc54f36f10f95afe6c1f465[m
Merge: c2c0c62 efd3ee4
Author: Liran Tal <liran.tal@gmail.com>
Date:   Fri Aug 7 09:24:36 2015 +0300

    Merge branch '0.4.0-cf' of https://github.com/ryanjbaxter/mean into ryanjbaxter-0.4.0-cf

[33mcommit 0f3259fa431c9c16ea604697ea256873f3e141a9[m
Merge: fe20d3c c967a98
Author: Liran Tal <liran.tal@gmail.com>
Date:   Fri Aug 7 00:23:00 2015 +0300

    Merge pull request #768 from lirantal/feature/users_module_tests_2
    
    Updating User model tests for synchronous test and fixing done() calls

[33mcommit fe20d3c677b5adaa4ee19b0ae9fc6b0ce606361a[m
Merge: 1e51e06 4949bdd
Author: Liran Tal <liran.tal@gmail.com>
Date:   Thu Aug 6 18:44:51 2015 +0300

    Merge pull request #765 from jloveland/more-security
    
    Adding more secure settings

[33mcommit c967a98562ce8b6a897f6c1a3acfc9e524561b37[m
Author: Liran Tal <liran.tal@gmail.com>
Date:   Thu Aug 6 09:56:38 2015 +0300

    refactoring the async nature in the user model tests to account for mocha 2 second timeouts causing travis-ci build fails

[33mcommit 1e51e06d5693ba074579776658fcf54ac3773c2b[m
Merge: 232883b dd254e1
Author: Liran Tal <liran.tal@gmail.com>
Date:   Thu Aug 6 15:45:22 2015 +0300

    Merge pull request #762 from lirantal/feature/grunt_fail_on_failures
    
    Grunt - fail the build if a task fails

[33mcommit dd254e16494fc61d2c884910181890ec477afe0b[m
Author: Liran Tal <liran.tal@gmail.com>
Date:   Wed Aug 5 19:00:52 2015 +0300

    updating travis ci build to install required ruby gem dependencies

[33mcommit 232883b2c39dd84e8b11cefe516ca36ec9b9a6b1[m
Merge: 057a0cc 01a8d5e
Author: Liran Tal <liran.tal@gmail.com>
Date:   Thu Aug 6 09:49:28 2015 +0300

    Merge pull request #755 from Gym/bug-reset-password
    
    Bug: reset-password enhancements and bug fix

[33mcommit 4949bdd9c3a820dd78b03fbae89e3a1b7d936a63[m
Author: jloveland <jason.c.loveland@gmail.com>
Date:   Wed Aug 5 22:48:59 2015 -0400

    adding ordered cipher list, stronger settings in generate-ssl-certs script, and hsts settings

[33mcommit 057a0cc2f8df09c394423fcf71a0baacc3824fbd[m
Merge: d0613ce 346ebd6
Author: Liran Tal <liran.tal@gmail.com>
Date:   Wed Aug 5 19:17:06 2015 +0300

    Merge pull request #756 from lirantal/feature/users_module_tests
    
    Refactoring Tests for User model

[33mcommit c22c888de9522bc67cf176c08a8f023566183f33[m
Author: Liran Tal <liran.tal@gmail.com>
Date:   Wed Aug 5 14:23:40 2015 +0300

    updating grunt 'force' option to default/force it to false so that we can fail any task that is failing and thus fail the build in case of any issues in tests, jshint conventions, and so on

[33mcommit 346ebd6a67ca4ae588c8228b27a4baf32c1fadbe[m
Author: Liran Tal <liran.tal@gmail.com>
Date:   Tue Aug 4 16:57:20 2015 +0300

    re-factoring the server model tests to create user model from schema only during tests, so that we can re-use mongodb's _v versioning fields, and also cleaning up user tests on each test iteration

[33mcommit 01a8d5e67bb002cb0c51471b9c2e418c6f4c117d[m
Author: Ryan Hutchison <ryan@gym.com>
Date:   Tue Aug 4 00:14:42 2015 -0400

    reset-password enhancements and bug fix

[33mcommit d0613cea7938bcbb6b8d8e6c3c48e1573b0d5da0[m
Merge: 3bc1de2 c2c0c62
Author: Liran Tal <liran.tal@gmail.com>
Date:   Mon Aug 3 18:30:03 2015 +0300

    Merge branch '0.4.0'
    Releasing MEAN.JS 0.4.0 version on-top of previously MEAN.JS 0.3.3 on master branch

[33mcommit c2c0c621b34748b18fda1360520b5cf20caa3213[m
Merge: 5bdd8f9 f8750b3
Author: Liran Tal <liran.tal@gmail.com>
Date:   Mon Aug 3 17:44:21 2015 +0300

    Merge pull request #737 from lirantal/feature/0.4.0_prepare_release
    
    Updating README with reference to new development branch

[33mcommit 5bdd8f95f06d3ab1fa08a37f964abd8eca26202f[m
Merge: a66c3fe 379f58e
Author: Liran Tal <liran.tal@gmail.com>
Date:   Mon Aug 3 17:44:09 2015 +0300

    Merge pull request #750 from lirantal/bugfix/gitignore_jekyll_assets
    
    Gitignore for Jekyll assets

[33mcommit 379f58e3b0982d54214e470edebadfad339b66e6[m
Author: Liran Tal <liran.tal@gmail.com>
Date:   Mon Aug 3 17:14:01 2015 +0300

    updating gitignore file to disregard the _site/ directory which gets created when using jekyll for generating the gh-pages documentation branch locally

[33mcommit a66c3fe5a7bf47acfa7a3748a5ca8fe143b58221[m
Merge: 9c0068c 2747df6
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sat Aug 1 09:43:42 2015 +0300

    Merge pull request #744 from Gym/0.4.0
    
    BUG: Removed a ng-binding to article.content in user-list.client.view…

[33mcommit 2747df631052474e59c8bb3bf1752f5403c90fad[m
Author: Ryan Hutchison <ryan@gym.com>
Date:   Fri Jul 31 23:45:56 2015 -0400

    BUG: Removed a ng-binding to article.content in user-list.client.view.html

[33mcommit 9c0068cf073f61dd9cd93b10f27046eb518e03a3[m
Merge: 7aaf363 ef3a3f9
Author: Liran Tal <liran.tal@gmail.com>
Date:   Fri Jul 31 19:45:41 2015 +0300

    Merge pull request #706 from Gym/formatting-reboot
    
    formatting reboot (space-2 and consistency)

[33mcommit ef3a3f954852c7717844fe0c18647ad4290b2945[m
Author: Ryan Hutchison <ryan@gym.com>
Date:   Sat Jul 25 16:53:11 2015 -0400

    formatting reboot (space-2 and consistency)
    
    JSCS fixes
    
    update editorconfig

[33mcommit f8750b33937cae3d6dd64271063dc5af49559e5e[m
Author: Liran Tal <liran.tal@gmail.com>
Date:   Thu Jul 30 23:20:31 2015 +0300

    updating the new 0.4.1 dev branch for when 0.4.0 will actually be released

[33mcommit 7aaf363fc77fb44f79f5536f6f8ef81c0edb244e[m
Merge: b8b8d01 edb6234
Author: Liran Tal <liran.tal@gmail.com>
Date:   Thu Jul 30 23:13:08 2015 +0300

    Merge pull request #736 from lirantal/feature/refactor-app-service
    
    Refactoring server application service

[33mcommit edb62344bc4af3cb28c3469dc7463c13a2fc76a1[m
Author: Liran Tal <liran.tal@gmail.com>
Date:   Thu Jul 30 11:38:21 2015 +0300

    Refactoring server application service to enable modularity and callbacks, as well as provide app, db, config variables outside of server.js

[33mcommit b8b8d010087ec4ea9f51aa84af47c9f3caf777f1[m
Merge: 8104c98 c539cdb
Author: Ilan Biala <ilan.biala@gmail.com>
Date:   Thu Jul 30 15:23:19 2015 -0400

    Merge pull request #734 from codydaig/docs/040release
    
    Update generator references from readme and index

[33mcommit efd3ee4ce842861bc1044f0c8b5883bb715d531f[m
Author: Ryan J Baxter <rbaxter85@apache.org>
Date:   Wed Jul 29 11:02:37 2015 -0400

    Initial support for deploying MEANJS to Cloud Foundry

[33mcommit c539cdb2814bfac589679143274edf9eec9d27f1[m
Author: Cody B. Daig <cody@daig.me>
Date:   Wed Jul 29 12:18:49 2015 -0700

    Modify Generator Refrences/Docs

[33mcommit 8104c98817f4257cf6fd11ba1c6d5746ab2873a6[m
Merge: b7aebf3 40878bb
Author: Ilan Biala <ilan.biala@gmail.com>
Date:   Wed Jul 29 12:29:29 2015 -0400

    Merge pull request #733 from codydaig/enhancement/pull662
    
    Get site title from default environment config

[33mcommit 40878bb07634847ff0236ca6a5e38238ba8d2aa4[m
Author: Cody B. Daig <cody@daig.me>
Date:   Wed Jul 29 08:43:56 2015 -0700

    Get site title from default

[33mcommit b7aebf35e1839c4eed63050fe6fe421091c47a6e[m
Merge: 612a76c eba4754
Author: Ilan Biala <ilan.biala@gmail.com>
Date:   Wed Jul 29 11:34:02 2015 -0400

    Merge pull request #731 from simison/mkdir-uploads
    
    Add Grunt task to make sure uploads directory exists

[33mcommit eba4754ba176154f1f1eb8dc016b1500270bfd69[m
Author: Mikael Korpela <mikael@ihminen.org>
Date:   Wed Jul 29 16:40:36 2015 +0200

    Add Grunt task to make sure uploads directory exists

[33mcommit 612a76cda6c727416a85dd3d7a4be3747d262bc6[m
Merge: 99a8168 d5ea5c9
Author: Ilan Biala <ilan.biala@gmail.com>
Date:   Wed Jul 29 10:31:29 2015 -0400

    Merge pull request #728 from cdriscol/angular_tests
    
    Add client side tests
    Fixes #663

[33mcommit 99a8168ff5a32fb4c3feec93a66f43f7e8ec1538[m
Merge: 09870db e6a35a7
Author: Liran Tal <liran.tal@gmail.com>
Date:   Wed Jul 29 17:02:16 2015 +0300

    Merge pull request #487 from igorauad/0.4.0
    
    Enable redirection to previous page after login

[33mcommit 3bc1de2543eb455f4ab77fbbd17fe0304e7f0959[m
Merge: 88a89f2 7c015e2
Author: Liran Tal <liran.tal@gmail.com>
Date:   Wed Jul 29 16:57:51 2015 +0300

    Merge pull request #568 from floydpink/feature-fix-535
    
    Fix the Google OAuth Redirect Bug - #535

[33mcommit e6a35a7f9acbf7a48e2d946796e128dd060fb953[m
Author: Igor Freire <igor.auad@gmail.com>
Date:   Sun Mar 22 11:47:14 2015 -0300

    Enable redirection to previous page after login
    
    Two different strategies are adopted, one for when the user authenticates locally and the other through providers. When authenticating locally, the signin function in the client controller redirects to the previous state (storing and using a state name) after successful login. When authenticating through a provider, the first call to provider stores the previous URL (not state, URL) in the session. Then, when provider actually calls the authentication callback, session redirect_to path is used for redirecting user.

[33mcommit 09870db9ce4a1f0590370e18cbbb2e89061b7f2d[m
Merge: 88b8f9e 71167b0
Author: Liran Tal <liran.tal@gmail.com>
Date:   Wed Jul 29 16:53:54 2015 +0300

    Merge pull request #720 from vaucouleur/getErrorMessage
    
    Article middleware was calling getErrorMessage with a null argument

[33mcommit d5ea5c99d297bcd5c0fc7420cbd9294f839be703[m
Author: cdriscol <drizkol@gmail.com>
Date:   Tue Jul 28 17:52:03 2015 -0600

    Adding client test coverage.

[33mcommit 88b8f9e74aaad253a2212985039b3b9dd21484b5[m
Merge: 6b3220c 4bbc4a3
Author: Liran Tal <liran.tal@gmail.com>
Date:   Wed Jul 29 09:25:24 2015 +0300

    Merge pull request #713 from Gym/0.4.0
    
    BUG: fix non-admin user edit route.  Broke with admin feature

[33mcommit 6b3220ccd392d9e82240a369dfc68d9a2b454ac0[m
Merge: 460ef53 a5bceb9
Author: Ilan Biala <ilan.biala@gmail.com>
Date:   Tue Jul 28 22:02:40 2015 -0400

    Merge pull request #729 from mleanos/angular-file-upload-static-dep
    
    Update angular-file-upload to use static dependency
    Fixes #722, Fixes #724

[33mcommit a5bceb9c3061aae0acd153cd350bf77ba8d4b8da[m
Author: mleanos <michael.leanos@gmail.com>
Date:   Tue Jul 28 18:53:31 2015 -0700

    Updated angular-file-upload to use static dependency
    
    Setting angular-file-upload version in Bower.json to be static at 1.1.5

[33mcommit 4bbc4a30f67ca6ef0f456429c89a51d754cf6438[m
Author: Ryan Hutchison <ryan@gym.com>
Date:   Sun Jul 26 02:10:54 2015 -0400

    add user route tests

[33mcommit 839f8051727cd08b53f10f542238af741547124a[m
Author: Ryan Hutchison <ryan@gym.com>
Date:   Sun Jul 26 01:40:16 2015 -0400

    BUG: fix admin access (blocking user PUT)

[33mcommit 460ef53aed174cc2277d584150f9c4f815812ee6[m
Merge: 4f7aed0 c468539
Author: Ilan Biala <ilan.biala@gmail.com>
Date:   Tue Jul 28 13:46:55 2015 -0400

    Merge pull request #714 from cdriscol/fix_karma_errors_html2js
    
    Fix AngularJS templates not being loaded in tests

[33mcommit 71167b0e75a6ed68eb6b9e6c5d88b823c36fe154[m
Author: Sebastien Vaucouleur <vaucouleur@gmail.com>
Date:   Fri Jul 24 13:57:29 2015 +0200

    The article middleware was calling getErrorMessage with a null argument, causing a crash when this method tried to access 'code' on an null parameter.
    
    The bug was not exposed by the original test, since it was mixing two (related) aspects:
    
    * An invalid Id (a badly formed mongodb identifier)
    * An non-existent Id (an identifier with no corresponding document in the database)
    
    Modifications:
    
    - Fixed the message property in the article controller (the error message follows the wording of the error message in "users.password.server.controller.js", in case of username not found)
    - Added a new test to check modifications and avoid regressions

[33mcommit 4f7aed0107b85795d5ab6a2c3c7e984605c13478[m
Merge: 0faeb31 0bcadcc
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sun Jul 26 19:47:43 2015 +0300

    Merge pull request #707 from lirantal/feature/mongoose_debug_option
    
    Enabling mongoose debug mode

[33mcommit c4685392cfd841a9873ce7b28810d1c5f81eaaba[m
Author: cdriscol <drizkol@gmail.com>
Date:   Sun Jul 26 10:21:49 2015 -0600

    Adding karma-ng-html2js-preprocessor to fix karma tests.  Adding user mock to articles tests.

[33mcommit 0faeb31496d0702398632494471a0dd270db70d5[m
Merge: e1ca1aa 0fa9b95
Author: Ilan Biala <ilan.biala@gmail.com>
Date:   Sat Jul 25 22:44:31 2015 -0400

    Merge pull request #710 from mleanos/Chat-Missing-Auth-DI
    
    Add missing dependency injection in Chat

[33mcommit 0fa9b9579ad2ed80506dce1777509f0d299c5c94[m
Author: mleanos <michael.leanos@gmail.com>
Date:   Sat Jul 25 16:05:48 2015 -0700

    Added missing dependency injection in Chat
    
    During my last PR merge, the dependency injection for Authentication and
    $location weren't merged properly. I added them back to the Chat client
    controller.

[33mcommit e1ca1aa334ee945967c3c51fb2c560827033379f[m
Merge: d7f9622 6066020
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sat Jul 25 21:29:33 2015 +0300

    Merge pull request #676 from Gym/admin-feature
    
    Admin module

[33mcommit 0bcadcc08e208e2a9faca8a5ddfec377dbe27650[m
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sat Jul 25 12:00:29 2015 +0300

    Enhancing support for development envionrment to enable mongoose debug mode so that we can debug db queries
    Includes support for environment variable MONGODB_DEBUG

[33mcommit d7f96227ebc24a3e06ec221872b76e7b6f1bc96c[m
Merge: 0c76179 a62c4dd
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sat Jul 25 11:35:47 2015 +0300

    Merge pull request #685 from codydaig/pull664
    
    Move livereload, image, and favicon to config

[33mcommit 0c76179fa024cd1e31559c6ae0fba3602049cc22[m
Merge: 7c5b311 65c6d1f
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sat Jul 25 11:33:55 2015 +0300

    Merge pull request #701 from mleanos/socket-connect
    
    Socket IO client enhancement with connect() method

[33mcommit 7c5b3112162032795294e9dfabb5fbd78b8047a7[m
Merge: 7d7d076 2802729
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sat Jul 25 11:15:19 2015 +0300

    Merge pull request #698 from simison/patch-11
    
    Putting the head in order

[33mcommit 7d7d07671e2dfa3628aa6d03b56b39d0513c14ef[m
Merge: c8880ea 411765b
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sat Jul 25 11:13:08 2015 +0300

    Merge pull request #703 from lirantal/bugfix/config_chalk_console_log_order
    
    fixing chalk and console usage for consistency reasons

[33mcommit 65c6d1ffe06b8d44a6fa60ad7d3bd375d4e666cb[m
Author: mleanos <michael.leanos@gmail.com>
Date:   Sat Jul 25 00:36:01 2015 -0700

    Socket IO client enhancement with connect() method
    
    Updated the Socket client service, with a connect() method. Moved state
    redirect out of from Socket service.  Added the Authentication.user
    check to the Chat client controller, and added a check to make sure the
    Socket client service is connected to the server; if not, then connect
    using the new connect() method.
    
    Had to do a hard reset from 0.4.0 due to conflicts when merging and
    pushing to remote.

[33mcommit 60660204acce6e9e501c33161236d6831381fee6[m
Author: Ryan Hutchison <ryan@gym.com>
Date:   Tue Jul 21 00:35:58 2015 -0400

    Admin module base & user admin implementation.
    
    update displayName
    
    implements #700 (client-side role security) on angular routes.

[33mcommit 28027290b5c19f30421f1c8ea5fe85f87ec8ee2a[m
Author: Mikael Korpela <mikael@ihminen.org>
Date:   Fri Jul 24 21:38:40 2015 +0300

    Putting the head in order
    
    - Moving a few meta tags+base tag before title. I've noticed Bootstrap [recommends this](http://getbootstrap.com/getting-started/#template) (wasn't sure why) so I did some quick googling and [IE seems to be the reason](http://blogs.msdn.com/b/ieinternals/archive/2011/07/18/optimal-html-head-ordering-to-avoid-parser-restarts-redownloads-and-improve-performance.aspx) but there some other speculations too. Feel free to search more.
    
    - ...in any case, [charset tag should come before the title](http://www.w3.org/wiki/The_HTML_head_element#Stop_right_there.21_Inline_CSS_and_JavaScript_is_not_too_clever.21).
    
    - Removing keyword tag since it [isn't really used anymore](https://chrisedwards.me/seo/keyword-meta-tag-google/).
    
    - Removing duplicate Content-type/Encoding tag
    
    - Remove IE shim

[33mcommit 0a7a715817305eef4da0ded23c0ded5ad8f1dafd[m
Author: mleanos <michael.leanos@gmail.com>
Date:   Thu Jul 23 22:51:36 2015 -0700

    Moved all editor setting to bottom
    
    I moved all the editor files underneath all the other settings. As the
    editor list grows, it will help keep things organized, and editor
    configs are less pertinent to individual developers.

[33mcommit 6c2c77cb75ad6dcfe46e1efbcd983309b79b3f05[m
Author: mleanos <michael.leanos@gmail.com>
Date:   Wed Jul 22 16:21:16 2015 -0700

    Added Visual Studio files to gitignore
    
    Adding files to ignore that are related to Visual Studio, and Node.js
    development within the VS environment.

[33mcommit 411765bb26ff240e51f7c797a33c5b48862279fb[m
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sat Jul 25 01:57:17 2015 +0300

    fixing chalk and console usage for consistency reasons

[33mcommit c8880ea65d377f3c6b3feaa8659b1dbec4333a52[m
Merge: 0e3f194 1b54d35
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sat Jul 25 01:18:33 2015 +0300

    Merge pull request #700 from trainerbill/requireLogin
    
    Require login

[33mcommit 1b54d353056957395a4f07f67f6d956aa5a05253[m
Author: Andrew Throener <athroener@gmail.com>
Date:   Fri Jul 24 17:06:55 2015 -0500

    Final Clean Up after code review

[33mcommit 0e3f194d13d865e96acd92b845a498387ca4419b[m
Merge: c671f65 2ff2490
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sat Jul 25 01:06:28 2015 +0300

    Merge pull request #699 from lirantal/bugfix/unused-variable
    
    Removing unused passport variable in express.js library file

[33mcommit c671f65c47c7e0e0f791dd8f6ffe1654d7de5ac3[m
Merge: e3405d2 de3b890
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sat Jul 25 01:06:03 2015 +0300

    Merge pull request #693 from lirantal/feature/clean_angular_hashbang_urls
    
    Feature/clean angular hashbang urls

[33mcommit 03a4042a33600de428a468e4e4477109f9eae611[m
Author: Andrew Throener <athroener@gmail.com>
Date:   Fri Jul 24 16:43:46 2015 -0500

    Updated routes and a logic fix

[33mcommit de3b890f9d28172f347511ea5f37916559954bdf[m
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sat Jul 25 00:39:12 2015 +0300

    removed /#! in user controllers
    
    Resolved 0.4.0 related conflicts:
    	modules/users/server/controllers/users/users.authentication.server.controller.js

[33mcommit 2ff24903c675e43ea6a89c3304a204f2a64b8133[m
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sat Jul 25 00:26:05 2015 +0300

    removing unused passport variable in express.js library file

[33mcommit fb71619e0cc6166fe35c6d1e0f34637a279b20c5[m
Author: Andrew Throener <athroener@gmail.com>
Date:   Fri Jul 24 15:37:26 2015 -0500

    Refactor

[33mcommit e21805f20a15a40abd5f0f5908aef4ed9c0fb176[m
Author: Igor Freire <igor.auad@gmail.com>
Date:   Fri Jul 24 16:58:41 2015 -0300

    Prepare for role-based access control of states

[33mcommit 9fc88e6e5b5bd05c1e532246356725a3fa16a223[m
Author: Igor Freire <igor.auad@gmail.com>
Date:   Fri Jul 17 14:39:32 2015 -0300

    Filter states for which login is required during state change
    
    A state parameter was added for the routes that require user authentication. Now, everytime a statechange occurs, the destination state is checked and user is redirected to signin page if necessary. Note the state parameter is added within `data`, so that nested states can inherent its value.

[33mcommit e3405d2f2b06dbbd282b285fbf221aeb2ba03f71[m
Merge: 8a81cf0 c7ec27e
Author: Ilan Biala <ilan.biala@gmail.com>
Date:   Fri Jul 24 10:14:10 2015 -0400

    Merge pull request #683 from mleanos/gitignore_VS
    
    Added Visual Studio files to gitignore
    Rearranged gitignore to prioritize general files over editor files

[33mcommit 8a81cf0168af5e2240391e24861a4e1385ae0dc4[m
Merge: 3a39f0a 7605956
Author: Ilan Biala <ilan.biala@gmail.com>
Date:   Fri Jul 24 10:13:26 2015 -0400

    Merge pull request #688 from codydaig/bugfix/github_undefined_displayname
    
    If displayName in GitHub is undefined use username
    Fixes #519

[33mcommit 3a39f0a88b64709c48e4880b49c72ea239f85c0b[m
Merge: 0369db4 3e378b4
Author: Ilan Biala <ilan.biala@gmail.com>
Date:   Fri Jul 24 10:12:11 2015 -0400

    Merge pull request #666 from Gym/task-enhancements
    
    Grunt and Gulp task enhancements

[33mcommit 0369db4cc2ec8a772e10a0cf76dec3af35d938e1[m
Merge: a62f25e 315187e
Author: Liran Tal <liran.tal@gmail.com>
Date:   Fri Jul 24 11:11:19 2015 +0300

    Merge pull request #691 from lirantal/feature/missing_ssl_better_log
    
    Enhancing SSL error message

[33mcommit 315187e021a0ae4198fc4d2559dc1d0754f0c7c9[m
Author: Liran Tal <liran.tal@gmail.com>
Date:   Fri Jul 24 10:03:14 2015 +0300

    enhancing error message with an actual instruction on how to fix the missing ssl problem when running in prod mode and secured enabled

[33mcommit a62f25e66d0ef92b7ab53f198c0bb9a223577016[m
Merge: 29d264d ac35f0f
Author: Liran Tal <liran.tal@gmail.com>
Date:   Fri Jul 24 09:47:35 2015 +0300

    Merge pull request #684 from lirantal/feature/users_tests_email_unique
    
    Enhancing users model tests

[33mcommit ac35f0fec81db8c5d9f71c3b430140dd55007b68[m
Author: Liran Tal <liran.tal@gmail.com>
Date:   Thu Jul 23 14:06:08 2015 +0300

    adding couple more tests to confirm users model works as expected

[33mcommit c7ec27ee035d9746774b58223c348fc01af9ea4c[m
Author: mleanos <michael.leanos@gmail.com>
Date:   Thu Jul 23 22:51:36 2015 -0700

    Moved all editor setting to bottom
    
    I moved all the editor files underneath all the other settings. As the
    editor list grows, it will help keep things organized, and editor
    configs are less pertinent to individual developers.

[33mcommit a62c4dd16d5efa5a62d15c71922f92e585a370f0[m
Author: Cody B. Daig <cody@daig.me>
Date:   Thu Jul 23 11:13:55 2015 -0700

    Move livereload, image, and favicon to config

[33mcommit 7605956c99108d31111a7f23f6b646ad4efa0075[m
Author: Cody B. Daig <cody@daig.me>
Date:   Thu Jul 23 13:02:35 2015 -0700

    displayName undefined

[33mcommit c3380bf74f5d0cc8e59ce5e7f125e223abf768f1[m
Author: mleanos <michael.leanos@gmail.com>
Date:   Wed Jul 22 16:21:16 2015 -0700

    Added Visual Studio files to gitignore
    
    Adding files to ignore that are related to Visual Studio, and Node.js
    development within the VS environment.

[33mcommit 29d264dff7fe4f5dce22b6ba2b0c2729ca694163[m
Merge: 00a4c06 a7e065e
Author: Ilan Biala <ilan.biala@gmail.com>
Date:   Wed Jul 22 17:00:30 2015 -0400

    Merge pull request #682 from codydaig/patch-2
    
    Switch TravisCI and DavidDM to 0.4.0 branch

[33mcommit a7e065e6260dbbd4218c98b5e93b9b201268b36f[m
Author: Cody B. Daig <codydaig@users.noreply.github.com>
Date:   Wed Jul 22 08:58:02 2015 -0700

    Added Master and Dev Badges to README

[33mcommit 3e378b4a54f7393b0fbe9f522fdd4a329c41b5f4[m
Author: Ryan Hutchison <ryan@gym.com>
Date:   Sun Jul 19 22:02:33 2015 -0400

    BUG: Path separator support for windows.

[33mcommit 0f7cf546fd645c6f033fa60f71c26751622b10fe[m
Author: Ryan Hutchison <ryan@gym.com>
Date:   Sun Jul 19 21:47:35 2015 -0400

    move task configs to separate properties.
    
    remove watch on gulpfile.js

[33mcommit 00a4c0603aa6a2c785361a37cff6e5ae153b5688[m
Merge: 82d2377 7070796
Author: Liran Tal <liran.tal@gmail.com>
Date:   Mon Jul 20 22:25:33 2015 +0300

    Merge pull request #566 from simison/error-404-pages
    
    #501 Handle 404 errors at Express backend and at Angular frontend

[33mcommit 82d23777541d701457095fa0d17f465898abd11f[m
Merge: e6b8a69 0efc82d
Author: Liran Tal <liran.tal@gmail.com>
Date:   Mon Jul 20 22:12:51 2015 +0300

    Merge pull request #439 from igorauad/uniqueEmail
    
    Make emails unique

[33mcommit e6b8a692add322fdf0c5f16a5c5a28ea34ebd265[m
Merge: bed8ff5 a8dae99
Author: Liran Tal <liran.tal@gmail.com>
Date:   Mon Jul 20 21:25:13 2015 +0300

    Merge pull request #673 from codydaig/bugfix/consolelog
    
    Remove console.log from an article test

[33mcommit bed8ff5533639e6c25f84f5046b63e26b8c4cda2[m
Merge: 53194ff c90dda9
Author: Liran Tal <liran.tal@gmail.com>
Date:   Mon Jul 20 21:22:19 2015 +0300

    Merge pull request #671 from lirantal/feature/lint-on-grunt-test
    
    Enable jshint on grunt test tasks

[33mcommit 0efc82db0f749aa1f5120dfeaefe1b25365517d2[m
Author: Igor Freire <igor.auad@gmail.com>
Date:   Mon Jul 20 14:38:44 2015 -0300

    Fix message catching the field for which a duplicate key error ocurred

[33mcommit a8dae99173e806235ed19b9f4794c61e3c68b2ef[m
Author: Cody B. Daig <cody@daig.me>
Date:   Mon Jul 20 10:04:45 2015 -0700

    Remove console.log from an article test

[33mcommit c90dda93fd6baf58494f8b3a92c110a762f8b795[m
Author: Liran Tal <liran.tal@gmail.com>
Date:   Mon Jul 20 15:57:36 2015 +0300

    enabling the lint task when running tests so we can identify coding convention issues on Pull-Requests in the CI

[33mcommit 53194ffc47f2cd9acf4498d6eb1c7abd322541c3[m
Merge: 09251d1 4d1ae6e
Author: Liran Tal <liran.tal@gmail.com>
Date:   Mon Jul 20 08:18:06 2015 +0300

    Merge pull request #665 from codydaig/mergeissue
    
    change _.extend to _.merge

[33mcommit 09251d12319c58c4e446e5a2a8f22b5c1efdb7dd[m
Merge: 2f8e20e 9e7239b
Author: Liran Tal <liran.tal@gmail.com>
Date:   Mon Jul 20 08:05:53 2015 +0300

    Merge pull request #668 from cdriscol/base_tag
    
    appending a base tag to the head before jasmine tests run.

[33mcommit 9e7239baf7a90a2fcdffc2ee52d8ff45cab83128[m
Author: cdriscol <drizkol@gmail.com>
Date:   Sun Jul 19 22:24:39 2015 -0600

    appending a base tag to the head before jasmine tests run.

[33mcommit 4d1ae6e14c667515462ef19ddcd63520953f3416[m
Author: Cody B. Daig <cody@daig.me>
Date:   Sun Jul 19 15:35:47 2015 -0700

    change _.extend to _.merge

[33mcommit 2f8e20ec1ef9b23997dc4a60640c372e65f33b3c[m
Merge: e1605b6 03b7f6f
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sun Jul 19 23:22:43 2015 +0300

    Merge pull request #659 from lirantal/bugfix/secure-mode-fix
    
    Fixing up SSL support

[33mcommit 5d4d7cecfe013d3f51eb7194f337a5a8bb1dc71d[m
Author: Igor Freire <igor.auad@gmail.com>
Date:   Sat Feb 28 19:09:12 2015 -0300

    Make emails unique
    
    Emails are made unique. When user attempts to sign in through a provider in which his email is one that is already registered, user is redirected to the signin page with an error passed as a query string parameter.

[33mcommit 03b7f6ffda18ffbd2eb9073be16fb13b5fe2fdd5[m
Author: Liran Tal <liran.tal@gmail.com>
Date:   Fri Jul 17 11:16:25 2015 +0300

    fixing up SSL support on startup to fallback to non-SSL mode if files are not present

[33mcommit e1605b635b74b14bd657b4b50a47ce219d816a31[m
Merge: a1355a0 5d5d1b7
Author: Liran Tal <liran.tal@gmail.com>
Date:   Fri Jul 17 11:19:30 2015 +0300

    Merge pull request #658 from codydaig/npm3-patch2
    
    Update package.json to include peer dependencies

[33mcommit 5d5d1b7bda126080506a474be83dd7843dbe66d5[m
Author: Cody Daig <cody@daig.me>
Date:   Fri Jul 17 01:09:08 2015 -0700

    Update package.json to include peer dependencies

[33mcommit a1355a04be871493c349e5f0e7cf49273b7cf776[m
Merge: 32c12bb a23290b
Author: Liran Tal <liran.tal@gmail.com>
Date:   Fri Jul 17 10:44:20 2015 +0300

    Merge pull request #656 from fauria/0.4.0
    
    Use validator.js for email and password length validation.

[33mcommit a23290b46ee3d3c28d54d04f4e36202083542b69[m
Author: git-admin <fauria@gmail.com>
Date:   Fri Jul 17 09:27:16 2015 +0200

    Use validator.js for email validation

[33mcommit 32c12bbc0ed5456a691bb1a786d2809e882988b9[m
Merge: 855a399 bf777d9
Author: Liran Tal <liran.tal@gmail.com>
Date:   Wed Jul 15 21:04:15 2015 +0300

    Merge pull request #651 from grantgeorge/no-password-ssl-certs
    
    do not use aes when creating ssl certs to prevent password requirement

[33mcommit bf777d9404258395f0e013daff8472e0ab5105fd[m
Author: Grant George <grantelliottgeorge@gmail.com>
Date:   Wed Jul 15 11:05:26 2015 -0400

    do not use aes when creating ssl certs to prevent password requirement

[33mcommit 855a39984d957756252cc40fbf28417523f599de[m
Merge: a146a30 fe1d584
Author: Liran Tal <liran.tal@gmail.com>
Date:   Wed Jul 15 08:58:49 2015 +0300

    Merge pull request #610 from trainerbill/PayPalAuth4
    
    PayPal Authentication

[33mcommit fe1d584564e8788e78471152b782b556e2c41b5f[m
Author: Andrew Throener <athroener@gmail.com>
Date:   Tue Jul 14 22:05:12 2015 -0500

    Indentation fixes

[33mcommit a98a84fd200dff468a1126597a19a4f3d6c483c5[m
Merge: 8694b7e a146a30
Author: trainerbill <athroener@mystartupsolutions.com>
Date:   Tue Jul 14 15:46:23 2015 -0500

    Fix merge conflicts

[33mcommit a146a3047f6de4ea014193d6668d1be9eee77707[m
Merge: 6d199a5 8c2156f
Author: Liran Tal <liran.tal@gmail.com>
Date:   Mon Jul 13 23:38:32 2015 +0300

    Merge pull request #647 from lirantal/bugfix/cleanup-readme
    
    cleaning up code blocks in README

[33mcommit 8c2156f236aeaf9033d9ff60a64e0887c51cd467[m
Author: Liran Tal <liran.tal@gmail.com>
Date:   Mon Jul 13 23:04:53 2015 +0300

    cleaning up code blocks in README

[33mcommit 6d199a59252a5908d08bd141db53c88b48a4b4a9[m
Merge: d9c15e2 c572ed7
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sun Jul 12 23:55:29 2015 +0300

    Merge pull request #645 from djorak/patch-1
    
    JSHint test failing because of missing semicolon

[33mcommit c572ed7eec0cf2e0435aa6922276e3b0b65d2b21[m
Author: Julien Mazé <mazejul@gmail.com>
Date:   Sun Jul 12 20:54:59 2015 +0200

    JSHint test failing because of missing semicolon
    
    I just cloned the branch and both gulp and grunt fail on the lint task because of the missing semicolon.

[33mcommit d9c15e2a5cc4195530093b21fb0f0b468546319b[m
Merge: ab68fd2 bf79c17
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sun Jul 12 19:48:38 2015 +0300

    Merge pull request #642 from lirantal/bugfix/password-changing-on-user-save
    
    Fixing user's passwords keep changing when saving the user model

[33mcommit ab68fd286fb7f751343d6bff7bd398bf7d2656d5[m
Merge: e1001b8 39e4282
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sun Jul 12 19:26:33 2015 +0300

    Merge pull request #643 from lirantal/enhancement/README-update-grunt-startup
    
    Update README about grunt environment modes

[33mcommit bf79c17bd04e3f57522e8f354f99a8dbdaaf583f[m
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sat Jul 11 12:24:32 2015 +0300

    updating the schema save pre hook so that it checks for a modified version of the password field before it tries to re-calculate the new password to save for the user model

[33mcommit e1001b89f810646c31e44ebeda3bebf1411c3530[m
Merge: 00879f5 9fb2215
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sun Jul 12 19:19:58 2015 +0300

    Merge pull request #640 from lirantal/bugfix/server-startup-log
    
    cleaning up application startup information

[33mcommit 00879f56d623290a69ac8445b8fabb1a5564c353[m
Merge: 9e8ee9e 2e03d13
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sun Jul 12 19:19:11 2015 +0300

    Merge pull request #641 from lirantal/bugfix/db-name-per-environment
    
    updated the development.js environment configuration to use mean-dev database

[33mcommit 39e428244573241dde5b35e4e7cb5b579849459f[m
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sat Jul 11 13:04:10 2015 +0300

    updating README file with more elaborate instructions on running grunt in different environment modes (dev/prod/secure ssl)
    
    updating title for the SSL section and added information about the port number in secure environment mode

[33mcommit 2e03d13c12b508dfd4d5dfcc54a6a4279be0457f[m
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sat Jul 11 01:05:07 2015 +0300

    updated the development.js environment configuration file to use the mean-dev database instead of mean-test which is used for testing/stages environment

[33mcommit 9e8ee9ea135d7881054ec1d59d769752b28eef6e[m
Merge: cff3efe 6bb5b8c
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sat Jul 11 01:00:12 2015 +0300

    Merge branch 'Robaum-0.4.0' into 0.4.0

[33mcommit 6bb5b8cfd5caadc07b19b029ce07219eb7673e7e[m
Merge: cff3efe 08b2f74
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sat Jul 11 00:59:35 2015 +0300

    Merge branch '0.4.0' of https://github.com/Robaum/mean into Robaum-0.4.0
    
    Conflicts:
    	README.md
    	config/env/development.js
    	config/env/test.js

[33mcommit 9fb22158543e352aac74f77315c3bcd67115fda7[m
Author: Liran Tal <liran.tal@gmail.com>
Date:   Sat Jul 11 00:42:43 2015 +0300

    cleaning up application startup information

[33mcommit cff3efe5b37031ea8fa0fb1e68d61c5d0be85f28[m
Merge: e8c79e4 b8d6fa7
Author: Ilan Biala <ilan.biala@gmail.com>
Date:   Fri Jul 10 13:07:31 2015 -0400

    Merge pull request #637 from Gym/0.4.0
    
    formatting: indent

[33mcommit b8d6fa7e2471bac2a18449a3ebf84b0a2298794a[m
Author: Ryan Hutchison <ryan@gym.com>
Date:   Fri Jul 10 07:21:47 2015 -0400

    formatting: indent

[33mcommit e8c79e4a0b1edec5b354aa85771d6358e02b9e39[m
Merge: ade074c 786c546
Author: Liran Tal <liran.tal@gmail.com>
Date:   Fri Jul 10 09:24:14 2015 +0300

    Merge pull request #634 from Gym/0.4.0
    
    [Bug]: Remove social account.

[33mcommit 786c546d84b1beb7eb760513498fc10cc75c39b9[m
Author: Ryan Hutchison <ryan.hutchison@gmail.com>
Date:   Thu Jul 9 15:44:38 2015 -0400

    Update users.authentication.server.controller.js

[33mcommit 75c80524b75565e1a727a0ac42ec9403bea692dd[m
Author: Ryan Hutchison <ryan@gym.com>
Date:   Thu Jul 9 14:23:31 2015 -0400

    remove unused dependcies.

[33mcommit 16aa646673432c699df1e1f91fd1be8517e9905a[m
Merge: d0bb4a3 ade074c
Author: Ryan Hutchison <ryan@gym.com>
Date:   Thu Jul 9 14:10:01 2015 -0400

    Merge branch '0.4.0' of github.com:meanjs/mean into 0.4.0

[33mcommit d0bb4a3cd31be823caffb588d3175d8532849216[m
Author: Ryan Hutchison <ryan@gym.com>
Date:   Thu Jul 9 14:04:16 2015 -0400

    duplicate controller.  This was moved under settings/

[33mcommit b18a7dda99aa761a8592ea2bc7ee839c5a3cc075[m
Author: Ryan Hutchison <ryan@gym.com>
Date:   Thu Jul 9 13:49:48 2015 -0400

    bug: remove social account.

[33mcommit ade074cf37915538933c51f4934642e05fbb11e1[m
Merge: 11b37f2 d00f4ce
Author: Ilan Biala <ilan.biala@gmail.com>
Date:   Thu Jul 9 13:32:27 2015 -0400

    Merge pull request #599 from loulin/0.4.0
    
    Add return for done(err) in test

[33mcommit 9e19493f503b5c78698b42e8704215898128e7a2[m
Author: Ryan Hutchison <ryan@gym.com>
Date:   Thu Jul 9 13:10:39 2015 -0400

    Remove unused scope declarations.

[33mcommit 11b37f25a58474179b0806a93a746e3a68ac40a0[m
Merge: 8aa9dfa f345d20
Author: Liran Tal <liran.tal@gmail.com>
Date:   Thu Jul 9 19:31:56 2015 +0300

    Merge pull request #633 from Gym/package-formatting
    
    Update package.json to indent space-2.

[33mcommit 8aa9dfaa2a48a59e90bfd7114e938552ee1dd917[m
Merge: c2bcfa3 50937ea
Author: Liran Tal <liran.tal@gmail.com>
Date:   Thu Jul 9 19:28:50 2015 +0300

    Merge pull request #632 from danaronoff/0.4.0
    
    Remove duplicate assets definition

[33mcommit f345d20c3e8da079aba0bea511e09634f661dd85[m
Author: Ryan Hutchison <ryan@gym.com>
Date:   Wed Jul 8 19:51:54 2015 -0400

    Update package.json to indent space-2.

[33mcommit 50937ea5deb4967c977a00e1e7973db273b076da[m
Author: Daniel Aronoff <dan@danaronoff.com>
Date:   Wed Jul 8 19:43:20 2015 -0400

    Remove duplicate assets definition

[33mcommit c2bcfa3acdc71a0eb223d377a05edc0d64ce35b4[m
Merge: 6003085 99e0ea8
Author: Liran Tal <liran.tal@gmail.com>
Date:   Wed Jul 8 21:13:58 2015 +0300

    Merge pull request #616 from meanjs/master_to_0.4.0
    
    Master to 0.4.0

[33mcommit 99e0ea8b0619d51475bc188150ce14b43b9996cb[m
Merge: 2159094 b6818b6
Author: Liran Tal <liran.tal@gmail.com>
Date:   Wed Jul 8 20:20:15 2015 +0300

    Merge pull request #622 from Gym/0.4.0
    
    update dependencies

[33mcommit b6818b63d3eb22ddb64aceee025441f7e1a57570[m
Author: Ryan Hutchison <ryan@gym.com>
Date:   Tue Jul 7 19:57:58 2015 -0400

    fix btn-large class names.

[33mcommit 67e38aec011d4e55abbb52025218eddf2529fe34[m
Author: Ryan Hutchison <ryan@gym.com>
Date:   Tue Jul 7 10:22:21 2015 -0400

    fix failing tests

[33mcommit 9ca71c8cdea66e9cb7da4510012a43cdc8bc7f98[m
Author: Ryan Hutchison <ryan@gym.com>
Date:   Tue Jul 7 07:42:30 2015 -0400

    remove href attribute.

[33mcommit 73b5fa3df0bad170ba5ad3f8b118847e6ac199c6[m
Author: Ryan Hutchison <ryan@gym.com>
Date:   Tue Jul 7 07:41:00 2015 -0400

    Revert "load bootstrap (doh)"
    
    This reverts commit 7d8cea159bffd5cfe53d24dcb8d0d7af181cc2b1.
