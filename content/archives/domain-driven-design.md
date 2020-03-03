+++
date = 2020-03-02T07:00:00Z
draft = true
featured_img = ""
slug = "ddd-article"
tags = ["ddd", "architecture"]
title = "Building Blocks of Domain Driven Design"

+++
An introduction to the fundamental concepts of domain driven design.

### Entities

An entity is an object that is defined by its identity rather than its attributes. For example, let's say I buy a car, take it home, and replace the stock wheels with aftermarket wheels. Though the car has been modified, its identity has not, it is still fundamentally the same car.      It is important to note that just because something has a unique identifier does not make it an entity. It is the principle that a change to the object's attributes does not change its identity.

Entities are best kept lightweight. It is tempting to attach data to entities, but is important to recognize that the purpose of an entity is first and foremost to serve as an identifier. Other objects can wrap or add detail to an entity without compromising this core purpose. Coming back to the car example, a software system might want to track which upgrades were sold with a specific car. Rather than bolting the sold upgrades onto the car entity, an alternative might define an object that references the car by its ID and includes details related to the upgrades purchased with the car at time of sale.