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

> When you go too far up, abstraction-wise, you run out of oxygen. Sometimes smart thinkers just don’t know when to stop, and they create these absurd, all-encompassing, high-level pictures of the universe that are all good and fine, but don’t actually mean anything at all.
>
> _--Joel Spolsky,_ [_Don’t Let Architecture Astronauts Scare You_](https://www.joelonsoftware.com/2001/04/21/dont-let-architecture-astronauts-scare-you/)

Many abstractions are quite useful, some...not so much. The less useful ones can be called **Abstraction Antipatterns.** By discussing the pros and cons of these patterns, interested readers will be able to spot and avoid won’t make the same kinds of mistakes. At the end of this article is a checklist that takes the principles found in these examples and turns them into an actionable test that anyone can apply to their Go code to spot these antipatterns before they take root.

## Magical Configuration

> Explicit is better than implicit.
>
> _--Tim Peters,_ [_The Zen of Python_](https://www.python.org/dev/peps/pep-0020/)

Virtually every non-trivial package uses configuration. Repeating code violates the **DRY principle** (_“Don’t Repeat Yourself_”) . Naturally, it follows that it must be a good idea to make a configuration pattern that is reusable everywhere. Here’s an example that shows high levels of abstraction and flexibility:

```go
type Config interface {
    Value(key interface{}) interface{}
}
```

If this looks familiar, don’t be surprised. It’s basically a `context.Context.`

The applications being refactored have all of their dependencies use and accept this interface. Once the `Config` is passed into a package -- each dependency is setup in its own specific way. Each dependency has predefined environment variable keys that get loaded into the `Config`via a signature of `func (foo.Config) foo.Config`.  Each package in this codebase is "setup" via this opaque configuration.  Once all the packages have been setup, any other package can call a function in one its dependencies package and voila -- it all magically works! Assuming all the environment variables have been sourced correctly.

Here's a contrived example for a bit more clarity:

```go
package bar
   
import (
	"github.com/jmoiron/sqlx"
    "github.com/some-namespace/foo" // not a real package!
    "github.com/some-namespace/appcfg" // not a real package!
)
   
var (
	db *sqlx.DB
)
   
   
func Setup(cfg foo.Config) {
   	db = appcfg.Database(cfg)
}

func Do() error {
	return db.Ping()
}
```

Now, this `Config` isn't necessarily a bad thing. Like all engineering decisions, there are tradeoffs. In the example above, any package can call a function in `bar.Do` after it has been setup without having to consider what `bar.Do` is dependent on. Below, I cover some more detailed issues with this pattern.

### Pros

* Thoroughly abstracted. No external package knows how this **Magical Configuration** works -- only that it works. A package external to `foo.Config` doesn't know what data is stored in it, or how the internals of that storage are implemented.
* Configuration is highly reusable for multiple projects -- meaning environment variable keys are de-facto standardized.

### Cons

* Finding the actual key of an environment variable is not an easy task. This interface is so abstract that it takes minutes of detective work to find where configuration actually occurs. In the example above, you can't directly answer the following questions without digging into the code for a specific project:
  * Which package initially set the database within the `Config`
  * Did any package overwrite the initial setting for the database? 
  * What key is used to access the database via the method `Config.Value`? 
* Configuration does not belong to the application -- it is shared custody between the application and its dependencies. There’s no knowing whether modifying an environment variable key will have cascading effects with other applications using the `foo` library.
* Adding new keys is painful, since the interface obfuscates how things work under the hood -- instead of just using the standard library.
* Loss of type safety. Since configuration is an `interface`, there is no check at compile-time verifying the correct type of configuration was used. Only a runtime error will reveal the issue.