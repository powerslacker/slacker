+++
date = "2019-06-10T06:00:00+00:00"
draft = true
featured_img = ""
slug = "abstraction-antipatterns-go"
tags = ["design-patterns", "golang"]
title = "Design Antipatterns in Go"

+++
As software systems grow in total users, traffic, and integration partners, there is a continuous need to maintain and expand the system's ability to scale. One of the big challenges in scaling a software project is keeping the project's codebases well-maintained. Poorly factored code provides a fertile breeding ground for bugs, performance issues, decreases an engineering team's ability to deliver new features, and slows down the onboarding of new hires. 

During a recent project I worked on, my team and I spent a few weeks identifying key areas to refactor in one of our internal services. We found the same type of issue cropping up again and again — abstraction. Or rather, _over-abstraction_.

**Over-abstraction** is when code has unnecessary abstractions, the result of which is a decrease in code quality and an increase in cyclomatic complexity. 

To be clear, abstraction has merit. There are clear benefits to using abstractions in software development. **The primary job of a software engineer is to create useful abstractions**. Software exists so that the average person doesn’t need to understand how the large circuit-filled box under their desk pushes electrons around — they only need to know that it can be used to send email, manage banking accounts online, and visit their preferred social media platform.

However, even software greats have stated that too much abstraction can land engineers in hot water:

> When you go too far up, abstraction-wise, you run out of oxygen. Sometimes smart thinkers just don’t know when to stop, and they create these absurd, all-encompassing, high-level pictures of the universe that are all good and fine, but don’t actually mean anything at all.
>
> _—Joel Spolsky,_ [_Don’t Let Architecture Astronauts Scare You_](https://www.joelonsoftware.com/2001/04/21/dont-let-architecture-astronauts-scare-you/)

Many abstractions are quite useful, some...not so much. The less useful ones can be called **Abstraction Antipatterns.** By discussing the pros and cons of these patterns, hopefully, you can spot these antipatterns in your own code and avoid making the same kinds of mistakes. 

At the end of this article is a list of principles that can prevent the mistakes shown in these examples and turn them into an actionable tests that anyone can apply when reviewing Go code.

## Magical Configuration

> Explicit is better than implicit.
>
> _—Tim Peters,_ [_The Zen of Python_](https://www.python.org/dev/peps/pep-0020/)

Repeating code violates the **DRY principle** (_Don’t Repeat Yourself_). Naturally, it follows that it must be a good idea to make code that is highly reusable. 

Virtually every non-trivial package uses configuration. Since DRY is a good thing, and configuration is a necessity, it makes sense to make a reusable configuration object. Here’s an example of a very flexible Configuration pattern:

```go
type Config interface {
    Value(key interface{}) interface{}
}
```

If this looks familiar, don’t be surprised. It’s the same pattern as `context.Context.`

The application my team was refactoring has all of its dependencies use and accept this interface. Once the `Config` is passed into a package -- each dependency is setup in its own specific way. Each dependency has predefined keys that get loaded into the `Config` via a signature of `func (foo.Config) foo.Config`. Once all packages in this application have been setup, any other package can call a function in one its dependent packages and voila -- it all magically works! Assuming all the configuration has been sourced correctly.

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

In this example, its assumed that:

* The `Config` passed into `Setup` holds the necessary key-value pair to use in the call to `appcfg.Database`.
* That a developer writing code using the `bar` package realizes that the package itself must have `Setup` called prior to use (otherwise you'd get a nil pointer on the `db` variable.
* Packages that need to use the `bar` package when performing their own `Setup` could be reliant on the call to `bar.Setup` being performed first.

  Now, this `Config` isn't necessarily a bad thing. Like all engineering decisions, there are tradeoffs. In the example above, any package can call a function in `bar.Do` once it has been setup without having to consider what `bar.Do` is dependent on. 

  Here are some more detailed issues and advantages of this pattern:

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

### How to Fix It

Instead of using an interface, configuration can be loaded into a concrete type such as a `struct`. Configuration can be read from environment variables into a `struct` in one pass, as specific concrete types. This can be handled via a single package and provide centralized access from a single package. This makes configuration easy to track down,  access, and repair.

Code reusability will probably be lessened, at least initially. As time goes on, configuration can be injected into dependent packages, so code reuse could recover or even improve.

## 

The Interface Chain of Doom

> Everyone knows that debugging is twice as hard as writing a program in the first place. So if you're as clever as you can be when you write it, how will you ever debug it?
>
> _--Brian Kernighan, Elements of Programming Style_

It’s always a red-flag when two patterns are mixed together for no apparent reason. For example, the application being targeted for refactoring, combines packages with a factory pattern that return various `interface` types. After a factory creates an interface, the alarm bells really go off. The interface chain doesn’t stop -- like the Energizer bunny, it keeps going, and going. The example below illustrates this antipattern.

This is the **Interface Chain on Doom**. Here’s an example of one that’s loosely based on a package from the aforementioned application:  
![Interface Chain of Doom](/uploads/interface-chain-of-doom.svg "Interface Chain of Doom")

While each implementation of this pattern is slightly different, the problem is apparent in all of them: it is virtually impossible to tell what is actually happening under the hood.

There is no way to know what actually occurs in this application through visual inspection of the code. The majority of interfaces return interfaces via their methods. To top it all off -- any component may be dependent on the configuration `interface` that is sourced via the environment. There are potentially unlimited paths through any one chain of functionality that starts from one of these factories.

However, in this application, **the design above is used to handle two cases**: a mock, and a ‘real-world’ implementation. Files upon files of boilerplate and indirection -- just to swap between the real deal implementation and a test suite.

### Pros

* Test coverage goes through the roof, it's simple to write passing tests for all of the mock code.
* Very easy to swap in new implementations of virtually anything. Since everything is an interface, anything can be swapped out with a minor code change.

### Cons

* Determining where anything actually occurs is a nightmare. Every attempt at debugging results in digging through large swaths of the codebase while trying to keep mental context of the many moving parts.
* Breaks tooling. Modern editors make heavy use of code hints which make Software Engineers more productive. Since virtually everything in this codebase is an interface -- it’s on the individual debugging the code to track down the actual implementation.
* This code is not human friendly. It’s important to recognize that engineers are human too. Humans get hungover, sick, sad, hungry, and wake up on the wrong side of the bed. Trying to debug or extend this code in any of those states is going to be a no-good, very bad day.

### How to Fix It

Follow this popular Go practice:

> Accept interfaces return structs.
>
> _—Jack Lindamood,_ [_Preemptive Interface Anti-Pattern in Go_](https://medium.com/@cep21/preemptive-interface-anti-pattern-in-go-54c18ac0668a)

**_NOTE_**_: Though the quote above claims interfaces should return structs, any concrete type serves the same purpose._

Even though `io.Reader` is accepted by many functions in the standard library -- there aren’t any that return an `io.Reader`, at least not directly. This prevents passing some formless contract from function to function. Instead, concrete implementations of such as `bytes.Buffer` can be used as an `io.Reader.`

Additionally, architecture should be as complex as it needs to be -- but no more. If there are only two implementations, an `if statement` works just as well as a factory. If booleans aren’t in fashion, accept an `interface`, or a function signature, just be sure to pass around explicit implementations instead of abstract types.

## 

The Vogon Registry

> Wherever there is modularity there is the potential for misunderstanding: Hiding information implies a need to check communication.
>
> _--Alan J. Perlis, Epigrams on Programming_

> _...You wanted a banana but what you got was a gorilla holding the banana and the entire jungle..._
>
> _-- Joe Armstrong, Coders At Work_

For those who never read, or don’t remember _The Hitchhiker's Guide to the Galaxy_, Vogons are described as:

> _...one of the most unpleasant races in the galaxy—not actually evil, but bad-tempered, bureaucratic, officious and callous...authors of the third worst poetry in the universe..._

The **Vogon Registry** is a pattern that loads several objects, interfaces, or processes into a centralized structure so that they can be fetched using a key, such as a string. There is a data structure in Go that can easily replace it -- the `map`. The cleverness of the **Vogon Registry** is that it hides a map, an array, or both, under several layers of abstraction and bureaucracy.

Here’s an example based loosely on an actual implementation:

```go
// Package vogon is used to manage access to poems. Since this

// library doesn't actually use poems, its irrelevant what poems actually

// represent. The only thing that does matter is that this library

// obfuscates and limits access to poems.

package vogon

import "fmt"

// Poem is the base struct for Vogon poetry.

type Poem struct {

    words string

}

// SetWords overwrites the poem's content.

func (p *Poem) SetWords(new string) {

    p.words = new

}

// Context holds poem transactions due for processing.

type Context struct {

    manager Manager

    poems   map\[string\]*Poem

}

// NewContext returns a new database transaction context.

func NewContext(m Manager) *Context {

    return &Context{

        manager: m,

        poems:   map\[string\]*Poem{},

    }

}

// Factory interface for Poem factories.

type Factory interface {

    // Poems returns the list of Poem implementations the factory can generate.

    Poems() \[\]string

    // NewPoem returns an interface which could be cast into a specific Poem

    // type by the caller.

    NewPoem(ctx *Context, name string) (interface{}, error)

}

// FactoryFunc function to generate Poem implementations.

type FactoryFunc func(ctx *Context, source string) (interface{}, error)

// Manager interface for Poem managers.

type Manager interface {

    // Create returns a new data access object.

    CreatePoem(ctx *Context, name string) (interface{}, error)

    // RegisterFactory registers the given factory with the Poem names it can

    // generate.

    RegisterFactory(f Factory)

}

// DefaultManager is an implementation of the Manager interface.

type DefaultManager struct {

    Factories map\[string\]Factory

}

// CreatePoem returns a new poem object.

func (m *DefaultManager) CreatePoem(ctx *Context, name string) (interface{}, error) {

    factory, ok := m.Factories\[name\]

    if !ok {

        return nil, fmt.Errorf("no poem factory found for: %s", name)

    }

    return factory.NewPoem(ctx, name)

}

// RegisterFactory registers the given factory with the Poem names it can

// generate.

func (m *DefaultManager) RegisterFactory(f Factory) {

    for _, name := range f.Poems() {

        m.Factories\[name\] = f

    }

}

// NewDefaultManager returns an initialized default Manager implementation.

func NewDefaultManager() *DefaultManager {

    return &DefaultManager{

        Factories: make(map\[string\]Factory),

    }

}

// TransactionFunc definition of a function wrapped in a transaction context.

type TransactionFunc func(ctx *Context) error

// Process wraps given TransactionFunc and provides context based on manager.

func Process(m Manager, f TransactionFunc) (err error) {

    // normally this would do something useful by wrapping the given

    // function in some other operation such as writing to a disk or database

    // but since this is example code there's no need

    ctx := NewContext(m)

    return f(ctx)

}
```

In order to make use of the `vogon` package, the client must:

* Provide an implementation that meets the Factory type
* Provide an implementation that meets the FactoryFunc type for each Poem they wish to access. Note that the FactoryFunc type doesn’t actually return a Poem, but instead an interface{} which is allegedly a Poem.
* Tie the Factory implementation to all the various FactoryFunc implementations so that it can be registered via the Manager type
* Provide an implementation that meets the Manager interface, use the DefaultManager, or wrap the DefaultManager
* Register the Factory implementation via the RegisterFactory method on a Manager.
* Provide one or more TransactionFunc that actually do some task related to a Poem
* Tie all the above together whenever access to a Poem is needed

The `vogon` package successfully hides the implementation of one of the most basic data structures. Going through a codebase that uses `vogon` would require stepping through a spiderweb of interfaces, factories, and runtime configured maps.

#### But this isn’t real!

No, `vogon` isn’t real -- but it’s based on real code being refactored. Jon Bodner used a very similar pattern in his satirical Go web framework [Fall](https://github.com/evil-go/fall/blob/master/fall.go), so this isn’t even the first instance of this pattern recorded in the wild.

### Pros

* Powerful abstraction. If there was a database operating under the hood virtually none of that implementation would leak.
* Highly modular. Whatever a **Vogon Registry** actually does can be swapped out with ease.
* Excellent for code reuse. Every dependency is dynamically tucked into place at runtime. Whatever it is used for, it does a great job of limiting access to resources, which makes client code consistent with the DRY principle.

### Cons

* Breaks compile time tooling. Since virtually every part of a **Vogon Registry** is dynamic, there is almost no way to verify that it is being used properly by the compiler.
* Rigid structure. Adding anything new requires going through a great deal of code bureaucracy. There are many interfaces and types that need implementations, registrations, and proper licensing before anything can happen. If an engineer forgets to implement any one of these details the application slaps them with a runtime error.
* Obfuscates important details. The kind of things that engineers want to limit access to are typically critical elements of a production application, such as: a database, an AWS S3 bucket, a hard disk. However, in the quest to protect a critical asset, this is the “nuclear option”. Whatever happens inside this package is going to require complex mental modeling, graph paper, and a lot of patience to track down.

### How to Fix It

If there is truly need for dynamic access to all kinds of functions, `map[string]func() error` would be preferable.

Instead, each business object can expose an interface implementation dedicated to a specific type of access. These differing implementations can be passed around via their interface, allowing for dependencies to be managed when an object is instantiated. See the example below:

```go  
type (
	// This interface doesn't need to be specified in the same package.
    // Client code can define its own interface based on the
    // functions they require.
    UserService interface {

        Get(id string) (User, error)

        // ...some more methods

    }

    UserModel struct {

   		db *sql.DB

    }

    

    UserMock struct {

        db map\[string\]User

    }

)

var (

    UserNotFound = errors.New("user_not_found")

)

func (m UserModel) Get(id string) (u User, err error) {

    query := \`SELECT first_name, last_name, email FROM users WHERE id = ? LIMIT 1\`

    err := m.db.QueryRow(query, id).Scan(&u.FirstName, &u.LastName, &u.Email)

    if err == sql.ErrNoRows {

        err = UserNotFound

    }

    return 

}

func (m UserMock) Get(id string) (u User, err error) {

    u, ok := m.db\[id\]

    if ok {

        return

    }

    err = UserNotFound

}
```

The nice part of an approach like this is that there should always be a trail of breadcrumbs to follow. Wherever a function needing a `UserService` from the code above is called, the exact implementation used can be found with ease. This means debugging is easier than using a dynamic approach. Very human-friendly.

Tearing out SQL queries and replacing them with MongoDB queries will be significantly more tedious using this approach. Realistically, that’s a rare requirement. Time saved NOT dealing with a dynamic web of interfaces and factories should pay the time cost of a database replacement several times over.

## Conclusion: How to Prevent Abstraction Antipatterns

The **How to Fix It** sections above are remarkably similar, so this seems like an opportunity to extract a simple system to prevent abstraction antipatterns from cropping up in Go code. The main reason for putting a system in place is to prevent technical debt from crippling applications.

The following questions are `true/false` and can be used as a checklist and can act as a guide for code review:

* Does the code return only concrete types?
* Is the ratio of concrete types to abstract types at least 1:1?
* Could a mid-level engineer debug or extend this code even with a migraine?
* Are all abstractions well-documented and clear in their purpose and usage?
* Do abstractions effectively defend the application from runtime errors?

### Scoring

The most dangerous part of a highly abstract system is that a lot of knowledge about the system is implied -- meaning contained in an engineer's head. A high score means that losing key engineers could lead to major delays when fixes or changes are needed. To score, tally each question answered `false` above, then consult the following score ranges.

* **4-5:** Black box. Losing a key engineer could turn this into legacy code. Documentation and refactoring should be prioritized over non-critical features / bugs.
* **2-3:** Dangerous. Losing the program author(s) could cause major problems. Create a long-term refactoring roadmap for over-abstraction hot spots and make progress during normal sprint work.
* **<2:** Generally safe. Document any issues with abstractions and continue with normal development.