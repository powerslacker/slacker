---
title: "FIX: Can't connect to local MySQL server through socket '/var/run/mysqld/mysqld.sock' (2)"
date: 2017-07-28T04:57:54-07:00
draft: false
slug: "fix-cant-connect-to-local-mysql-server-through-socket"
featured_img: "mystery.jpg"
tags: ["sql", "lamp", "bugfix"]
---

Quick post today. This is more for my reference than anything else, but maybe some other soul on the web will need this info.

I recently installed the LAMP stack on my Linux Mint distro. Getting mysql to start was a struggle. The main terminal error was:

```html 
	Can't connect to local MySQL server through socket '/var/run/mysqld/mysqld.sock' (2). 
```

I went through several Stack Overflow questions and none of the solutions were working out for me. This happens quite a bit, and it usually means something very basic is missing or messed up on your machine.

SO recommended:

 	* Restarting the mysql server
 	* Adding [mysqld] to the first line of my.cnf
 	* Forcing a password reset of root user
 	* ...and buried way down in the answers was change the bindings in my.cnf to 127.0.0.1

The last answer, changing the bindings is what worked for me. I had to dig through my error logs to find out that the db was failing to connect to some random port.

Possibly a default port? If you know, send me a message!

Anyways, I feel like a cretin for not spotting this in the first place. Too much MongoDB may be causing my SQL debugging skills atrophy.