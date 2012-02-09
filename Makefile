MANIFEST = js/base.js \
           js/base_collections.js \
           js/base_comparable.js \
           js/iterator.js \
           js/binaryTree.js \
           js/exception.js \
           js/list.js \
           js/queue.js \
           js/stack.js

VERSION=0.1.1
JSDOC ?= `which jsdoc`
INTERMEDIATE_FILE = .intermediate.js

#
# documentation. this uses jsdoc3 and a template that uses bootstrap
#

docs: jstl
	/usr/local/jsdoc/jsdoc -d docs -t templates/bootstrap ${MANIFEST}


#
# build jstl.
#

jstl:
	rm -f jstl.js jstl-min.js jstl-${VERSION}.js
	cat ${MANIFEST} >> jstl-${VERSION}.js
	cat jstl-${VERSION}.js | jsmin > jstl-min-${VERSION}.js
	ln -s jstl-min-${VERSION}.js jstl-min.js
	ln -s jstl-${VERSION}.js jstl.js
	rm -rf ./requirejs
	mkdir ./requirejs
	python ./require.py ${MANIFEST}

commonjs: jstl
	cp jstl.js commonjs/jstl/index.js
	rm -f commonjs/jstl.tar.gz
	cd commonjs; tar czf ./jstl.tar.gz ./jstl


.PHONY: jstl docs




