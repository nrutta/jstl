MANIFEST = js/base.js \
           js/base_collections.js \
           js/base_comparable.js \
           js/binaryTree.js \
           js/exception.js \
           js/list.js \
           js/queue.js \
           js/stack.js

VERSION="0.0.2"
JSDOC ?= `which jsdoc`
INTERMEDIATE_FILE = ".intermediate.js"

#
# documentation. this uses jsdoc3 and a template that uses bootstrap
#

docs: jstl
	/usr/local/jsdoc/jsdoc -d docs -t templates/bootstrap ${MANIFEST}


#
# build jstl.
#

jstl:
	rm -f jstl.js
	cat ${MANIFEST} >> jstl-${VERSION}.js
	cat jstl-${VERSION}.js | jsmin > jstl-min-${VERSION}.js
	ln -s jstl-min-${VERSION}.js jstl.js



.PHONY: jstl docs



