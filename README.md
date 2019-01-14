[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e6fda6c0d7b7484c974fcb46791a07ca)](https://app.codacy.com/app/cinsua/mini-forum?utm_source=github.com&utm_medium=referral&utm_content=cinsua/mini-forum&utm_campaign=Badge_Grade_Settings)
[![Build Status](https://travis-ci.org/cinsua/mini-forum.svg?branch=master)](https://travis-ci.org/cinsua/mini-forum)
[![Coverage Status](https://coveralls.io/repos/github/cinsua/mini-forum/badge.svg?branch=master)](https://coveralls.io/github/cinsua/mini-forum?branch=master)
![](https://img.shields.io/coveralls/github/cinsua/mini-forum/master.svg)
# mini-forum

mini-forum is an REST(ish)/GraphQL(not yet) Api with passport local strategy
Consist in one pool of threads. Each one can be private (only logged in can see the content) or public.
Threads will support comments, notifications, likes, pin and edit/remove


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. This repo was created with the only goal of learning how to make an api in node, following (or trying) some kind of standard.

### Prerequisites

* node
* npm
* mongoDB

### Installing

```
// For dev environment
Mongo running in localhost:27017
cd mini-forum
npm install
npm run dev

```

```
// For production environment
not implemented yet
```

### Running the tests

npm run test

