---
title: "10 Things Web Developers Need to Know"
date: 2016-10-24T20:12:04-07:00
draft: false
slug: "10-things-web-developer-designer"
tags: ["webdev"]
featured_img: "web-developer.jpg"
---

I just finished creating a new web application called Only One Percent Listings. It was a medium sized project and really pushed the limits of my web development skills. I learned a lot and I wanted to document my experience for myself and pass that knowledge along for all the freelancers and junior developers out there.

Get Everything in Writing
-------------------------

Developing a website or application with complex logic, solid front-end design, and thoroughly testing it is hard enough on its own. Don't make it harder by having things be unclear between you and the client, or your boss if you work for a company. Get every feature, spec, and expectation out in the open before you write a single line of code. If either party is unclear, spend time further developing the vision and plan for the project in detail. Spending an extra hour here will save you dozens down the road.

You Don't Always Need a Framework
---------------------------------

I love Ruby and Ruby on Rails. I've yet to see a language that makes more sense for web development. It's clean, easy to use, and very powerful. I never feel more productive than when I'm using Rails. But, there is a cost. A big cost. Rails adds serious overhead to your project. I'm not talking about page load speed, or gem dependencies. I'm talking about the Rails environment. Setting up Rails, debugging, having gems work locally but not on Heroku. Having to host on a platform like Heroku, Digital Ocean, or AWS in the first place. It's a lot of extra variables that you have to manage and account for. These things are minor inconveniences in a large scale app. However, they are a real pain in the tuckus when your app is small or medium size. Especially when the logic behind it isn't very complex. I spent a lot of time wrestling with my framework. That's a lot of time that can be better used coding, writing unit tests,  and just plain enjoying life. If you're project isn't doing anything particularly complex - don't use a framework in the first place. Use something dead simple that won't get in your way.

Use Preprocessors
-----------------

I used SASS and Emmet in this project a lot. I wanted to use Jade, but the setup/configuration time with Rails didn't seem worth it to me. If you're not already, use a CSS preprocessor such as SASS or LESS. Throw in a HTML template system such as Jade or Handlebars. Developers and designers should be focused on adding and testing functionality - not stirring up pots of div soup.

Don't Reinvent the Wheel
------------------------

We've all heard this before. Yet, for whatever reason, its easy to find yourself tweaking the CSS of a single element for hours trying to make it 'just right'. Guess what? That image slider you're working on - someone already made one almost exactly like it. Same goes for that image upload box, the avatar box for your users, font pairings, and color schemes. Don't give in to the temptation to make everything 100% custom. Study the work of others, research diligently to see if your problem has already been solved by someone else. The time you save NOT fiddling with a minor piece of CSS is time you can spend on problems that haven't been solved.

Don't Use a Cloud IDE Unless You Have To
----------------------------------------

I used Cloud9 for the majority of this project. I'm not bashing Cloud9. Its fantastic. But, if I had to start over -  I wouldn't use it on this project again. When using a framework like Rails, sometimes you gotta get your hands dirty. You need to peek under the hood. The trouble with using a cloud IDE is that it 'handles' the under the hood stuff for you. I found out too late in the project that I couldn't directly inspect the gems I installed. I couldn't view the files in my RMagick installation directory. I couldn't send test emails without setting up SendGrid. If I had been developing locally, I could do all these things. I wouldn't have had to scour forums and stackoverflow for obscure errors that didn't happen to other developers who didn't use Cloud9.

Write Unit Tests
----------------

When your codebase is small it seems pointless to write unit tests. This is a trap. As your code grows, things always change. This is one of the primary causes of bugs. Just write the tests. Don't be lazy. Finding and fixing a bug takes 10x the effort of writing a good unit test.

You're Not Writing Enough Comments
----------------------------------

We all believe that we have a deep understanding of our own code and thought process. Until, a few weeks later, you look at your code with fresh eyes and you wonder what kind of drugs you were on when you wrote it. When your "in the zone" hammering away at code, you don't notice the little mistakes you make or unconventional ways you solve problems. Solve this by writing comments first - code second. That way you can always come back and understand your code.

Design for Mobile First
-----------------------

You're using a desktop or a laptop to create your designs. So it makes sense to design those and then modify for phones, right? Nope. A mobile design is limited in space. A good desktop design is hard to coerce into a mobile design. Desktops have virtually unlimited space - so a mobile design easily transforms into a wonderful desktop layout.

List Your Tools in Advance
--------------------------

The time to find out you don't know how you're going to solve a problem is in the beginning of a project. Not the middle. Using the feature list you've gathered, create a list of every framework, library, and API you're going to use in this project. Not sure which one to use for a particular feature?  Research it. Look for all the common errors it has in relation to your other tools. Occasionally, libraries and tools do not play nice together. Finding out in development is a huge headache and waste of time. Finding out while researching makes it easy to find a different library or make the decision to create your own solution.

Always Double-Check Your Gitignore File
---------------------------------------

I  made an embarrassing mistake on this project. I pushed my public AWS keys to my project. A malicious individual could use those keys to run up sky high bills on my AWS account.  I forgot to add my AWS keys to my .gitignore file. I got lucky. I changed the keys immediately after I found out, added the keys to my .gitignore, and made sure my account had not been compromised. Do not ever do this. Double-check your .gitignore before every push. It could cost you  or your company tens of thousands of dollars.