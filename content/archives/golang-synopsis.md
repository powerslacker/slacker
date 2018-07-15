---
title: "Golang: A Synopsis"
date: 2018-07-15T14:00:00-07:00
draft: false
featured_img: "gopher-wizard.svg"
tags: ["golang"]
slug: "golang-synopsis"

---

This article is an attempt to coalesce the answers to many frequently asked questions on Golang I have seen floating around the net. I sense that many of the Go FAQ's leave something to be desired in terms of the history of Go and it's nature. I wanted to try my hand at a more robust introduction to Golang, that would give some context to the intention, history, and feel of the language and the community that has formed around it.

## What is Golang?

Golang, aka Go, is an open source programming language developed internally at Google. It is designed to make teams of programmers more productive while working on projects involving networked systems, multi-core computers, and the web.

## Who Created Golang?

Golang was created by  Robert Griesemer, Rob Pike, and Ken Thompson. The original three-man team developed the core language for release at Google. After Go's initial release to the public, the project has been an open-source endeavor and many hands have worked on the source code that makes up the Go programming language.

## Why was Golang Created?

Ken Thompson [stated in an interview](http://www.drdobbs.com/open-source/interview-with-ken-thompson/229502480):

> ...The three of us got together and decided that we hated C++, it's too complex. Going back...if we'd thought of it, we'd have done an object-oriented version of C. But we were not evangelists of object orientation...we started off with the idea that all three of us had to be talked into every feature in the language, so there was no extraneous garbage put into the language for any reason.

Go's inception was the result of a shared distaste for C++ and the desire to make a higher-level programming language akin to C without the cruft of many modern languages. 

The [Go FAQ goes further](https://golang.org/doc/faq#creating_a_new_language) stating:

> Go was born out of frustration with existing languages and environments for systems programming. Programming had become too difficult and the choice of languages was partly to blame. One had to choose either efficient compilation, efficient execution, or ease of programming; all three were not available in the same mainstream language. Programmers who could were choosing ease over safety and efficiency by moving to dynamically typed languages such as Python and JavaScript rather than C++ or, to a lesser extent, Java.

This gives Go the additional goal of being a reliable, type-safe, and developer-friendly systems programming language. The end goal of Go is to offer the performance, safety, and power of modern compiled languages while having the flexibility and simplicity of modern scripting languages. 

## Is Go a Scripting Language?

No. Not in the traditional sense. Go produces stand-alone, compiled binaries for specific platforms. It's also statically-typed, a feature that is rare in scripting languages. However, the tooling and build time associated with Go allows for Go programs to be developed and used similarly to those of scripting languages. 

For example, The ```go run``` command can build and execute small Go programs at speeds akin to interpreted languages, while maintaining the performance optimizations of a compiled language. This means Go is suitable as a replacement for scripting tasks that are "one-shots" such as file manipulation, but a poor choice for reusable extensions or plugins to other programs.

## What Does Golang Look Like?

Here is an example of printing the current time in Go:

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	fmt.Println("The time is", time.Now())
}
```



As seen above, Go programs have a package name, and every runnable Go program has a ```main``` function that acts as the entry point to the program. Code from existing packages and the standard library can be used via the ```import``` keyword. Go  code does not require semi-colons as a line-delimiter, and functions are declared as ```func``` for brevity. This is a simple example adopted from  [A Tour of Go](https://tour.golang.org), where more examples of Go code can be found.

## What Makes Golang Different than Other Programming Languages?

Go is a highly-opinionated, statically-typed, compiled, concurrent, cross-platform language, with relatively simple features compared to most high-level programming languages. It has robust programming tools, automatic garbage collection, and a broad standard library. This primary differences this brings to Go are:

- quick build times
- slim binaries
- highly "readable" code
- fewer runtime errors when compared with most scripting languages
- less complexity and boilerplate when compared with most compiled languages

## What Data Types are Available in Go?

Go has a slim list of basic built-in types:

- ```bool```
- ```string```

- ```int```

  - ```int8```  
  - ```int16``` 
  - ```int32```  (can be aliased as ```rune```)
  - ```int64```

- ```uint```

  - ```uint8``` (can be aliased as byte)
  - ```uint16``` 
  - ```uint32``` 
  - ```uint64``` 
  - ```uintptr```

- ```float32```

- ```float64```

- ```complex64```

- ```complex128```

  

Additionally, Go has higher-level types such as:

- ```struct``` for structured data
- ```interface``` for type abstraction 
- ```chan``` for channels - a concurrency primitive
- ```array``` for defined collections
- ```slice```, for dynamic collections
- ```map```, for dynamic, key-indexed collections



Virtually all types are a *reference* by default -- meaning they do not refer to a specific memory address. Alternatively, a programmer can declare a variable as a *pointer* by prefixing it's type with the asterisk symbol (i.e ```var foo *int```) meaning that the variable does point to a specific address in memory.

The types listed above can be mixed and matched by users to extend the language and create their own types. New types created by users can have their own methods, private / public fields, fulfill interfaces, and be embedded into other user-defined types.

In this regard, Go's type system is similar to mainstream object-oriented languages, but with greater simplicity. The simplicity of the type system can be considered both a blessing and a curse. Many programming tasks become less burdensome due to reduced boilerplate. On the other hand, some common tasks are made tedious due to the lack of generics.



## Why is Go so Fast?

Go is fast. Nearly as fast as some of the top compiled languages. A few reasons why:

- Efficient usage of memory
- Compiled into machine bytecode -- by nature it's hard to achieve the same results by adding the overhead of a virtual machine or runtime environment.
- Clever cache utilization
- Dead code elimination and function inlining

Dave Cheney wrote an excellent article titled "[Five Things That Make Go Fast](https://dave.cheney.net/2014/06/07/five-things-that-make-go-fast)" covering all these and more in greater detail.

## Why is Golang Popular?

Golang has broken the top 20 on the TIOBE Index, and as of the writing of this article rests at #18. What began as an experiment less than a decade ago has become a major player in the programming world. How did this happen - and why did Go become popular so quickly?

### Go Makes Hacker News

On August 30, 2012, [Hampton Catlin posted the following on the golang-nuts Google Group](https://groups.google.com/forum/#!topic/golang-nuts/hC0aJ8IASi4/discussion):

> 100% of our production system is now running Go as 95% of our
>
> application (C being the other bits). Not side bits, but our critical
>
> path.
>
> We're running around 800 million requests a month
>
> through our various public-facing sites run on more than
>
> 500 servers on AWS.
>
> Sites we power that are in pure-Go...
>
>   [http://m.macys.com](http://m.macys.com/)
>
>   [http://m.1800flowers.com](http://m.1800flowers.com/)
>
> ...and a lot more.
>
> 
>
> We are running this on our production servers, but we
>
> also have a local development env that our customers run
>
> and that is compiled in all three major operating systems.
>
> We have a binary executable available for Linux, Mac OSX,
>
>  
>
> Since 1.0, Go has been ridiculously stable for us and
>
> the decision to switch has been one of the better decisions
>
> we've made as a business.
>
> The power and speed of a compiled language, with the 
>
> flexibility and agility that we've come to expect in a 
>
> modern language.

Catlin's review of the Go programming language is nothing short of glowing. The post was linked to on Hacker News the same day and quickly made its way to the front page. This was one of the first reports of major systems outside of Google having good results with Go in a production environment. 

### Early Adopter's Report Success With Golang

In 2013, Dylan Stamat posted an article titled ["How We Went from 30 Servers to 2: Go"](https://blog.iron.io/how-we-went-from-30-servers-to-2-go/). In the article, Stamat describes the transformation in server load during the switch of IronWorker from Ruby to Go:

> Our sustained CPU usage on our servers was approximately 50-60%.  When it increased a bit, we’d add more servers to keep it around 50%. This was fine as long as we didn’t mind paying for a lot of servers (we did mind). The bigger problem was dealing with big traffic spikes. When a big spike in traffic came in, it created a domino effect that would take take down our entire cluster.
>
> After we rolled out our Go version, we reduced our server count to two and we really only had two for redundancy. They were barely utilized, it was **almost as if nothing was running on them**. Our CPU utilization was less than 5% and the entire process started up with only a few hundred KB’s of memory (on startup) vs our Rails apps which were ~50MB (on startup). Compare that even to JVM memory usage! It was night and day.

### Docker Replaces Python with Go

On March 13, 2014 Docker released version 0.9, where Go replaced Python as the container execution environment. In November 2014, Docker became supported on AWS EC2 instances quickly making it synonymous with containers in the web development industry.

Docker and AWS, being one of the main platforms for new web products and deployments brought the additional credibility that Go needed to gain headway. Google Trends results show Golang gaining roughly a 25% increase in search traffic in early 2015, followed by major gains each year following.

### Golang Finds a Niche

It seems that the hype around Golang has been the result of early adopters reporting that the language worked for them in production - that they took a risk betting on a Google experiment and the payoffs were big. Programmers, being a pragmatic bunch, share the stories of a new language with major benefits -- and they want the same results those early adopters found. The Go programming language, oddly enough, has found a niche with web developers working on cloud software -- not the C++ developers the creators originally aimed for.

Rob Pike saw Go was gaining popularity in the web development community, and in 2012 wrote this about [the shift of Python and Ruby to developers to Go](https://commandcenter.blogspot.com/2012/06/less-is-exponentially-more.html):

> Python and Ruby programmers come to Go because they don't 
> have to surrender much expressiveness, but gain 
> performance and get to play with concurrency.
>
> C++ programmers don't come to Go because they have fought 
> hard to gain exquisite control of their programming 
> domain, and don't want to surrender any of it. To them, 
> software isn't just about getting the job done, it's 
> about doing it a certain way.
>
> The issue, then, is that Go's success would contradict 
> their world view.
>
> And we should have realized that from the beginning. 
> People who are excited about C++11's new features are not 
> going to care about a language that has so much less.  
> Even if, in the end, it offers so much more.

## What is Go Good at?

### Performance

Go regularly outperforms Java, PHP, Python, Perl, Ruby, Bash, and NodeJS in benchmark tests. There are some examples of Java outperforming Go in certain benchmarks, primarily in those that favor Java's Garbage Collector.

In addition to performance benchmarks, Go has a strong body of anecdotal evidence demonstrating that it does exceptionally well when it comes to concurrent processing such as web servers under heavy load or distributed workloads.

### Networked Applications

Go has built in functionality for a wide variety of networking tasks including easy to use implementations for TCP, HTTP, and UDP servers. Most common functionality for networking is also baked-in so dealing with IP addresses, MAC addresses, ports, DNS, etc. are relatively simple. This makes Go a great language for pushing data around, working with IoT devices, or developing powerful and fast web applications.

### Simplicity & Readability

Rob Pike stated in his 2012 article "[Less is exponentially more](https://commandcenter.blogspot.com/2012/06/less-is-exponentially-more.html)" :

> There's an unrelated aspect of Go's design I'd like to touch upon: Go was designed to help write big programs, written and maintained by big teams.  
>
> There's this idea about "programming in the large" and somehow C++ and Java own that domain. I believe that's just a historical accident, or perhaps an industrial accident. But the widely held belief is that it has something to do with object-oriented design.
>
>  I don't buy that at all. Big software needs methodology to be sure, but not nearly as much as it needs strong dependency management and clean interface abstraction and superb documentation tools, none of which is served well by C++ (although Java does noticeably better).

Go is a very basic language. There are a handful of data types, abstractions, and a relatively compact standard library. In this simplicity lies one of Go's greatest strengths. A relatively skilled programmer, who is familiar with programming in any C-based language can get up and running with Go in a matter of days, can be competent in a few weeks, and be skilled in a few months. There's not a lot of fancy tricks, syntactic sugar, or magic. 

On top of the clarity provided by a small, strict language -- ```gofmt``` the formatting tool that is shipped with Go, is the default and the standard.  This means that holy wars over formatting in Golang are few and far between.

All things considered, Go code written by a Senior Developer, a Junior Developer, or even a layman can be worked on by virtually any other Go practioner. This is a major victory for industry and open source projects. With Go, there are fewer bits of code that can only be understood by those who have studied the higher mysteries. A Go program can be read and understood by almost any programmer given enough time. Compare this with Java/C++, where one must understand the language, the OOP philosophy, and the abstraction philosophy of a program's authors in order to understand a program of even moderate complexity. 

## What is Go Bad at?

### GUI Development

Go was not created for GUI development, and very little effort has been used to push it towards that direction. This may be due to Go's aim to be cross-platform, while GUI development can be a highly OS specific activity. Some Go developers have made bindings to various GUI toolkits such as Nuklear / OpenGL, but there isn't any standard and the bindings tend to be reliant on external dependences. Nearly a decade of Golang and the most cross-compatible graphics layer available is HTML + CSS.

### Very Simple Programs

While usable as a replacement for scripting languages, Golang can be a heavyweight solution when compared to Ruby, Perl, Javascript, Bash, or Python for scripts. If all you need to do is filter a dynamic list, fill in some text based on user input, or rename a few files - Go might be overkill.

### Absolutely Critical Performance

Go is fast, but it still loses to C++/C in the vast majority of cases. It can get close, but automatic garbage collection cannot beat manual memory management. If you are planning on developing a pacemaker or launching rockets into space - don't use Go.

## What Production Systems use Go?

- Docker -- software application containers
- Heroku -- cloud deployment
- Cloudflare -- content delivery network
- Medium -- blog engine
- Iron.io -- containerized background jobs / batch processing
- Moovweb -- mobile presentation layer for enterprise websites

## How to Get Started with Golang

Getting started with Golang can be a daunting task. Its still a young programming language, so good online resources for learning it are relatively sparse. Luckily it is a simple language and if you are familiar with any C-based language, you will probably pick up Go quickly. I've included some resources that should help beginners get the ball rolling:

### Basics

- [Installation](https://golang.org/doc/install)
- [A Tour of Go](https://tour.golang.org)
- [Go by Example](https://gobyexample.com/)

### REPL

Well, sort-of. As close to a REPL as you can get with a compiled language.

- [The Go Playground](https://play.golang.org/)
- [Go Sandbox](https://go-sandbox.com/)

### Tutorials & Articles

- [50 Shades of Go: Traps, Gotchas, and Common Mistakes for New Golang Devs](http://devs.cloudimmunity.com/gotchas-and-common-mistakes-in-go-golang/)
- [Fresno City College - Google's Go Language](https://www.youtube.com/playlist?list=PLSak_q1UXfPqOSPQ9Y_1pwQW57g3tRz1m)
- [Web Assembly and Go: A look to the future](https://brianketelsen.com/web-assembly-and-go-a-look-to-the-future/)
- [Building Web Applications  with Go](https://astaxie.gitbooks.io/build-web-application-with-golang/content/en/)
- [Shelled Out Commands In Golang](https://nathanleclaire.com/blog/2014/12/29/shelled-out-commands-in-golang/)
- [Dependency Injection in Golang](https://medium.com/@zach_4342/dependency-injection-in-golang-e587c69478a8)
- [Object Oriented Inheritance in Go](https://hackthology.com/object-oriented-inheritance-in-go.html)
- [Network Programming with Go](https://ipfs.io/ipfs/QmfYeDhGH9bZzihBUDEQbCbTc5k5FZKURMUoUvfmc27BwL/index.html)
- [A Million WebSockets and Go](https://medium.freecodecamp.org/million-websockets-and-go-cc58418460bb)
- [Monads for Go Programmers](https://awalterschulze.github.io/blog/post/monads-for-goprogrammers/)
- [Go Database / SQL Tutorial](http://go-database-sql.org/)
- [Bit Hacking with Go](https://medium.com/learning-the-go-programming-language/bit-hacking-with-go-e0acee258827)
- [Gophercises](https://gophercises.com/)
- [Applied Go](https://appliedgo.net/)
