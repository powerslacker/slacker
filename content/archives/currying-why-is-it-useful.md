---
title: "Currying, What is it? Why is it Useful?"
date: 2017-07-12T20:55:03-07:00
draft: false
featured_img: "thinking.png"
tags: ["javascript", "fp", "webdev"]
slug: "currying-why-is-it-useful"
---

**Currying**. It can be a frightening word. Textbook examples of currying appear to be hieroglyphics to the untrained eye. It doesn't help that textbooks examples of currying use poorly named variables such as x, y, foo, and bar. I recently got a good grasp of the basics of currying and figured I'd share my understanding. Currying can be considered part of the functional programming (FP, for short) paradigm. The goal of functional programming is to make code:

*   Readable, by separating logic from data structures - making it easier to reason about
*   'Composable', by breaking code into small, reusable modules
*   Higher quality, by avoiding state & data mutation unless absolutely necessary

### So how does Currying fit into FP?

Currying in essence is an example of a higher-order function. Currying is taking a function that would normally take multiple arguments and transforming it into a series of functions that each take one or more of those arguments. Typically this will act as a chain of functions which can be used progressively or simply as a module for ease of use.

![](/img/but-why.webp) 

### Why use currying?

**Composability.** By making functions that return functions, or chains of functions, it is possible to make code that is highly reusable and easy-to-read. Here is a simple example using Javascript: 

```js
let hasElement = 
  e => 
    obj => 
      obj.element == e
    
let dragons = [
  { name: 'bob', element: 'lightning' },
  { name: 'jill', element: 'fire' },
  { name: 'dana', element: 'lightning' },
]

console.log(dragons.filter(hasElement('lightning')))
```


Let's break down what's happening in the code above.

*   The code starts by declaring a function called **hasElement**.
    *   It takes a single parameter, **e**, and from that returns an anonymous function.
    *   The anonymous function takes a single parameter, **obj**, and returns a Boolean based on the conditional check of **obj.element == e**
*   Next up,  there is a data structure (array) called **dragons**
    *   Each dragon has the properties name and **element**
    *   Since the structure is an array, array methods  can be used on it such as .filter, .map, and .reduce
*   Finally, a console.log statement
    *   Inside of it, **.filter** is applied to the **dragons** array
    *   The curried function **hasElement** is passed to the filter as the **callback argument**
        *   A string **lightning** is passed as the argument to **hasElement**

So what is really happening? If we look at [.filter in the MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) we can see it takes a callback function as an argument. That callback will be executed on each element of the array. In the example above, we pass **hasElement** as the callback. **hasElement** returns an anonymous function, which takes an argument **obj**. **.filter** passes each dragon object in the array to the anonymous function returned from **hasElement**, one at a time. With each pass via .filter, the anonymous function executes with the dragon object being passed to it. In the code below we can see two traditional methods of using the callback.

```js 
function hasElement (obj, e) {
  return obj.element == e
}

let dragons = [
  { name: 'bob', element: 'lightning' },
  { name: 'jill', element: 'fire' },
  { name: 'dana', element: 'lightning' },
]

// inline anonymous example
dragons.filter(obj => obj.element == 'lightning')

// named callback example
dragons.filter(obj => hasElement(obj, 'lightning'))
```


 Now, it could be argued that **hasElement** is much simpler in the example above. Which is true! However, that simplicity comes at the cost of more boilerplate when it is used as a callback. What if someone wanted to use **hasElement** across an entire application? Or multiple applications? Or as part of a library? They would have to write the tedious boilerplate every single time. As the codebase becomes larger, the net detriment grows. More boilerplate means more chance for typos, and thus more bugs. It also means lower developer productivity. Even though this is a simple example, those anonymous functions do add up. With currying, **hasElement** becomes slightly more complex but removes unnecessary details from the core logic. As the codebase becomes larger, the net benefit grows. The code is more readable, easier to reason about, higher quality, and can be written faster. This article was inspired by [this video on currying](https://www.youtube.com/watch?v=iZLP4qOwY8I) by MPJ, on his YouTube channel [funfunfunction](https://www.youtube.com/channel/UCO1cgjhGzsSYb1rsB4bFe4Q). The video goes into further depth, using a similar example to the one I used here. I highly recommend you check it out. **If you enjoyed this article, please share it! If I got something wrong, please feel free to let me know **