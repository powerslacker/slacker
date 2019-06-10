+++
date = "2019-06-10T06:00:00+00:00"
draft = true
featured_img = ""
slug = "abstraction-antipatterns-go"
tags = ["design-patterns", "golang"]
title = "Abstraction Antipatterns in Go"

+++
As software systems grow in total users, traffic, and integration partners, there is a continuous need to maintain and expand the system's ability to scale. A big part of scaling is keeping well-maintained code. Poorly factored code provides a fertile breeding ground for bugs, performance issues, decreases an engineering team's ability to deliver new features, and slows down the on-boarding of new hires. During a recent project I worked on, my team and I spent the a few weeks identifying key areas to refactor in one of our key internal services. We found the same type of issue cropping up again and again -- abstraction. Or rather, _over-abstraction_.

**Over-abstraction** is when code has unnecessary abstractions that result in a decrease of code quality and an increase in complexity. To be clear, abstraction has merit. There are clear benefits and in general it’s a good idea. The primary job of a Software Engineer is to create useful abstractions. Software exists so that people don’t need to understand how the box under their desk pushes electrons around. They just need to know that it can be used to send email, do online banking, and visit Facebook.

However, even software greats have stated that too much abstraction can land engineers in hot water:

> _When you go too far up, abstraction-wise, you run out of oxygen. Sometimes smart thinkers just don’t know when to stop, and they create these absurd, all-encompassing, high-level pictures of the universe that are all good and fine, but don’t actually mean anything at all._

_Joel Spolsky,_ [_Don’t Let Architecture Astronauts Scare You_](https://www.joelonsoftware.com/2001/04/21/dont-let-architecture-astronauts-scare-you/)

Many abstractions are quite useful, some...not so much. The less useful ones can be called **Abstraction Antipatterns.** By discussing the pros and cons of these patterns, interested readers will be able to spot and avoid won’t make the same kinds of mistakes. At the end of this article is a checklist that takes the principles found in these examples and turns them into an actionable test that anyone can apply to their Go code to spot these antipatterns before they take root.