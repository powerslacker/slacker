---
title: "Converting from Wordpress to Hugo"
date: 2018-02-24T15:10:34-07:00
draft: false
featured_img: "hugo-gopher.png"
tags: ["webdev", "hugo", "wordpress"]
slug: "converting-wordpress-hugo"
---


A few weeks ago, one of my posts ["RE: PHP to Golang and Back Again"](/re-php-golang-back-agian) made it to the front page of Hacker News. It stayed at the third position on the front page for several hours, and was on the front page itself for no less than twelve hours! This was a major traffic boost for my blog, resulting in nearly **thirty-thousand unique visitors in under two days**. At one point, Google Analytics reported over one-thousand concurrent users. 

For the last two years, my blog has been hosted on a dirt-cheap server provided by namecheap, and powered by Wordpress. I wasn't sure my blog could handle the traffic from Hacker News, but it did quite well under the circumstances - and some kind folks on reddit told me that I still had plenty of room to grow using my current setup. 

However, even though my Wordpress hosting setup could technically handle more traffic - it might not handle such traffic gracefully. After analyzing logs and analytics - a decent proportion of the Hacker News traffic blitz was experiencing page load times upwards of seven seconds. 

I personally wouldn't be waiting after four seconds, and according to research by Google [most mobile users will abandon a page after a measly three seconds](https://www.thinkwithgoogle.com/marketing-resources/data-measurement/mobile-page-speed-new-industry-benchmarks/). So, I set out to make site-wide improvements that would keep page load times fast - even under heavy load. 


## Dropping the Database for Fun and Profit

When it comes to page load speed, there is an elephant in the room - databases. While incredibly useful, the cost of a a single database query in terms of page load or memory usage is unmatched by the majority of static resources or typical application logic. 

From my experience this is because each database query requires not only the cost of the query, but also communicating over a connection to the database! Even with optimizations such as indexing, it is unlikely that a database won't be the usual suspect when it comes to site performance issues.

Hugo, a static site generator written in Golang, is a tool for creating static websites semi-programatically using the local file system as it's "database". 

Since all assets are statically generated, all the computation costs of generating the site are handled upfront by the site's creator, and not by the end-user or server. Using a content-delivery network (CDN) and cloud storage - **a static site could be scaled nearly infinitely at a very affordable rate!**

## Why use Hugo?

I chose Hugo for a few reasons:

- Written in Golang and it's libre, so if I need a new feature - I can always buckle down and write it myself
- Uses Golang templates and the file system to minimize the need for raw html and configuration
- Plenty of premade themes to choose from and modify
- Amazingly well done documentation, including video tutorials
- Steady activity on Github
- Generated sites are static, so there are virtually no security issues✝
- I tried using Jekyll and I hated it

✝ - *This wasn't initially one of my concerns, but looking at my Wordpress security stats - there have been over thirteen thousand malicious attacks blocked in the last two years.* ***That's an average of nearly eighteen malicious attempts on the site per day.***

### Transition Difficulties

Hugo is free software, and has a relatively small user base when compared to Wordpress. As such, rough spots around the edges are to be expected.

#### Hugo has No CSS / HTML Preprocessor

I really enjoy working with Jade as an HTML preprocessor and SASS / Stylus for CSS. There is no built-in integration for these tools with Hugo. While it might be beyond the scope of the Hugo project, it feels like this would make building custom themes a whole lot easier. Perhaps I'll write my own integration, but for now I'm editing raw HTML and CSS. I tried using Ace templates instead of the default Golang templates but they seemed a bit clunky for my use case.

I ended up using Gulp to handle SASS compilation, which worked out beautifully. I got the idea from [Building a Production Website with Hugo and GulpJS](http://danbahrami.io/articles/building-a-production-website-with-hugo-and-gulp-js/) by Dan Bahrami. I might try to extend my gulp setup to handle Jade in the future, but for now there is so little HTML that it seems like a waste of time.

#### Importing From Wordpress is a Manual Process

I looked around for a bit and it turns out that there's no easy way to get all your Wordpress posts converted to Markdown. There are Wordpress plugins that claim to do it, but in practice they either just plain don't work or they almost work but skip over large portions of content leaving you with a jumbled mess that needs to be cleaned up. 

I ended up using an HTML to Markdown converter for most of the posts.

#### Hugo is Missing the Little Extras

Wordpress is slow. It has more leaks than the Iraqi navy. It occasionally breaks for no reason. It is a pain to write themes and plugins for it. 

Yet despite all its flaws, Wordpress is the number one blogging platform on Earth - and there's a good reason for it. It has an incredible ecosystem built up around it. Want some feature?  It's very likely someone already made a plugin for it. 

**You can move really quickly with Wordpress, because all the shortcodes, widgets, and plugins have already been developed.**

Hugo...not so much. There are a few good shortcodes built in, but most of them lack the flexibility to be used right out of the box. If you decide to go with Hugo be prepared to put in some elbow grease.

## Sacrificing JavaScript for Simplicity

About halfway through creating my Hugo site theme, I decided to drop all JavaScript from the site except in the case of third-party embeds such as Youtube clips. 

My reasoning for this is that a blog should be like a book, with near-instant page loads, low clutter, and densely packed information. JavaScript just isn't necessary for a blog, and at this point CSS is advanced enough to cover most of the basic DOM manipulation tricks that JS is used for.

This means that I can no longer use Google Analytics on my site. In fact, at this time there are no analytics on my site whatsoever. 

I'll be the first to admit I am addicted to the analytics -- and it has certainly helped me plan out content strategy, build traffic, and understand the kinds of topics people are searching for. At the same time, I don't like the idea of a giant corporation tracking the online movement of anyone who views my content. 

I'll no longer be able to know how much traffic my site is really getting, or brag about it when I see a major spike...but I think my vanity can handle it. Plus, I might spend less time poring over analytics data and actually getting things done.

## Hosting & Continuous Deployment via Netlify

My initial plan was to upload the finished Hugo powered site on Google Cloud Platform, but after searching and testing a few different file layouts, I wasn't able to easily manage url/redirect rules. Call me vain, but I hate seeing .html extensions on a live website - especially my own.

I considered using Apache on a shared hosting provider or digital ocean droplet, but that means I'd be responsible for managing the configuration and software updates for that server. That's a lot of grunt work for a blog. Even if it's just a few hours a year, that's a few hours I could've been writing new posts, making new videos, or working on side projects.

My final consideration and the choice I ended up sticking with was Netlify. I came across Netlify rather serendipitously while browsing the Hugo docs. 

*Well maybe it wasn't serendipity*...Netlify is a sponsor of Hugo, and their logo is prominently displayed in the Hugo site footer. Maybe years of ignoring ads have made me immune to branding, but I honestly didn't even notice the logo until I read one of the posts in the Hugo docs aptly named [Host on Netlify](https://gohugo.io/hosting-and-deployment/hosting-on-netlify/). 

That post got me rather excited, because Netlify acts as a CDN, includes HTTPS for custom domains, acts as a continuous deployment platform, has a slick admin interface, and a generous free tier. With nothing to lose and what appeared to be the holy grail of static site hosting at my fingertips, I gave Netlify a chance. 

**It took all of 10 minutes to get my site up and running.** Performance felt incredibly snappy, the site got all A's on Pingdom, and all it takes to deploy changes is push to the master branch of my github repo. 

## Load Testing With Siege

When it comes to performance, I don't think it makes sense to just listen to random advice found on the internet. If something looks interesting, I test it out and let the data speak for itself. If the advice is good, the tests will prove it...or at least hint at the truth.

In order to get some relevant data I decided to do some load testing, which is something I've never done before. Typically, I'll just wait for load times to get hairy and then take action on hot spots such as SQL query performance or upgrade to a more powerful server. However, in the interest of verifying improved performance, both for myself and the world - I decided to try and get hard evidence for this experiment. 

I installed and configured *siege*, a terminal program for load testing on my desktop computer which should have plenty of hardware to run a solid load test. Then I followed the steps outlined in [this guide on load testing Wordpress sites with siege](https://dotlayer.com/how-to-use-siege-to-load-test-your-wordpress-website/). By the way, I think this guide would work for virtually any site - not just Wordpress.

I decided to test a handful of URLs to simulate real traffic. According to Google Analytics, the most popular pages on my site are two articles, the home page, and the 'web' category page. My siege URL list was setup to hit all those pages randomly, with 255 concurrent users (the max limit in siege without extra configuration).

Running siege for half an hour these are the stats I got back:

```
Lifting the server siege...
Transactions:		      146726 hits
Availability:		       99.96 %
Elapsed time:		     1799.92 secs
Data transferred:	     6479.35 MB
Response time:		        3.10 secs
Transaction rate:	       81.52 trans/sec
Throughput:		        3.60 MB/sec
Concurrency:		      252.56
Successful transactions:      146726
Failed transactions:	          54
Longest transaction:	      127.23
Shortest transaction:	        0.08
```

After deploying my new Hugo site on Netlify, using the same config for siege, and the equivalent URLs on my Netlify deployment I got these stats:

```
Lifting the server siege...
Transactions:		      133829 hits
Availability:		      100.00 %
Elapsed time:		     1799.30 secs
Data transferred:	     6230.40 MB
Response time:		        3.42 secs
Transaction rate:	       74.38 trans/sec
Throughput:		        3.46 MB/sec
Concurrency:		      254.69
Successful transactions:       67660
Failed transactions:	           0
Longest transaction:	       14.45
Shortest transaction:	        0.35
```


**So what do these stats mean?**

To be honest, I'm not sure about the implications of everything siege reported. What I did gather was this:

- With just 255 concurrent users, some requests started to fail via the Wordpress blog
- Wordpress appears to have a slightly faster average response time
- When under pressure, the Wordpress blog slowed down dramatically, while the Netlify blog delivered far more consistently

Something to note is that this is a controlled test of just 255 users. Configuring siege to do more than this turned out to be kind of tedious, so I opted to see what the standard maximum for siege could reveal. 

My final hypothesis after seeing these stats is that the Netlify blog will hold up under heavy load far more consistently and with greater overall reliability than the Wordpress blog, albeit at the cost of a slightly slower average response time overall. 

In plain English, the blog on Netlify should have a better rate of reliability and should maintain an average response time of under 4 seconds even when being bombarded, though under standard load will be a few hundred milliseconds slower than the Wordpress powered site.

Only time will tell whether this hypothesis is correct. In any case, I think I've learned a lot and found a simpler, more powerful work-flow for blogging.