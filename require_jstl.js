/**
 * require function for handling callback once requireJS has loaded all dependent modules.
 * The callback function simply generates the jstl dictionary with all the components linked 
 * in at the appropriate property values.
 */
require([ "requirejs/base",
          "requirejs/base_collections",
          "requirejs/base_comparable",
          "requirejs/binaryTree",
          "requirejs/exception",
          "requirejs/iterator",
          "requirejs/list",
          "requirejs/queue",
          "requirejs/stack" ],
    function(base, base_collections, base_comparable, binaryTree, exception, iterator, list, queue, stack) {

        jstl = { Exception: exception,
                 util: {
                    Collections: base_collections,
                    Comparator: base_comparable,
                    BinaryTree: binaryTree,
                    Iterator: iterator,   
                    LinkedList: list,
                    Queue: queue,
                    Stack: stack
                 },
                 algorithms: {}
               };
    }
);
