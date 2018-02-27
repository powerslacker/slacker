---
title: "Auto Post to Craigslist"
date: 2016-11-03T19:46:47-07:00
draft: false
slug: "auto-post-craigslist"
tags: ["scraping", "javascript", "tutorial"]
featured_img: "nightmare-web-bot-playlist.jpg"
---

Just completed this tutorial on how to build a web bot that automatically posts ads to craigslist using Nightmare.js

The goal of this guide is to teach you how to build web bots and web automation tools using Nightmare.js and avoid common pitfalls with proper planning, research, debugging techniques, and managing asynchronous code.

## Video

## Resources 

* [nightmare.js](https://github.com/segmentio/nightmare)
* [pry.js](https://www.npmjs.com/package/pryjs)
* [vo.js](https://www.npmjs.com/package/vo)
* [artoo.js](https://medialab.github.io/artoo/)

## Code 

### main.js

```js
var Nightmare = require('nightmare'),
  nightmare = Nightmare();
var vo = require('vo');
var ads = require('./ads.js');
var post = require('./post.js');
var performLogin = require('./performLogin.js');
var loginCheck = require('./loginCheck.js');

var run = function * (totalAds) {

  var loggedIn = yield vo(loginCheck)();
  switch(loggedIn) {
    case true:
      console.log('Logged in succesfully');
      nightmare.end(); 
      vo(main)(totalAds);
      break;
    case false: 
      console.log('Login check failed, trying to login')
      loggedIn = yield vo(performLogin)();
      nightmare.end(); 
      loggedIn ? vo(main)(totalAds) : console.log('Unable to log in. Please verify credentials and source code')
      break;
  }
};

var main = function * (totalAds) {
  var post = require('./post.js');
  var ads = require('./ads.js');
  for (var i = 0; i < totalAds; i++) {
    console.log('Attempting to post ad', i);
    yield vo(post)(ads[i], i);
    nightmare.end();
  }
  process.exit();
};

```

### loginCheck.js

```js
var Nightmare = require('nightmare'),
  nightmare = Nightmare({show:true});

module.exports = function * (){
	 yield nightmare.goto('https://accounts.craigslist.org/login/home')
    .wait(2000)
    .title()
    .end()
    .then(function(result){
      loggedIn = (result === 'craigslist account');
    })
  return loggedIn
}
```

### performLogin.js

```js
var Nightmare = require('nightmare'),
  nightmare = Nightmare({show:true});

module.exports = function*(){
  var loggedIn;
  console.log('Attempting login...')
  nightmare.goto('https://accounts.craigslist.org/login/home')
    .wait(2000)
    .insert('#inputEmailHandle', 'your-username')
    .insert('#inputPassword', 'your-pass')
    .click('.login-box .accountform-btn')
    .wait(2000)
    .title()
    .end()
    yield nightmare.then(function(result){
      loggedIn = (result === 'craigslist account');
    })
    return loggedIn
}
```

### post.js

```js
var Nightmare = require('nightmare'),
  vo = require('vo'),
  nightmare = Nightmare({show:true});
require('nightmare-upload')(Nightmare);
var url = 'http://' + process.argv[2] + '.craigslist.org/';

module.exports = function * (ad, track) {
  console.log('Processing ad', track);
  yield nightmare.goto(url)
    .wait(2000)
    .click('#postlks #post')
    .click('input[value=so]')
    .click('.pickbutton')
    .wait(1000)
    .click('label:nth-child(5) input')
    .wait(1000)
    .click('#contact_phone_ok')
    .click('#contact_text_ok')
    .insert('#contact_name', ad.name)
    .insert('#contact_phone', ad.phone)
    .insert('#PostingTitle', ad.title)
    .insert('#GeographicArea', ad.city)
    .insert('#postal_code', ad.zip)
    .insert('#PostingBody', ad.body)
    .click('#wantamap')
    .click('.bigbutton') // continue to image uplaoder
    .wait(1000)
    .click('.bigbutton') // done w images
    .wait(1000)
    .click('.bigbutton') // publish
    .wait(1000)
}
```

