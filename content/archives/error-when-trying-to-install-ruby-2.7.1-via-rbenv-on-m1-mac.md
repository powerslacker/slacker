+++
date = 2022-09-02T06:00:00Z
featured_img = "/uploads/png-transparent-ruby-on-rails-computer-programming-programming-language-ruby-angle-rectangle-logo.png"
slug = "error-ruby-rbenv-2-7-1-mac-m1"
tags = ["ruby"]
title = "Error when trying to install Ruby 2.7.1 via rbenv on M1 mac"

+++
The IT department at my work sent my coworker a new M1 MacBook Pro to work on. He came to realize that the pre-installed Ruby default was insufficient for his needs and ran into some issues when trying to install version 2.7.1. There isn't much available on the internet so I've put together this post in the hopes that others won't have as hard a time as my coworker.

We tried a number of other potential solutions before stumbling across the one that worked on his machine. I'll link those below in case this doesn't work for you:

* [How to install older Ruby versions(2.x) on Mac M1 without using arch x86_64](https://dollardhingra.com/blog/install-ruby-old-versions-macm1/)
* [How to Install Ruby 2.7.3 on M1 Mac](https://nickymarino.com/2021/12/17/install-ruby-273-on-m1/)

My coworker finally found a working solution on a Japanese site that appears to be similar to StackOverflow:

* [M1macでrbenv 2.7.1 installしようとしたときに発生したError](https://qiita.com/kawabata324/items/78014f244a9c5a84c007)

Providentially, my team at work includes someone who is passionate about languages and just so happened to be learning the appropriate Kanji the prior evening! She graciously helped to translate the Japanese specifics into English, which is what I'll be posting here.

## Environment

* mac OS Monterey ver. 12.0.1
* rbenv 1.2.0
* Homebrew 3.3.7

## Executed Command
```bash
    rbenv install 2.7.1
```
## Error
```bash
    Downloading openssl-1.1.1l.tar.gz...
    -> https://dqw8nmjcqpjn7.cloudfront.net/0b7a3e5e59c34827fe0c3a74b7ec8baef302b98fa80088d7f9153aa16fa76bd1
    Installing openssl-1.1.1l...
    Installed openssl-1.1.1l to /Users/kawabataharuki/.rbenv/versions/2.7.1
    
    Downloading ruby-2.7.1.tar.bz2...
    -> https://cache.ruby-lang.org/pub/ruby/2.7/ruby-2.7.1.tar.bz2
    Installing ruby-2.7.1...
    ruby-build: using readline from homebrew
    
    BUILD FAILED (macOS 12.0.1 using ruby-build 20211019)
    
    Inspect or clean up the working tree at /var/folders/fk/j1ynkl3x4_nf_z0x5q_79f600000gn/T/ruby-build.20211210132726.25203.UPZtrh
    Results logged to /var/folders/fk/j1ynkl3x4_nf_z0x5q_79f600000gn/T/ruby-build.20211210132726.25203.log
    
    Last 10 log lines:
            imemo_type_ids[10] = rb_intern("imemo_parser_strterm");
                                 ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ../.././include/ruby/ruby.h:1847:56: note: expanded from macro 'rb_intern'
            __extension__ (RUBY_CONST_ID_CACHE((ID), (str))) : \
                                                           ^
    1392 warnings generated.
    linking shared-object objspace.bundle
    422 warnings generated.
    linking shared-object date_core.bundle
    make: *** [build-ext] Error 2
```
## Executed Command
```bash
    arch -arm64 rbenv install 2.7.1
```
## Error
```bash
    Downloading openssl-1.1.1l.tar.gz...
    -> https://dqw8nmjcqpjn7.cloudfront.net/0b7a3e5e59c34827fe0c3a74b7ec8baef302b98fa80088d7f9153aa16fa76bd1
    Installing openssl-1.1.1l...
    Installed openssl-1.1.1l to /Users/kawabataharuki/.rbenv/versions/2.7.1
    
    Downloading ruby-2.7.1.tar.bz2...
    -> https://cache.ruby-lang.org/pub/ruby/2.7/ruby-2.7.1.tar.bz2
    Installing ruby-2.7.1...
    ruby-build: using readline from homebrew
    
    BUILD FAILED (macOS 12.0.1 using ruby-build 20211203)
    
    Inspect or clean up the working tree at /var/folders/fk/j1ynkl3x4_nf_z0x5q_79f600000gn/T/ruby-build.20211210141535.15027.drzWUT
    Results logged to /var/folders/fk/j1ynkl3x4_nf_z0x5q_79f600000gn/T/ruby-build.20211210141535.15027.log
    
    Last 10 log lines:
                                                           ^
    compiling ../.././ext/psych/yaml/writer.c
    2 warnings generated.
    8 warnings generated.
    4 warnings generated.
    linking shared-object zlib.bundle
    linking shared-object psych.bundle
    422 warnings generated.
    linking shared-object date_core.bundle
    make: *** [build-ext] Error 2
```
## Executed Command
```bash
    RUBY_CFLAGS=-DUSE_FFI_CLOSURE_ALLOC arch -arm64 rbenv install 2.7.1
```
## Success!
```bash
    Downloading openssl-1.1.1l.tar.gz...
    -> https://dqw8nmjcqpjn7.cloudfront.net/0b7a3e5e59c34827fe0c3a74b7ec8baef302b98fa80088d7f9153aa16fa76bd1
    Installing openssl-1.1.1l...
    Installed openssl-1.1.1l to /Users/kawabataharuki/.rbenv/versions/2.7.1
    
    Downloading ruby-2.7.1.tar.bz2...
    -> https://cache.ruby-lang.org/pub/ruby/2.7/ruby-2.7.1.tar.bz2
    Installing ruby-2.7.1...
    ruby-build: using readline from homebrew
    Installed ruby-2.7.1 to /Users/kawabataharuki/.rbenv/versions/2.7.1
```
## References

* [https://github.com/ffi/ffi/issues/869](https://github.com/ffi/ffi/issues/869 "https://github.com/ffi/ffi/issues/869")
* [M1Macでrbenv install 2.7.2を実行時、エラーが発生してインストールできません](https://ja.stackoverflow.com/questions/77921/m1mac%e3%81%a7rbenv-install-2-7-2%e3%82%92%e5%ae%9f%e8%a1%8c%e6%99%82-%e3%82%a8%e3%83%a9%e3%83%bc%e3%81%8c%e7%99%ba%e7%94%9f%e3%81%97%e3%81%a6%e3%82%a4%e3%83%b3%e3%82%b9%e3%83%88%e3%83%bc%e3%83%ab%e3%81%a7%e3%81%8d%e3%81%be%e3%81%9b%e3%82%93)