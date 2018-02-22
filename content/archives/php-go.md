---
title: "RE: Moving From PHP to Go and Back Again"
date: 2017-12-14T04:48:54-07:00
draft: false
human_date: "December 14, 2017"
slug: "re-moving-from-php-to-go-and-back-again"
featured_img: "golang_vs_php.png"
tags: ["golang", "webdev", "php"]
---


_This post is a response to [https://medium.com/@ivanjaros/moving-from-php-to-go-and-back-again-9ea1f57018c4](https://medium.com/@ivanjaros/moving-from-php-to-go-and-back-again-9ea1f57018c4)_

**12/11/17, 11:51 PM** - So, uh...this post is blowing up on [Hacker News](https://news.ycombinator.com/news). I haven't posted in months and just got several months worth of traffic in a few hours. I don't know if my ramblings are really more important than the MDN docs but special thanks to [neoasterisk](https://news.ycombinator.com/user?id=neoasterisk) - whoever you are! 


{{< imgcap title="This post is top 3 on hacker news. Not bad for a random rant I threw together!" src="../img/hacker-news-1.png" >}}

{{< imgcap title="Hopefully the CDN can keep up!" src="../img/site-stats.png" >}}

_**NOTE**: I believe PHP is a fantastic language for web development, and for years was the obvious choice. Things really have changed in the past decade, and these are my thoughts regarding the author's points - not an argument against PHP in general. There is a time and a place for PHP (as well as other scripting languages), and a time and a place for Golang. _ 


> You see, there are some well known projects built with Go — like Kubernetes, Docker, basically all HashiCorp's products, Moby, Prometheus.. and this gives you the impression that Go is a great tool for building bigger applications. And the truth is the exact opposite. These companies/teams have picked Go most likely for the same reason Google has made it for itself. And that is — making low level language powerful enough to be as performant as C but as simple as Python, for example, and allowing large teams with different background(lower/higher level) to work together on single platform. The reasoning behind this is well known and you can simply google the reasons which I am not going to reiterate in here.

**Go is a great fit for web development**, specifically on larger projects. In addition to the companies listed Go is being used in production at UBER. It is the powerhouse behind their 2nd highest query per second service ([https://eng.uber.com/go-geofence/](https://eng.uber.com/go-geofence/)) among many others. While UBER is a polyglot environment, they use Go heavily, as do many other companies. ([https://github.com/golang/go/wiki/GoUsers](https://github.com/golang/go/wiki/GoUsers)) Some companies use Go for web development exclusively. 

The primary reasons for using Go on a big project are many-fold, but I'll focus on the most obvious one: **you get considerably better performance both in terms of code and developer productivity.** Go is a language that enforces strict styling, and obvious coding practices. It borrows slightly from Object Oriented Programming and Functional Programming, but relies most heavily on the procedural model of programming. While arguments can be made for the strengths and weaknesses of each model, the Go authors, who are veteran programmers, have made specific trade-offs in order to produce a language which is nearly as performant as C, while keeping developer productivity high. What this means is that teams composed of engineers of varying skill levels can work on the same codebase and (for the most part) can all understand each other's code. 


_Movio found that it took their team **six months** to become productive using Scala, whereas it only took them **two weeks** to become productive using Go._ ([https://movio.co/en/blog/migrate-Scala-to-Go/](https://movio.co/en/blog/migrate-Scala-to-Go/))

> If you look at those bigger projects, the code base is a mess, due to the way Go forces you to work by splitting code into different “namespaces”. On itself, that is not a sin. But another point I want to make is that in Go, you absolutely, under no circumstances, should be even trying to reuse code or define an interface. Sooner or later, it will bite you in the ass. Go is not OOP in any shape or form, no matter what “they” try to tell you. Go is imperative language with procedural style of writing code. Yes, you have objects and you can attach methods to them, similarly to Ruby where everything is an object, but that's basically it. Never, ever, try to repeat yourself in Go. You will crash and burn. When it comes to Go, spaghetti code is what you want to write.

{{< imgcap title="have I met your standards now warent? (https://news.ycombinator.com/item?id=15903503)" src="../img/confused-girl.gif" >}}

This is just plain wrong. **Go gives you many tools similar to what you would find in an OOP language, with most of the OOP cruft removed.** [Embedding](https://golang.org/doc/effective_go.html#embedding) is a light weight version of inheritance. Interfaces allow for dynamic types to be passed around such as you might find in the classical "adapter" or "strategy" design patterns. Structs can have private or public properties, namespaces can have private or public functionality. _The idea that you would want to write spaghetti code is ludicrous_. While it may take some getting used to, and a bit of extra forethought, it is entirely possible to have DRY code in Go.

> There is a reason why Go is lacking “real” frameworks. Sure, you have Go Kit, Micro, Gin and few others but they will never be able to come even close to Symfony, Laravel, RoR, Django or Flask. And that is because they are limited by the language itself. You cannot define interfaces on their own. It has no meaning. You have to define basic functionality that can be extended by the user. You can do this and have an interface and base struct but once the user extends the struct via composition all you binding methods will go out of the window and the user is left with having to re-implement everything anyway.

{{< yt src="https://www.youtube-nocookie.com/embed/5GpOfwbFRcs?rel=0&amp;start=173" >}}


Go lacks "_real_" frameworks because frameworks take away granular control in exchange for developer ease and terse code. Note that I didn't say developer productivity, I said ease. Most Go developers I have met have had their fill of frameworks that make things "easy". These frameworks lure you in by promising you the world - which they give you - the catch being they are giving you "their" world, instead of one that works for your specific needs. I've worked with RoR, and a variety of frameworks in the Node world - and I have never had a framework project where I didn't end up [fighting the very system](http://blog.breakthru.solutions/10-tips-web-developer-designer/) that was supposed to make development "easy".

> Go was meant to solve problems as efficiently as possible. And this collides with higher level languages, like PHP, Java, C#, Python or whatever you're using. These languages provide you with a lot of abstractions to make writing code easier and not having to think about IOs, packets, bits and bytes, gc and whatnot.

**Just because you stop thinking about them doesn't make packets and IO go away!** All you've done by using PHP is removed or significantly diminished your ability to deal with the "non-abstract" version of these items. Transferring and manipulation of bytes and bits is a significant tool, especially when dealing with anything hardware or compression related. It might not matter if your app is a glorified todo list, but for building efficient web-based software it is virtually a must-have.

> Human factor has to come in play in here. Writing code is not about performance — unless you are in finance.

Certainly, if you are trying to ship a proof-of-concept. **However, if you made this claim at Google Search, YouTube, Reddit, or UBER you would find yourself in a room of smirking engineers.** Code at major companies and even mid-sized companies needs to perform well, and if you want to see just how much more performance you'll get out of Go there are dozens of benchmark tests showing it to outperform every major "web-language" in common usage ([https://www.toptal.com/back-end/server-side-io-performance-node-php-java-go](https://www.toptal.com/back-end/server-side-io-performance-node-php-java-go)).

_**NOTE**: I haven't seen any comparisons for Erlang/OTP, but I did say common usage._

> Writing code has to be pleasant experience. Writing code is like painting or sculpting. You have to have a passion for it. You have to love it. Otherwise, what's the point? You'd be better off working behind an assembly line for some car manufacturer.<span style="color: #424242; font-size: 16px;"> </span>

![](../img/navy-job-adventure.gif) 

Like they say in the military: "**It's not just an adventure,** **i****t's a job.**"   Software isn't just about warm fuzzies and pride in your work - its also about solving problems. Business problems tend to pay the best, and their problems typically are along the lines of:

* Make sure we don't get hacked
* We promised to deliver and fully test by [MM/DD/YY]
* Our customers want to buy more products but the server keeps failing under heavy load
* The performance of our app remains stagnant or is constantly diminishing while our hardware costs keep doubling

These are hard issues to solve with PHP, so hard that Facebook hand crafted a [SPECIALIZED VIRTUAL FREAKIN' MACHINE](https://hhvm.com/) to deal with the performance issues inherent in PHP. Does that really seem like an "easy" solution? 

_**NOTE**: I understand that Facebook's decision to develop and use HVVM was a business decision which was probably far cheaper than switching their existing code base from PHP. But, if they had to start all over again today - I seriously doubt they would have gone all-in on PHP._


Ok, I've made all the points on why I disagree with this article. I honestly found nothing of value in it, other than it is in my opinion, _still better written than half the drivel being pushed via Medium these days_. Now I'll move on to part 2 of my rant where I'll pose a few questions for anyone considering using Go in their next web project: **Would you rather?**

*   A - Be able to write new code 50% faster
*   B - Have 90% less errors in all new code you write

*   A - Have a large ecosystem where you can pull all kinds of various snippets into your project, which may or may not conflict with your existing functionality?
*   B - Have a large built in system which gives you only the code you need AND have a large ecosystem, but you are responsible for managing your dependencies?

*   A - Have a controller that reads like plain English but takes 5 seconds to respond to requests?
*   B - Have code that reads like code, but takes 0.100 seconds to respond to requests?

**If you answered mostly B to the questions above you should try out Golang. Take more than 5 days before you give it an evaluation. You just might thank me for it.**