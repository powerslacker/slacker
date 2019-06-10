+++
date = "2019-06-10T06:00:00+00:00"
draft = true
featured_img = "/uploads/gopher-fragile.png"
slug = "golang-dependency-patterns"
tags = ["design_patterns", "golang"]
title = "Dependency Patterns in Go"

+++
As a working software engineer, one of the most common tasks I have to perform is tying N pieces of software together into one tidy bundle. This is a difficult problem to solve well. Although the concept is simple, reality rarely matches the expectation. Dependencies (one piece of code being reliant on a separate piece of code) and clean code are often opposing forces.

Here's an example from a [reddit post asking for advice on how to access dependencies when using the Gin framework](https://www.reddit.com/r/golang/comments/bxmy08/structuring_gin_api/?utm_source=share&utm_medium=web2x "Structuring Gin API Dependencies").