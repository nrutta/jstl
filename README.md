Javascript Template Library
===========================

This is an attempt to create a reasonable set of datastructures and algorithms in javascript, for use within
a web browser, and on the server side (e.g. node.js). Its loosely based upon the java template libraries. 

There are a few goals of this project:

* I've always wondered why other datastructures than just Array didn't exist within javascript. Its become more apparant to me since I've started using node.js that this may be useful.
* I wanted to experiment with github and get a repository going
* I want to experiment with various means of packaging javascript for the client and server (e.g. requireJS, commonJS) and this seems a reasonable way to do it.
* I wanted to revisit my basic datastructures and algorithms ability, so why not build some into a cohesive library?

Versioning
----------

I'm going to follow the versioning approach described by the Semantic Versioning guidelines as much as possible.

Releases will be numbered as follows:

'<major>.<minor>.<patch>'

* major - breaking backwards compatibility will increase the major value.
* minor - adding new features without breaking backwards compatibility will increase the minor value.
* patch - making bug fixes and various changes will increase the patch value.

Authors
-------

** Neal Rutta **

+ http://github.com/nrutta
+ neal@rutta.com


Copyright and license
---------------------

NEEDSWORK


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

