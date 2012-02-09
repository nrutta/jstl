Javascript Template Library
===========================

This is an attempt to create a reasonable set of datastructures and algorithms in javascript, for use within
a web browser, and on the server side (e.g. node.js). Its loosely based upon the java template libraries. 

There are a few goals of this project:

* To experiment with github and get a repository going
* To experiment with various means of packaging javascript for the client and server (e.g. requireJS, commonJS) and this seems a reasonable way to do it.
* I've always wondered why other datastructures than just Array didn't exist within javascript. Since I've started using node.js I've thought this may become more useful [especially on the server side].

Versioning
----------

I'm going to follow the versioning approach described by the Semantic Versioning guidelines as much as possible.

Releases will be numbered as follows:

`<major>.<minor>.<patch>`

* major - breaking backwards compatibility will increase the major value.
* minor - adding new features without breaking backwards compatibility will increase the minor value.
* patch - making bug fixes and various changes will increase the patch value.


Packaging
---------

As mentioned, one of the goals is to produce a version of this library that can be used in multiple formats:

* As a simple, combined and minified javascript file that can be loaded into a browser in the normal fashion
* As a set of modules that gets loaded with RequireJS
* As an exported set of modules that uses the CommonJS format (to load on the server)

Right now items one and two exist. By default the Makefile will combine all separate js files into a single file. This also gets minified using
JSMin. Subsequent to this operation, there is a python script written that will repackage the files into a separate "requirejs" subdirectory. Some
simple substitution is also performed to repackage the files such that they follow the conventions identified by RequireJS.

The next step is to support CommonJS.

So far, it seems fairly straightforward and not-too-complicated to provide this packaging step to support multiple formats. Once I get some
more experience with CommonJS my hope is to also support that too with minimal changes to the original source.

Authors
-------

** Neal Rutta **

+ http://github.com/nrutta
+ neal@rutta.com


Copyright and license
---------------------

NEEDSWORK


Dependencies
------------
* python
* JSDoc 3
* make
* JSMin
* vi (ok, this isn't a dependency, but wouldn't it be awesome if it was ??? :-)        ).

ToDo
----

Oh, lots of things. This initial version provides the basic structure to continue

* add more datastructures, such as hashmap, more types of trees, trie
* add some more algorithms for sorting. Collections.sort provides basic mergeSort; would be nice to add others
* improved tests
* packaging: requireJS and commonJS to it can be used on server and client side in a reasonable way.
* JSmin to compact the usable code
* continue to run JSLint on source files
* improved build (e.g. Makefile)

