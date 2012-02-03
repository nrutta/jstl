#!/bin/sh 

version="0.0.2"
jstl_file="jstl-${version}.js"
intermediate_file=".intermediate.js"

rm -f ${intermediate_file}
echo "generating single file of all components ..."
cat MANIFEST | while read i ; do
    echo "\tadd $i component ..."
    cat $i >> ${intermediate_file}
done

if [ -f ${jstl_file} ] ; then
    echo "save existing ${jstl_file}"
    mv ${jstl_file} ${jstl_file}.save
fi

echo "move intermediate file into ${jstl_file}"
mv ${intermediate_file} ${jstl_file}

rm jstl.js
ln -s ${jstl_file} jstl.js

# now build jsdoc for the js files.
#/usr/local/jsdoc/jsdoc -t templates/JSDoc-DataTables `cat MANIFEST`
/usr/local/jsdoc/jsdoc -d docs -t templates/bootstrap `cat MANIFEST`
#/usr/local/jsdoc/jsdoc `cat MANIFEST`

echo "done"
exit 0
