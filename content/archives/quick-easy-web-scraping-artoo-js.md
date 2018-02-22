---
title: "Quick and Easy Web Scraping Artoo.Js"
date: 2016-09-29T00:14:48-07:00
draft: false
featured_img: "artoo.jpg"
tags: ["scraping"]
slug: "quick-and-easy-web-scraping-with-artoo-js"
---

I recently discovered a neat tool which you can use to scrape data from websites with relative ease, called [Artoo.js](https://medialab.github.io/artoo/). Artoo is a javascript library built to test web scraping in the browser, before implementing them in a dedicated scraper such as [Sandcrawler.js](http://medialab.github.io/sandcrawler/) or [Phantom.js](http://phantomjs.org/) One of the great things about Artoo is that installation is dead-simple since its just a bookmarklet. You can go to the Artoo website and drag it to your bookmarks bar and you're ready to go. I wanted to get the phone numbers for various property management companies in my area. So, I went over to Yelp to give Artoo a shot. It took me all of about 2 minutes to get all the data using Artoo - here's how:

## Inspecting the Yelp Page

The first step in any good scrape is to know what you're scraping. On the Yelp Page, I right clicked the elements I wanted to scrape and opened the Google Chrome Inspector. 

{{< imgcap title="Right click on an element you'd like to scrape, then hit inspect in the context menu." src="/img/yelp-inspect.png" >}} 

It helps if you know a little HTML and CSS, because you need to locate the elements you want to scrape and their containing element. If that sounds confusing - don't worry  - its actually very simple. A webpage is made up of HTML elements, aka **tags**. These tags create a structure to the page, much like a skeleton gives structure to a body. Certain tags are contained within other tags. For easy reference, CSS **classes** and **id's** can pinpoint a tag without having to reference its exact location in the HTML - you can think of it like a nickname for a tag or group of tags. Here's an example of an html tag with a CSS class:

 ```html
  <a href="http://www.google.com" class="google-link">Click here to visit Google</a>

 ``` 
 
 The tag above would create a link to Google with class of "google-link". So, now that you're primed on tags, classes, and id's we can jump into the task - finding our scraping targets! 
 
 {{< imgcap title="We see here that the container for the data of each business has a class called 'biz-listing-large'" src="/img/yelp-inspect-2.png" >}} 

 {{< imgcap title="Every business name is contained with a tag that has the class 'biz-name'" src="/img/yelp-inspect-3.png" >}} 

 {{< imgcap title="Phone numbers have the class 'biz-phone'" src="/img/yelp-inspect-4.png" >}} 


## Plugging the Data into Artoo

On the Artoo website there is an example of how to get started with Artoo giving this javascript code:

```js
    artoo.scrape('td.title:nth-child(3)', {
      title: {sel: 'a'},
      url: {sel: 'a', attr: 'href'}
    }, artoo.savePrettyJson);
```

I can't teach you javascript in this post but I can show you that with a little bit of editing you could apply this code anywhere you need a quick web scrape:

```js
    artoo.scrape('.biz-listing-large', {
      name: {sel: '.biz-name'},
      phone: {sel: '.biz-phone'}
    }, artoo.savePrettyJson);
```

I've changed the first line to **biz-listing-large** as I know that's the container tag for both **biz-name** and **biz-phone** tags. Then I set the second line to select **biz-name**, and the third line to **biz-phone**. Note the periods in front of the class names. Those are important! If you're trying to scrape a class name use a period before the class name, and if you're trying to scrape an id use the "#" sign - without the quotes. Now that I've got my scraper code I click on my Artoo bookmarklet to start Artoo. Now I can see Artoo.js is running in the console. You can get to the console by clicking the console tab in the Google Chrome Inspector. I insert my code and press enter, which saves my scraped data. I have my Chrome browser set to ask me where to save data, but by default it saves it in your "Downloads" folder.

{{< imgcap title="Here we see Artoo.js running in the console, and my inserted scraper code." src="/img/artoo-code.png" >}} 

{{< imgcap title="The data I wanted from Yelp, neatly printed in JSON format." src="/img/artoo-data.png" >}} 
 
 This was a simple scrape, and Artoo.js is capable of a lot more than this. With a few more lines of javascript you could clean up the code before it saves so those pesky newline symbols aren't in your finished data. I personally just used [Sublime Text](https://www.sublimetext.com/) to quickly find and replace all the newlines and white space. But, I am slacker after all ;)