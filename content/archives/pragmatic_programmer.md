---
title: "Takeaways: The Pragmatic Programmer"
date: 2018-08-20T14:00:00-07:00
draft: false
featured_img: "whiteboarding-programming.jpg"
tags: ["books"]
slug: "pragmatic-programmer"

---

I first read *[The Pragmatic Programmer](https://en.wikipedia.org/wiki/The_Pragmatic_Programmer)* in 2017, after seeing it pop up in numerous online discussions as a must-read book for every programmer looking to hone their craft. I immediately saw what the hype was about. Now, nearly two years later I have begun perusing its pages once more, and it seems all the more relevant. Things that I missed in my first pass stand out to me, and I've lost count of how many tips mentioned in this book that I had to learn the hard way. 

Though nearly twenty years old, *The Pragmatic Programmer* is chock-full of lessons on software engineering, testing, programming, craftsmanship, and common sense that ring true to this day.  To aid my memory between reads, I've put together a summary of my favorite bits of *The Pragmatic Programmer*. I highly recommend reading the book, but if you are short on time, maybe this article will suffice.

Quoted sections are either paraphrased or directly taken from the book, and are provided for context within the summary under fair use. 

## What Makes a Pragmatic Programmer?


### Be An Early Adopter

Develop an instinct for integrating new techniques and tools. Constantly try out new things so you have knowledge of a broad set of options when creative solutions are needed. Let your confidence come from experience.

### Ask Questions

Goes hand-in-hand with being an early adopter, asking questions opens doors to new solutions.  Try to ask your team & mentors:

* How did you do that?
* Did you have any problems working with that library?
* How is that data structure implemented?

### Think Critically

Challenge assumptions. Don't take things for granted. Just because something has always been done a certain way doesn't mean there isn't a better solution. 

### Be Realistic

Try and understand the nature and root cause of any problem you face.  This understanding gives you a good feel for how difficult a challenge will be, or how long it should take to solve a problem.

### Jack of All Trades / T-Shaped Knowledge

Be familiar with a diverse set of tools and technologies. Your current work may require a certain set of skills or specialization, but there is no telling what skills you may need in the future. Drill for deep details when needed, but spend most of your time focused on the big picture.

### Care About Your Craft

If you are going to spend years developing a craft, take the time and effort to do it well. Your peers and employers will thank you.

Don't be mentally lazy. Think while you develop. Software development isn't a mechanical process. Future generations of software developers may look at our methods as archaic but our craftsmanship will still be honored.

> We who cut mere stones must always be envisioning cathedrals -- Quarry Worker's Creed

## It's a Continuous Process

> A tourist visiting England's Eton College asked the gardener how he got the lawns so perfect. "That's easy",  he replied.  "You just brush off the dew every morning, mow them every other day, and roll them once a week."
>
> "Is that all?" asked the tourist.
>
> "Absolutely," replied the gardener. "Do that for 500 years and you'll have a nice lawn, too."
>
> ...Great lawns take great care, and so do great programmers.

Follow [*Kaizen*. the philosophy of many small improvements](https://en.wikipedia.org/wiki/Kaizen). Gains in knowledge follow the law of compounding interest. Work daily to refine your skills. 

## Don't Live With Broken Windows

> One broken window, left unrepaired for any substantial length of time, instills in the inhabitants of the building a sense of abandonment--a sense that the powers that be don't care about the building. So another window gets broken. People start littering. Graffiti appears. Serious structural damage begins. In a relatively short space of time, the building becomes damaged beyond the owner's desire to fix it, and the sense of abandonment becomes reality.

A codebase that contains "[broken windows](https://en.wikipedia.org/wiki/Broken_windows_theory)" will soon start to decay. Take time to keep up the health and structure of your code, don't let technical debt eat away at the motivation of you and your team. Anytime you go back into a codebase to fix a bug spend a little time leaving the code better than you found it. Write a unit test to account for your bug fix, remove magic strings, magic numbers,  or refactor an overly complex function.

## Invest in Your Knowledge Portfolio

As a software engineer your primary method of creating value is transforming knowledge into software artifacts. Ensure you have a large supply of raw materials to use when creating software. The following strategies can be mixed and matched to help develop and maintain a large body of technical knowledge:

### Learn a New Language Every Year

Languages serve a variety of different purposes, and use varied paradigms to achieve the same goals. Knowing a wide set of tools and implementations can help you reach innovative solutions with less effort.

### Read a Technical Book Every Three Months

*The Pragmatic Programmer* recommends a book every quarter,  then moving on to a book each month once the  reading habit is built. There is a wealth of technical knowledge available in books, if you just take the time to acquire it. 

### Read Non-Technical Books Too

Computers are used by people, and your job is to bridge the gap between people and the computer.  Stay in tune with new ideas outside of software to help boost your overall creativity.

### Take Classes

Just because you are fantastic at one area of software development doesn't mean there is nothing for you to learn. Try branching out and learning something from a programming topic where you have limited experience. This can help you avoid tunnel-vision.

### Participate in Local User Groups

No one is an island, and this is especially true in software development. See what others inside and outside your fields of specialization are doing. Finding other programmers has never been easier. Odds are there is a user group dedicated to your favorite programming language and within driving distance of you on meetup.com

### Experiment with Different Environments

If you use Windows at work, play with Linux at home. If you spend most of your time on a Macintosh, try Windows. If you are used to a general purpose text editor try out an IDE, or vice-versa.

### Get Wired

It has never been easier to get connected to other programmers. Large programming communities are constantly communicating via the web on Reddit, Hacker News, IRC, Slack, and dev.to

## Keep Code DRY

The core principle of [**DRY** (Don't Repeat Yourself)](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) is this:

> Every piece of knowledge must have a single, unambiguous, authoritative representation within a system. 

Duplicated code is a cool, damp environment that allows bugs to grow and fester. Try and keep your code as reusable and maintainable as possible. Break common functionality into modules and libraries. The  more code you reuse the less code you write. Writing less code means writing less bugs, and testing fewer lines.

## Code That Glows in the Dark

> ...There are two ways to fire a machine gun in the dark. You can find out exactly where the target is, determine environmental conditions, how your bullets are affected by the environment and their interactions with the type of gun you are firing. Using a computer you can input this data and calculate exactly where to fire.  If all the calculations and data gathered is correct, your bullets should land close to or exactly on target. 
>
> Alternatively you can use tracer bullets. Tracers bullets leave a pyrotechnic trail following the bullet to the location where they land. Tracers can be used to get immediate feedback and adjust aim towards the target in real-time.

Use "tracer code" to build out a skeleton of a fully functional project. Tracer code contains all the error checking, structure, documentation, and logging that the production code will have, and confirms that the system as a whole is in working order. Tracer code allows developers (including yourself!) to build code inside of a mostly working prototype system. This offers several benefits:

* Users can see something working early, and can play around with the prototype offering recommendations and changes before major pieces of code have taken root.
* Developers have a structure to work with, which helps to create consistency in the underlying code. Rather than building pieces of code in a vacuum, you have a structure that affords being built, rebuilt, tested, and debugged regularly.
* Your code can be presented as a demonstration as you make progress.
* You reduce plumbing problems because the early iterations of the project have already verified that the libraries, databases, and UI are all communicating properly.

## Always Use Version Control

Don't stop at using version control for your code. Documentation, planning documents, test data, shell scripts, configuration, etc. should all be version controlled. This makes it easy to take the entire project back in time.  

## Psychology of Debugging

### Bugs Are Everyone's Problem

It doesn't matter who wrote the bug. If it's your software - its your problem. Blaming team members might boost your ego, but it doesn't solve the problem.

### Don't Panic

Deadlines and upset clients can cause anxiety attacks for even the most disciplined Zen masters. Debugging requires a cool head. Step back from the problem and think about what could be the cause of the symptoms you are seeing as a bug.  If necessary take a break and cool off. 

### Sanity Check

Make no assumptions. Check that the most recent release of the software compiles. Use log statements to checkpoint various points in the code where the erroneous code should have reached.

### Interview the User

If possible have the person who found the bug record the steps they took to reach it. If that's not possible ask them questions to find out their process. Remember that unit tests don't exercise the application code as well as a real user and that automated tests can often miss boundaries and realistic end-user usage.

### Reproduce the Bug

Try and replicate the bug on your machine or in a test environment. This allows you to get closer to the exact area of failure.

### Visually Represent the Problem

It can be incredibly helpful to draw out the control flow of data from one component to another. If you find yourself struggling to find a needle in a haystack you may need to express the bug using a visual medium. 

### Read the Logs

If you are keeping good logs you can probably trace the state of the application when the user encountered their issue. This can reveal the cause of bugs very quickly.

### Bugs Stick Together

If you are viewing the logs and see that a variable is obviously wrong or corrupt, you can bet that the offending issue is close to that variable. Bugs live in the same neighborhood. If you find a suspect variable start looking at code that lives in the same function or class. 

### Rubber Ducking

Try and explain how the control flow around a bug should work out loud, ideally to a team member, then explain how the control flow of the code surrounding the bug actually works while reading the code line-by-line. This can be an effective method to bring up "What if..." style questions or help find noticeable gaps in the business logic of the offending code.

### When You See Hoof Prints Think Horses -- Not Zebras

The bug is most likely not the OS, the database, or the compiler. Most bugs are in the application code -- so if you are going to assume something is broken, make the most likely assumption first.

### Don't Assume It -- Prove It

Before you fix a bug, prove that you have found the right issue and that the potential fix will eliminate the issue. If you fix things based on assumptions you could end up with two bugs instead of one.

## Use Code Generators

Programmers tend to produce lots of code that looks very similar. Event handlers, controllers, models, and filtering loops get created thousands of times per day. You can save lots of time by using passive code generators to produce template code for common tasks. For more dynamic jobs you can use active code generators that read a configuration file to generate code.

## Reduce Coupling

When  writing code we want to keep the level of abstraction high. This makes it easier to isolate bugs, and keep our programs dynamic. When you plug in a USB device you don't think about the individual electrons moving through the wire -- those details are hidden from you -- and rightly so. Abstraction makes your life and the lives of others more convenient. Keep your implementations decoupled to simplify your code.

## Metadata Driven Applications

> We want to go beyond using metadata for simple preferences. We want to configure and drive the application via metadata as much as possible. Our goal is to think declaratively (specifying what is done, not how) and create highly dynamic and adaptable programs. We do this by adopting a general rule: program for the general case and put specifics somewhere else -- outside the compiled code base.

The only thing constant in software design is change. We often find the ground moving underneath our feet or feel like we are [building planes in the sky](https://www.youtube.com/watch?v=Y7XW-mewUm8). However we can be more prepared for change by making our applications more dynamic. Benefits of using metadata to drive our applications include:

* Forces decoupled design -- resulting in more flexible programs
* Customize the program without recompiling
* Provides easy work-arounds for production bugs
* Configuration can be more expressive than code
* You may be able to create several applications using the same code but different metadata

## Don't Gather Requirements -- Dig for Them

### Work With a User to Think Like a User

Build an understanding of what real users expect by having real users try your software and communicate with you about what their needs and expectations are.

### Document Use Cases

Utilize a "use cases" template to create a behavior-driven list of requirements for your software. People use software to accomplish things. Figuring out what the end-user is trying to accomplish with the software is often a better roadmap than requirements created in a think tank.

### Don't Overspecify

Good requirements documents are abstract. They specify the what -- not the how. Get requirements that specify the business need. Remember your goal is to fulfill the underlying need of the user. These are real people -- their needs don't always translate nicely to a list of metrics.

###Abstractions Live Longer Than Details 

An abstract requirement such as "users can login with CREDENTIALS" is more flexible than a defined requirement such as "users can login with an email address and password." With flexible requirements, the actual implementation may be more robust, and anyone trying to decipher the requirements document will see a clearer picture of how the software should / could work in the future. Months from now when users want to login with their cell phone number, or use multiple email addresses for the same account you can pat yourself on the back for having the foresight to build a flexible program.

### Maintain A Project Glossary

It's hard enough to develop software when everyone is on the same page, don't make it harder by confusing yourself or your users. Keep an up to date list of terms used in the project and the software that you can point users and developers to. 

## Ruthless Testing

### Test Early. Test Often. Test Automatically.

Develop tests as soon as possible. A small set of automated tests is more effective than an elaborate test plan that is never used. The earlier a bug is found, the easier it is to correct. 

### What to Test

#### Unit Testing

Test individual modules of code for correctness. If the small parts of the application do not work, it's unlikely that the whole program will.

#### Integration Testing

The core of any complex system is the contracts between its components. Because integrations between components are fluid and largely assumed, they make an excellent home for bugs. Focus the majority of testing here and verify that your program honors its contracts.

#### Validation

Users will push any program to its limits. They are excellent at finding boundary conditions and odd edge cases. Are you verifying that user input is bound to the program constraints? You may think that no one would ever use a 600 character password -- but what happens if you try it? Does your program remain stable?

#### System Failure

Assuming you have unit tests, integration tests, and validation tests, you have a working system, under the best conditions. How does your program respond to network issues? Lack of disk / database space? Be sure to introduce at least a few of these tests to verify your application fails gracefully.

#### Self Sabotage

If you want to seriously challenge your tests, get a team member to introduce bugs in the code. If these nefarious changes are not caught, then you need better tests.

#### Tighten the Net

Once a bug is found - it is not fixed until a test is written to catch it should it rear its ugly head again. The first time a bug is caught should be the last time it is caught by a human -- that's a job for computer.



*If you feel inclined, you can [purchase The Pragmatic Programmer](https://pragprog.com/book/tpp/the-pragmatic-programmer). I do not receive any compensation from the publisher, the authors, or any affiliate program.*