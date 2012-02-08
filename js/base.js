/**
 * The jstl library contains datastructures and algorithms that mimic whats available within Java
 * and C++ (for the most part). The intent is to provide something other than just arrays and dictionaries,
 * and to coalesce routines that seem to get rewritten over and over again
 *
 * @fileOverview <p>This provides basic namespace (jstl) for datastructures and algorithms in jstl, along
 * with support for deliverying this library as an encapsulated module (via requireJS, commonJS, etc). The
 * following sub-namespaces will exist within jstl:
 * <ul>
 *   <li>Collections - datastructures to support organizing data (e.g. hashes, lists, stacks)</li>
 *   <li>Algorithms - basic algorithms, such as mergesort.</li>
 * </ul>
 * @author <a href="mailto:neal@rutta.com">Neal Rutta</a>
 * @version 0.0.1
 * @namespace jstl
 */

var jstl = { util : {}, algorithms: {} };

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousJstl = root.jstl;

  // Export the jstl object for **CommonJS**, with backwards-compatibility
  // for the old `require()` API. If we're not in CommonJS, add `_` to the
  // global object.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = _jstl;
    jstl.jstl = _jstl;
  } else {
    // Exported as a string, for Closure Compiler "advanced" mode.
    root['jstl'] = _jstl;
  }

  // Current version.
  jstl.VERSION = '0.0.1';

})();

