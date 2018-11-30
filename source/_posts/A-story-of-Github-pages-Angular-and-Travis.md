title: 'A story of Github pages, Angular and Travis'
author: Jesé Romero
date: 2018-10-03 10:15:43
tags:
---
I wake up on day thinking: *But if an Angular apps it's just a HTML, CSS and Javascript!. Some how we must can upload it to Github pages!*

Well, this is what I will talk in this post. If you think that is too much long, at the end you will see a [TL;DR](https://en.wikipedia.org/wiki/TL;DR) so...

<!-- more -->

What I was looking for was: write my Angular App, push the changes and automatically upload and publish them to Github pages.

##### Important!
The versions are:

- npm: 6.4.1
- node: 10.11.0
- angular-cli: 6.2.3
- angular-cli-ghpages: 0.5.3

So if at the end you have some trouble just compare your versions. If after that you still have problems, contact me. 

#### Angular 4+

I will not explain how Angular works, I suppose that all presents here knows about it.

Install the [CLI](https://cli.angular.io/) (``npm install -g @angular/cli``) and generate your app:

``
ng new <app_name>
``

#### angular-cli-ghpages

Now you need the package that makes *magic*:

``
npm install --save-dev angular-cli-ghpages
``

Rest build your app and deploy it! Easy, no?

In order to do that:

``
ng build --prod --base-href "https://<your_username>.github.io/<your_repo_name>/"
``

You must see in the root folder the build in ``dist/<your_app_name>``. Now the deployment, just type:

``
npx ngh --build-dir=dist/<your_app_name>
``

Congratulations! You have your app uploaded to Github Pages, checkout in: ``https://<your_username>.github.io/<your_repo_name>/``

#### Travis

The last step to has a full automatic environment is to add CI with [Travis](https://travis-ci.org/). Here is my .travis.yml:

```
language: node_js
node_js:
- "10"
dist: trusty
sudo: false

branches:
  only:
  - master

cache:
  directories:
  - node_modules

install:
  - npm install -g @angular/cli

script:
  - npm install
  - npm run build
deploy:
  provider: pages
  skip_cleanup: true
  github_token: $GITHUB_TOKEN
  local_dir: dist/code-stats-ranking
  on:
    branch: master

```

Add this to the root folder but, do not push yet!

Go to [https://travis-ci.org/](https://travis-ci.org/) and activate your project. Travis will guide you to do that!

**Important:** Check in the recipe of travis above and you will see a variable named ``$GITHUB_TOKEN``, this will be the token that authorize travis to deploy in your Github page of your repo. To generate it, go to your Github settings in the tab "Developer settings"

Go Travis and into the settings of the project, add the environment variable.

##### Let's try!

Now push your .travis.yml changes and the CI will do the job to deploy your app for you, now you can only focus in the development!

Thank you for reading! 

If you have any trouble with this contact me at [@jeseromero](https://twitter.com/jeseromero).

