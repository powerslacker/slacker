+++
date = 2020-02-13T01:20:00Z
featured_img = ""
slug = "strange-routing-goji-pat"
tags = ["programming", "go", "golang"]
title = "Strange Routing with Goji & Pat"

+++
The other day I was using [goji](https://pkg.go.dev/goji.io@v1.1.0?tab=doc) for a project at work. I saw very little use of the `SubMux` function, which caused common middleware to be specified on each endpoint. A bit ugly and repetitive. So, being the [pragmatic programmer](https://www.powerslacker.cc/pragmatic-programmer/) that I am, I decided to do a small refactor where common paths would be separated into individual `SubMux` and common middleware would be applied to each.

## The Problem

Here's an example of the change with middleware omitted for brevity:

**Before**

```go
// ...
func main() {
    root := goji.NewMux()
    sub := goji.SubMux()
    root.HandleFunc(pat.Get("/v1"), func(wr http.ResponseWriter, r *http.Request) {
        wr.WriteHeader(200)
        wr.Write([]byte("Hello!"))
    })
    root.HandleFunc(pat.Get("/v1/hi"), func(wr http.ResponseWriter, r *http.Request) {
        wr.WriteHeader(200)
        wr.Write([]byte("Hi!"))
    })
    // ...
}
```

**After**

```go
// ...
func main() {
    root := goji.NewMux()
    sub := goji.SubMux()
    sub.HandleFunc(pat.Get("/"), func(wr http.ResponseWriter, r *http.Request) {
        wr.WriteHeader(200)
        wr.Write([]byte("Hello!"))
    })
    sub.HandleFunc(pat.Get("/hi"), func(wr http.ResponseWriter, r *http.Request) {
        wr.WriteHeader(200)
        wr.Write([]byte("Hi!"))
    })
    root.Handle(pat.New("/v1/*"), sub)

    // ...
}
```

I quickly ran into issues. All of my endpoints used the exact same values for the paths as before — but many of the endpoints were now returning status codes of `404 Not Found`. Odd behavior, indeed...

## The Solution

The docs for [pat](https://pkg.go.dev/goji.io@v1.1.0/pat?tab=doc) state:

> Pat can also match prefixes of routes using wildcards. Prefix wildcard routes end with "/_", and match just the path segments preceding the asterisk. For instance, the pattern "/user/_" will match "/user/" and "/user/carl/photos" but not "/user" (note the lack of a trailing slash).
>
> The unmatched suffix, including the leading slash ("/"), are placed into the request context, which allows subsequent routing (e.g., a subrouter) to continue from where this pattern left off. For instance, in the "/user/*" pattern from above, a request for "/user/carl/photos" will consume the "/user" prefix, leaving the path "/carl/photos" for subsequent patterns to handle. A subrouter pattern for "/:name/photos" would match this remaining path segment, for instance.

After reading this, I sent an HTTP request to the server to test out a hypothesis. The path for the request was: `/v1//`. Hypothesis confirmed: The double usage responded with a status of `200 OK` and a response body of `Hello!`. Now we're getting somewhere! I assumed that the `/*` would be removed, but only the `*` was.

But how could I accomplish the same routing when the pattern match explicitly states that `/` would NOT be removed from the request?

Here's the final answer:

```go
// ...
func main() {
    root := goji.NewMux()
    sub := goji.SubMux()
    sub.HandleFunc(pat.Get(""), func(wr http.ResponseWriter, r *http.Request) {
        wr.WriteHeader(200)
        wr.Write([]byte("Hello!"))
    })
    sub.HandleFunc(pat.Get("/hi"), func(wr http.ResponseWriter, r *http.Request) {
        wr.WriteHeader(200)
        wr.Write([]byte("Hi!"))
    })
    root.Handle(pat.New("/v1"), sub)
    root.Handle(pat.New("/v1/*"), sub)
    
    // ...
}
```

Because `root` has two patterns to follow, it checks each pattern using a first-in first-out approach. So when a request for `/v1` or `/v1/` is matched, it goes to the first entry on line 13, which routes to `sub`. This pattern doesn't include wildcards so it matches the only possible option, the handler specified on line 5. In every other case, e.g. `/v1/hi` matches to `sub` on line 14. Any request via this pattern to `sub` will end up going to another endpoint, in this case the second handler specified on line 9.

I wrote this article primarily for myself so I can go back and reference this fix in future projects. Hopefully this helps someone else out there struggling with the strange interactions between older versions of Goji & Pat.