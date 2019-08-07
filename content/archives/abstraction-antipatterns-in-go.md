+++
date = "2019-06-10T06:00:00+00:00"
draft = true
featured_img = ""
slug = "abstraction-antipatterns-go"
tags = ["design-patterns", "golang"]
title = "Abstraction Antipatterns in Go"

+++
# Abstraction Antipatterns in Go

As software systems grow in total users, traffic, and integration partners, there is a continuous need to maintain and expand the system’s ability to scale. One of the most difficult challenges in scaling a software project is keeping well-maintained code. Poorly factored code increases bugs and performance issues, decreases the ability to deliver new features, and slows down onboarding of new hires.

During a recent project I worked on, my team and I spent a few weeks identifying key areas to refactor in one of our internal services. We found the same type of issue cropping up again and again — abstraction. Or rather, _over-abstraction_.

**Over-abstraction** is when code contains unnecessary abstractions, the result of which is a decrease in code quality, greater [cyclomatic complexity](https://en.wikipedia.org/wiki/Cyclomatic_complexity), and a codebase bloated with adapters (aka [glue](https://en.wikipedia.org/wiki/Glue_code)) to connect components.

To be clear, abstraction has great merit. **The primary job of a software engineer is to create useful abstractions**. Software exists so that the average person doesn’t need to understand how the circuit-filled box under their desk pushes electrons around — they only need to know that it can be used to send emails, manage their banking accounts, and visit their preferred social media platform.

Many abstractions are quite useful, some…not so much. I call the worst offenders **Abstraction Antipatterns.**

It’s important to remember that professional software engineers rarely choose a specific pattern completely by accident. Even antipatterns are likely to provide some benefit. I try to give the antipatterns mentioned a fair cost-benefit analysis.

At the end of this article I've provided a list of checks that can help prevent mistakes similar to the examples shown.

## Opaque Configuration

Duplicated code violates the **DRY principle** (_Don’t Repeat Yourself_). Naturally, it follows that it must be a good idea to write code that is highly reusable. Virtually every non-trivial Go program uses some form of configuration. Since the DRY principle is a good thing, and configuration is a necessity, it makes sense to make a reusable configuration object.

Here’s an example of a very flexible configuration pattern, based on the project my team was refactoring:

```go
type Config interface {
    Value(key interface{}) interface{}
}
```

If this looks familiar, don’t be surprised. It’s the same pattern as `context.Context.`

The application my team was refactoring has all of its dependencies use and accept this `interface`. The `Config` is passed into a package via a function typically called `Setup` , which is used to either pass dependencies into the package or load new values into the `Config`. Each dependency has predefined keys that get loaded into the `Config` via a signature of `func (Config) Config`. For example:

```go
func WithDatabase(c Config) Config {
	// database loaded into new config...
}
```

Once all packages in this application have been setup, any other package can call a function in one its dependent packages and voila — it all works, without having to pass along any dependencies as function parameters!

Here’s a contrived example for a bit more clarity:

```go
package bar

import (
   // ...
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

In this example, it’s assumed that:

* The `Config` passed into `Setup` holds the necessary key-value pair to use in the call to `appcfg.Database`.
* That a developer writing code using the `bar` package realizes that the package itself must have `Setup` called prior to use, otherwise `db` will be a nil pointer causing runtime panics.
* Packages that use the `bar` package when performing their own `Setup` could be reliant on the call to `bar.Setup` being performed first.

Now, this `Config` isn’t necessarily a bad thing. Like all engineering decisions, there are tradeoffs. In the example above, any package can call a function in `bar.Do` once it has been setup without having to consider what `bar.Do` is dependent on.

Here are some more detailed issues and advantages of this pattern:

### Pros

* Thoroughly abstracted. A package external to `foo.Config` doesn’t know what data is stored in it, or how the internals of that storage are implemented.
* Configuration is highly reusable between multiple projects — meaning configuration variable keys (such as environment variables) can be de-facto standardized.
* Memory usage can be more efficient, since dependencies could be loaded as pointers and shared between various packages. Compared with creating and sharing instances of a struct, common sense dictates the memory usage should be lower using a single pointer per dependency.

### Cons

* Configuration is order dependent, and the order can’t be figured out by looking at individual packages since the purpose of the `Config` is dynamic. This could lead to developers attempting to use unconfigured packages.
* Using this pattern, finding the actual key of an environment variable is not an easy task. This `interface` is so abstract that it takes minutes of detective work to find where and how a configuration value is set. In the example above, you can’t directly answer the following questions without digging into the code for a specific project:
  * Which package initially set the database within the `Config`?
  * Did any package overwrite the initial setting for the database?
  * What key is used to access the database via the method `Config.Value`?
* Configuration does not belong to the application — it is shared custody between the application and its dependencies. There’s no knowing whether modifying a key will have cascading effects within other packages using the `Config`.
* Adding new keys is painful, since the `interface` obfuscates how things work under the hood.
* Loss of type safety. Since configuration is an `interface`, there is no check at compile-time verifying the expected type of configuration was used. Only a runtime error will reveal the issue.

### How to Fix It

Instead of using an `interface`, configuration can be loaded into a concrete type such as a `struct`. Configuration can be read from environment variables, command-line arguments, or a file into a `struct` in one pass, as specific concrete types. This can be handled via a single package and provide centralized access from a single package. This makes configuration easy to track down, access, and repair. Additionally, since the configuration is explicit, there is a clear way to determine the order to configure packages in.

Code reusability will probably be reduced, at least initially. As time goes on, configuration can be injected into dependent packages, so code reuse could recover or even improve.

## Chaining Interfaces

It’s always a red-flag when two patterns are mixed together for no apparent reason. For example, the application being refactored made use of a factory pattern that returns various `interface` types. After a factory creates an `interface`, the alarm bells start to go off. The `interface` chain doesn’t stop — like the Energizer bunny, it keeps going, and going, and going.

I like to call this one `interface` chaining. This is a bit difficult to understand using only prose, so here’s a diagram and code example loosely based on a package from the aforementioned application. Note how each `interface` has methods that return an `interface` rather than a concrete type:

![](/uploads/interface-chain-of-doom.svg)

```go
type FooParser interface {
   // ...
}

type FooClient interface {
   // ...
}

type Foo interface {
    Parser() FooParser
    Client() FooClient
}

type FooFactory interface {
    NewFoo() Foo
}

func NewFooFactory() FooFactory {
    // ...
}
```

This makes it incredibly difficult to know what actually occurs in this application through visual inspection of the code. The majority of interfaces return an `interface` via their methods. There are potentially unlimited paths through any one chain of functionality that starts from one of these factories.

However, in the application being refactored, **the interfaces are used to handle two cases**: a mock, and a ‘real-world’ implementation. Files upon files of boilerplate, glue code, and indirection — just to swap between a real implementation and mock used in test suites.

### Pros

* If mocks are included in your compilable packages, test coverage goes through the roof. It’s simple to write passing tests for mock code. If your employer has some extreme requirements around test coverage this can be an easy way to inflate your coverage metrics.
* Very easy to swap in new implementations of virtually anything. Since almost everything is an `interface`, any component can be swapped out with a minor code change.

### Cons

* Breaks tooling. Modern editors make heavy use of code hinting which make Software Engineers more productive. Since virtually everything in this codebase is an `interface`, code hinting can only reveal the `interface` definition — not the implementation. The responsibility is on the individual debugging the code to track down the actual implementation. You can use tools like [guru](https://github.com/golang/tools/tree/master/cmd/guru) to aid in finding implementations, but this is significantly more time-consuming than reading through a concrete type definition. Debugging attempts result in digging through large swaths of the codebase while trying to keep mental context of the many moving parts.
* This code is not human friendly. It’s important to recognize that engineers are human too. Humans experience sickness, depression, hunger, and sleep deprivation. Trying to debug or extend this code in any of those states is going to be a no-good, very bad day.

### How to Fix It

Follow the popular Go practice:

> Accept interfaces return structs.
>
> _—Jack Lindamood,_ [_Preemptive Interface Anti-Pattern in Go_](https://medium.com/@cep21/preemptive-\`interface\`-anti-pattern-in-go-54c18ac0668a)

**NOTE: Though the quote above claims your functions should return structs, any concrete type can serve the same purpose.**

Even though `io.Reader` is accepted by many functions in the standard library — there isn’t any function that returns an `io.Reader`, at least not directly. This prevents passing a formless contract between functions. Instead, concrete implementations of such as `bytes.Buffer` can be used as an `io.Reader.`

Additionally, an application’s architecture should be as complex as it needs to be — but no more. If there are only two implementations, standard control flow such as an `if` statement works just as well as an `interface`. If booleans are seen as primitive at your workplace, accept an `interface`, or a function signature, but return a concrete type.

Just be sure to pass around explicit implementations instead of abstract types.

## Big Centralized Interfaces & Implementations

The vast majority of `interface` usage I’ve seen in the wild is used to make code easier to test. By accepting an `interface`, as opposed to a concrete type a function or methods dependencies can be easily mocked. Building an `interface`, an implementation of that `interface`, and a mock implementation can become tedious when done for multiple types.

It is typical to find big centralized interfaces in Go applications that hold many methods, like so:

```go
package logic

type User struct {
    // ...
}

type UserService interface {
    GetAll() []User
    Delete(int) error
    // many more methods ...
}

package handlers

import (
    // ...
)

type Public struct {
    usersvc logic.UserService
}

type Admin struct {
    usersvc logic.UserService
}

func (h Public) Index(w http.ResponseWriter, r *http.Request) {
    users := h.usersvc.GetAll()
    // ...
}

func (h Admin) DeleteUser(w http.ResponseWriter, r *http.Request) {
    err = h.usersvc.Delete(data.ID)
    // ...
}

// more handlers ...
```

In the application being refactored by my team we found that each internal component package exposed an `interface` with several methods. Additionally, each of these packages had a dedicated mock and production implementation. Since the number of methods of each `interface` was high, the size of the mock definitions was typically several hundred lines.

### Pros

* Mock code only needs to be created when a new method is added.
* Cognitive load on the individual contributor is lower, a handful of big interfaces are easier to keep in mental memory than many small interfaces.
* Code is easier to keep consistent and organized with centralized `interface` definitions. Each package has one `interface`, one mock for tests, and at least one implementation used at runtime.

### Cons

* Coupling between `interface` definition and implementation is very tight. An update to the definition requires an update to all implementations. An example of this problem is show below.
* As an `interface` gets larger, new implementations become more tedious to write. This often results in new code being “bolted onto” existing implementations and changing the `interface` definition.
* Poor encapsulation. Packages that do not need every method of an `interface` are automatically aware of and able to use methods that may not be intended for their use.

Here's a simple example of a change to an interface breaking code. This example is relatively small, but in produiction code the amount of breakkage will often be much higher:

```go
package logic

type User struct {
    // ...
}

type UserService interface {
    GetAll() []User
    Delete(int) error
    Merge(int, int) (int, error)
    // many more methods ...
}

package users

// IMPLEMENTATION BROKEN: must be updated with the new Merge method
type UserServiceImpl struct {
    // ...
}

func (s UserServiceImpl) GetAll() []User {
    // ...
}

func (s UserServiceImpl) Delete(int) error {
    // ...
}

// IMPLEMENTATION BROKEN: must be updated with the new Merge method
type UserServiceMock struct {
    // ...
}

func (s UserServiceImpl) GetAll() []User {
    // ...
}

func (s UserServiceImpl) Delete(int) error {
    // ...
}

// more handlers ...
```

### How to Fix It

A publicly exposed `interface` should be considered a shared, and as such should be as lightweight and generic as possible. For good examples in the standard library check out io.Reader, io.Writer, and runtime.Error.

There are times when using a large `interface` is appropriate, and can result in a clearer abstraction than many small interaces.
In this case, Go offers the ability to compose small interfaces into a new definition. Typically, in this case the comprehensive definition is needed in certain locations. This means that we can easily provide access to both a comprehensive definition or very specific definitions, depending on the needs of varied clients.

Here's an example of interface composition:

```go
type UserGetter interface {
    GetAll() []User
}

type UserDeleter interface {
    Delete(int) error
}

// additional small interface definitions ...

type UserService interface {
    UserGetter
    UserDeleter
    // additional interfaces ...
}
```

Typically, an `interface` should be declared within the package where it is used. This means each package can declare the functionality it cares about, and decouples the `interface` from implementation.

This example demonstrates a refactor of the previous example, with each `interface` declared closer to its usage:

```go
package handlers

import (
 // ...
)

type UserGetter interface {
    GetAll() []User
}

type UserDeleter interface {
    Delete(int) error
}

type Public struct {
    userGetter UserGetter
}

type Admin struct {
    userDeleter UserDeleter
}

func (h Public) Index(w http.ResponseWriter, r *http.Request) {
    users := h.userGetter.GetAll()
    // ...
}

func (h Admin) DeleteUser(w http.ResponseWriter, r *http.Request) {
    // ...
    err := h.userDeleter.Delete(userID)
    // ...
}
```

As a sidebar, when slicing this small, an `interface` may not even be prudent — you could easily use function signatures instead. At its core an interface is a collection of function signatures. Function signatures can be composed into collections with the same ease as interfaces. Here's an example of the same refactor using function signatures:

```go
package handlers

import (
 // ...
)

// these function definitions are not neccessary, anonymous signatures work
// just as well — this style can be more convenient for developers
type GetUsers func() []User

type DeleteUser func(id int) error

type Public struct {
    getUsers func() []User
}

type UserService struct {
    get GetUsers
    delete DeleteUser
}

type Admin struct {
    deleteUser func(int) error
}

type Root struct {
    userService UserService
}

func (h Public) Index(w http.ResponseWriter, r *http.Request) {
        users := h.getUsers()
        // ...
}

func (h Admin) DeleteUser(w http.ResponseWriter, r *http.Request) {
    // ...
    err := h.deleteUser(userID)
    // ...
}

func (h Root) DeleteAll(w http.ResponseWriter, r *http.Request) {
    users := h.userService.get()
    for _, user := range users {
        err := h.userService.delete(user.ID)
    }
    // ...
}
```

While the end result is many small interfaces (or function signatures) dispersed throughout the codebase, tests and mocks are easier to produce. Mocks can individually support the needs of the tests where they are used, as opposed to sharing common functionality. While it is more difficult to keep these smaller, bespoke `interface`s organized — it is much easier to refactor individual components, since functionality is no longer coupled to a shared contract.

## Conclusion: How to Prevent Abstraction Antipatterns

The **How to Fix It** sections above are remarkably similar, so this seems like an opportunity to extract a few lessons to help prevent abstraction antipatterns from cropping up in Go code. The main reason for putting a system in place is to prevent technical debt from crippling applications.

The following questions can help identify if your application code suffers from over-abstraction. If you can answer yes to three or more questions, your code is in pretty good shape. Anything less than that, and you may want to plan a refactor of your own.

* Do functions and methods return only concrete types?
* Is the ratio of public concrete types to public abstract types at least 2:1?
* Do the majority of `interface`s expose only necessary functionality for the packages where they are used?
* Are all abstractions well-documented and clear in their purpose and usage?
* Do abstractions effectively defend the application from runtime errors and panics?