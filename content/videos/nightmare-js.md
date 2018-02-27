---
title: "Get Started with Nightmare.js"
date: 2016-08-07T19:30:41-07:00
draft: false
slug: "get-started-with-nightmarejs-craigslist-screen-scraping-tutorial"
tags: ["scraping", "javascript", "tutorial"]
featured_img: "nightmare-js.png"

---

In this tutorial you will learn to build a screen scraper using node.js, nightmare.js, and jQuery. This will scrape all the gigs posted on craigslist in the computers section for any city you choose. You can hook this up to a cron job and email yourself the results at regular intervals.

## Video

{{< yt src="https://www.youtube-nocookie.com/embed/lww3DlZseF4" >}}


## Code

[Github repo](https://github.com/powerslacker/nightmare-gigs)

## Dependencies
```
sudo apt-get install node

sudo apt-get install msmtp ca-certificates

sudo apt-get install gnome-scheduler

npm install --save jquery 

npm install --save nightmare -g
```

## Configuring MSMTP

http://www.absolutelytech.com/2010/07/17/howto-configure-msmtp-to-work-with-gmail-on-linux/

## Gnome Scheduler Job 

```
node gigs.js provo > gigs-email.txt && msmtp -t < gigs-email.txt
```

NOTE: You will need to cd into the correct directory in the job unless you have the files stored in your home directory i.e.

```
cd [your_app_directory] && node gigs.js provo > gigs-email.txt && msmtp -t < gigs-email.txt
```