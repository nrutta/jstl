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

  // Export the jstl object for **CommonJS**, with backwards-compatibility
  // for the old `require()` API. If we're not in CommonJS, add `_` to the
  // global object.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = jstl;
  } else {
    //root['jstl'] = _jstl;
  }

  // Current version.
  jstl.VERSION = '0.0.1';

})();


/**
 * Define a standard exception class for use by everything in jstl. Something basic that
 * just contains a name and description property.
 *
 * @fileOverview <p>This contains class definitions for providing general purpose exception 
 * handling for jstl. The following classes are a part of the Collections namespace:</p>
 * <ul>
 *   <li>Stack</li>
 *   <li>LinkedList</li>
 *   <li>ListIterator</li>
 * </ul>
 * @author <a href="mailto:neal@rutta.com">Neal Rutta</a>
 * @version 0.0.1
 * @namespace jstl.util
 */


/** @class */
jstl.util.Collections = ( function() {
    /** @lends Collections */
    
    return {
        /**
         * Sort a List datastructure using a mergeSort operation. The elements within the List are
         * first extracted into an Array, then sorted, and repopulated back into the List.
         *
         * @public
         * @memberOf Collections
         */
        sort: function(list, comparator) {
            var arr = list.toArray(), i;
        
            // mergeSort goes here
            function merge(lista, listb) {
                var lena = lista.length, lenb = listb.length,
                    arr = [];
                    idxa = 0, idxb = 0;
                
                while (idxa < lena && idxb < lenb) {
                    if (lista[idxa] < listb[idxb])
                        arr.push( lista[idxa++] );
                    else
                        arr.push( listb[idxb++] );
                }
            
                while (idxa < lena)
                    arr.push( lista[idxa++] );
                while (idxb < lenb)
                    arr.push( listb[idxb++] );
                
                return arr;
            }
        
            function mergeSort(list, start, len) {

                if (len === 0)
                    return [];
                if (len === 1)
                    return [ list[start] ];

                // recursively split the input list in half and call this routine until
                // each side has 0 or 1 element within it. Then merge the two lists in a
                // ascending order. As these lists bubble back up they get reconstituted
                // as 2 sorted lists that continuously get merged together, until the
                // completed sorted list is retrieved.
                //
                var half = Math.ceil(len / 2);
                //var first = list.slice(0, half);
                //var second = list.slice(half);
                //return merge(mergeSort(first), mergeSort(second));
                return merge(mergeSort(list, start, half), mergeSort(list, start+half, len-half));
            }
        
            list.clear();
            arr = mergeSort(arr, 0, arr.length);
            for (i = 0; i < arr.length; i++)
                list.add(arr[i]);
            
            return list;
        }
    }
    
})();

/**
 * General purpose definitions for the Comparator object, which can be used by various collections to 
 * help with their 'contains()' and 'equals()' operations.
 *
 * @fileOverview <p>This contains functions to be reused by various collection datastructures to implement
 * comparable operations (e.g. contains, equals). Javascript defines a small set of types (number, string,
 * boolean, undefined, null) and this methods will support comparison operations of these types.</p>
 *
 */

jstl.util.Comparator = (function() {
    var StringComparator = {
        compare: function(e1, e2) {
            if (e1 === e2) return 0;
            else if (e1 <= e2) return -1;
            else return 1;
        },

        equals: function(e1, e2) {
            return (e1 === e2);
        }
    };

    var NumberComparator = {
        compare: function(e1, e2) {
            if (e1 === e2) return 0;
            else if (e1 <= e2) return -1;
            else return 1;
        },

        equals: function(e1, e2) {
            return (e1 === e2);
        }
    };

    var BooleanComparator = {
        compare: function(e1, e2) {
            if (e1 === e2) return 0;
            else if (e1 <= e2) return -1;
            else return 1;
        },

        equals: function(e1, e2) {
            return (e1 === e2);
        }
    };

    /**
     * the comparator interface certainly can be extracted and thus 'inherited' by all that will use it.
     * sort, equality, contain operations all require the ability to compare elements within the
     * datastructure, so the following general statements are made:
     *
     *   - if assertType option is not specified:
     *     + sort operations should throw an exception
     *     + contain/equals operations should always return false.
     *
     *  - if assertType is set to a string (e.g. typeof assertType == "string")
     *     +  assertType == "number", use predefined NumberComparator
     *     +  assertType == "string", use predefined StringComparator
     *     +  assertType == "boolean", use predefined BooleanComparator
     *
     *   - if assertType is an object (e.g. typeof assertType == "object")
     *     + access the "type" property, which will contain a string value that is used to verify
     *       correct types are being inserted.
     *     + apply the comparator argument and use that during sort/contain/equals operations.
     *     
     *
     * @constructor
     * @this {LinkedList}
     * @param {Object} cfg contains configuration options
     */   
    function Comparator(cfg) {
        var config = cfg || {};

        this.assertType = config.assertType || null;
        this.comparator = config.comparator || null;

        if (this.comparator) {
            if (typeof this.comparator != "object") {
                throw new jstl.Exception('ComparatorException', 'Comparator does not exist');
            }
            else if (!this.comparator.compare || typeof this.comparator.compare != "function") {
                throw new jstl.Exception('ComparatorException', 'Comparator does not have a valid compare function');
            }
            else if (!this.comparator.equals || typeof this.comparator.equals != "function") {
                throw new jstl.Exception('ComparatorException', 'Comparator does not have a valid equals function');
            }
        }

        if (this.assertType) {
            if (typeof this.assertType == "string") {
                if (this.assertType == "string")
                    this.comparator = StringComparator;
                else if (this.assertType == "number")
                    this.comparator = NumberComparator;
                else if (this.assertType == "boolean")
                    this.comparator = BooleanComparator
            }
            else if (typeof this.assertType == "object") {
                this.propertyType = this.assertType["type"];
                // this.comparator is previously set from cfg parameter .. hopefully
            }
        }
    }

    /**
     * Assert that the object being inserted/added into the collection has the same type as the
     * existing objects. This is a runtime assertion to guarantee that the same 'class' of object
     * is being added into a collection (under the assumption that its important, as sort and compare
     * operations are to be performed subsequently).
     *
     * @public
     * @memberOf Comparator
     */
    Comparator.prototype.assertElementType = function(e) {
        if (!this.assertType)
            return true;
   
        if (this.assertType === typeof e) {
            if (this.assertType === 'object') {
            }
        
            return true;
        }
    
        throw new jstl.Exception('ClassCastException', 'Element type [' + typeof e + '] does not match asserted type [' + this.assertType + ']');
    }
    
    Comparator.prototype.getEqualsFunction = function() { return (this.comparator) ? this.comparator.equals : null; };
    Comparator.prototype.getCompareFunction = function() { return (this.comparator) ? this.comparator.compare : null; };
   
    return Comparator;
})();


/**
 * Iterator interface for javascript. This defines a set of methods that specific iterators should
 * implement. As such, these methods default to raising an exception, to make sure that any object
 * inheriting from this interface redefines the appropriate methods.
 * 
 * @class Iterator
 * @lends jstl.util.
 */
jstl.util.Iterator = (function () {

  /**
   * Iterator. Interface for iterator implementations. Specific implementations should inherit this object, and then
   * redefine all appropriate methods.
   *
   * @constructor
   */
  Iterator = function() {
  }

  /**
   * Return true if this iterator has more elements left when traversing in the forward direction
   *
   * @return {boolean}
   */
  Iterator.prototype.hasNext = function() {
      throw new jstl.Exception('UnsupportedException', 'Iterator interface does not provide hasNext implementation');
  }


  /**
   * Return true if the list iterator has more elements left to traverse in the reverse direction
   *
   * @return {boolean}
   */
  Iterator.prototype.hasPrevious = function() {
      throw new jstl.Exception('UnsupportedException', 'Iterator interface does not provide hasPrevious implementation');
  }

  /**
   * Return the next element.
   *
   * @return {Object} element at the next position.
   * @throws {jstl.Exception} if there is no next element
   */
  Iterator.prototype.next = function() {
      throw new jstl.Exception('UnsupportedException', 'Iterator interface does not provide next implementation');
  }

  /**
   * Return the index of the element that would be returned by a call to 'next'. Return the size of the datastructure
   * if the iterator is at the end.
   *
   * @return {integer}
   */
  Iterator.prototype.nextIndex = function() {
      throw new jstl.Exception('UnsupportedException', 'Iterator interface does not provide nextIndex implementation');
  }

  /**
   * add the specified element at the specified index. If an index value isn't specified,
   * add the element to the end of the datastructure
   *
   * @return {Object}
   * @throws {jstl.Exception} if the cursor is before the first element or there are no elements in the datastructure
   */
  Iterator.prototype.previous = function() {
      throw new jstl.Exception('UnsupportedException', 'Iterator interface does not provide previous implementation');
  }

  /**
   * Return the index of the element that would be returned by a call to 'previous'. If the iterator is at the
   * beginning, return -1.
   *
   * @return {integer}
   */
  Iterator.prototype.previousIndex = function() {
      throw new jstl.Exception('UnsupportedException', 'Iterator interface does not provide previousIndex implementation');
  }

  return Iterator;
})();
/**
 * A linked list implementation in javascript
 * @class LinkedList
 * @lends jstl.util.
 */
jstl.util.BinaryTree = ( function() {

    function TreeNode(v, prev, next) { 
        this.value = v || null;
        this.level = null;
        this.left = prev || null;
        this.right = next || null;
        this.parent = null;
    }
  
    TreeNode.prototype.getLevel = function () { return this.level; };
    TreeNode.prototype.getLeft = function () { return this.left; };
    TreeNode.prototype.getRight = function () { return this.left; };
    TreeNode.prototype.getValue = function () { return this.value; };
    TreeNode.prototype.setLeft = function (n) { this.left = n; return this; };
    TreeNode.prototype.setRight = function (n) { this.right = n; return this; };

    /**
     * BinaryTreeIterator. Iterator for a BinaryTree. This is defined here such that the iterator cannot be created
     * on its own -- you must retrieve it from a valid BinaryTree. The starting point is the smallest value in the
     * tree.
     *
     * The Iterator position is defined by the value of this.currentNode:
     *     - this.currentNode === undefined means cursor is before first element
     *     - this.currentNode === null means cursor is after last element
     *     - this.currentNode means cursor is somewhere in the valid range of elements 
     *
     * @constructor
     * @this {BinaryTreeIterator}
     */
    function BinaryTreeIterator(tree) {
        this.tree = tree;
        this.currentNode = undefined;
    };

    /**
     * Return true if this iterator has more elements left when traversing in the forward direction
     *
     * @return {boolean}
     */
    BinaryTreeIterator.prototype.hasNext = function () {
        var save = this.currentNode;
        var nxt = this.next();
        this.currentNode = save;
        return (nxt) ? true : false;
    };

    /**
     * Return true if the list iterator has more elements left to traverse in the reverse direction
     *
     * @return {boolean}
     */
    BinaryTreeIterator.prototype.hasPrevious = function() {
        var cursize = this.list.size();
        if (cursize != 0 && this.cursorPosition > 0)
            return true;
        else
            return false;
    };

    /**
     * Return the next element in the tree
     *
     * @return {Object} element at the next position in the list
     * @throws {jstl.Exception} if there is no next element
     */
    BinaryTreeIterator.prototype.next = function() {
        var ptr, parent;

        if (this.currentNode === undefined) {
            // before beginning, so get the first element in the tree.
            for (ptr = this.tree.root; ptr; ptr = ptr.left) {
                if (ptr.left === null) {
                    this.currentNode = ptr;
                    break;
                }
            }
            
            // check for an empty tree
            if (this.currentNode === undefined) {
                return null;
            }
        }
        else if (this.currentNode === null) {
            // at the end of the tree (or tree is null)
            return null;
        }
        else if (this.currentNode.right) {
            // if there is a right-branch, get the left most leaf on this branch as the next value
            for (ptr = this.currentNode.right; ;) {
                if (ptr.left) {
                    ptr = ptr.left;
                }
                else if (ptr.right) {
                    ptr = ptr.right;
                }
                else {
                    this.currentNode = ptr;
                    break;
                }
            }
        }
        else {
            // traverse back up this branch, and find the parent from which we come from its
            // left branch.
            for (ptr = this.currentNode; ptr.parent; ptr = ptr.parent) {
                if (ptr.parent.left === ptr) {
                    this.currentNode = ptr.parent;
                    break;
                }
            }
            
            // if we back up the tree to the root from the right branch, there are no more left;
            if (ptr.parent === null) {
                this.currentNode = null;
            }
        }
        
        return (this.currentNode) ? this.currentNode.getValue() : null;
    };

    /**
     * Return the previous element in the tree.
     *
     * @return {Object} element at the previous position in the tree
     * @throws {jstl.Exception} if the cursor is before the first element or there are no elements in the tree
     * 
     */
    BinaryTreeIterator.prototype.previous = function() {
        var ptr, parent;

        if (this.currentNode === undefined) {
            // before beginning
            return null;
        }
        else if (this.currentNode === null) {
            // we're at the end, so find the last element and return that.
            for (ptr = this.tree.root; ptr; ptr = ptr.right) {
                if (ptr.right === null) {
                    this.currentNode = ptr;
                    break;
                }
            }
            
            // check for an empty tree
            if (this.currentNode == null) {
                return null;
            }
        }
        else if (this.currentNode.left) {
            // find the right-most element in the left branch, this will be the next smallest value.
            //     * get the (left) child of the current node.
            //          - if there isn't a right branch on this child, we've found the next smallest value
            //          - if there is a right branch, traverse down the right branch until you find a node
            //            that doesn't have a right branch. thats the next smallest value.
            //
            for (ptr = this.currentNode.left; ptr; ptr = ptr.right) {
                if (ptr.right === null) {
                    this.currentNode = ptr;
                    break;
                }
            }
        }
        else {
            // traverse back up this branch, and find the parent from which we come from its
            // right branch.
            for (ptr = this.currentNode; ptr.parent; ptr = ptr.parent) {
                if (ptr.parent.right === ptr) {
                    this.currentNode = ptr.parent;
                    break;
                }
            }
            
            // if we back up the tree to the root from the right branch, there are no more left;
            if (ptr.parent === null) {
                this.currentNode = undefined;
            }
        }
        
        return (this.currentNode) ? this.currentNode.getValue() : null;
    };

    /**
     * Binary tree implementation, which contains a left and right child node, plus the value.
     * There is no balancing going on in this tree implementation. A Comparator is required for
     * this to correctly function, as the implication of a tree is that elements are actually
     * sorted.
     *
     * @constructor
     * @this {BinaryTree}
     */
    function BinaryTree(cfg) {
        var config = cfg || {};
        this.root = null; //new TreeNode();
        this.maxLevel = 0;
        this.current = null; // used to point at the current node being evaluated
        this.comparator = new jstl.util.Comparator(config);
        this.count = 0;
    }

    /**
     * add the specified element to the binary tree. This is a synonym for insert
     *
     * @param {Object} o element to add.
     * @return {boolean} returns true if the element was added to the tree.
     */
    BinaryTree.prototype.add = function(o) {
       return this.insert(o);
    };
    

    /**
     * clear all elements from the binary tree
     *
     * @return {void} 
     */
    BinaryTree.prototype.clear = function() {
        this.root = new TreeNode();    // does this effectively force a cleanup of node objects,
                                       // or should we iterate through the tree and explicitly delete things.
        this.current = null;
        this.count = 0;
        return undefined;
    };

    /**
     * Returns true if this list contains the specified element
     *
     * @param {Object} o element to check as to whether its in the list
     * @return {boolean} whether or not the element exists in the list.
     */
    BinaryTree.prototype.contains = function(o) {
        if (this.get(o) !== null)
            return true;
        else
            return false; 
    };

    /**
     * Retrieve the element at the specified position in this list. NEEDSWORK: does this exist in tree land?
     *
     * @param {integer} i index value of the item to get from the list
     * @return {Object} The object at the specified location
     * @throws {jstl.Exception} if the index is out of range (index < 0 || index >= size())
     */
    BinaryTree.prototype.get = function(o) {
        var ptr;

        function preorder(node, o) {
            var val;
            
            if (node === null)
                return null;
            
            val = node.getValue();
            cmp = comparator.compare(val, o);
            if (cmp === 0)
                return node;
           
            if (cmp === 1) {
                return preorder(node.left, o);
            }
            else {
                return preorder(node.right, o);
            }
        }
    };

    BinaryTree.prototype.insert = function (o) {
        var compareFunc = this.comparator.getCompareFunction();
        this.comparator.assertElementType(o);
        
        /*
         * DEPRECATED
         * 
        function insertNode(t, val) {
            var tval;

            if (!t.value) {
                t = new TreeNode(val);
                return t;
            }

            tval = t.getValue();

            if (compareFunc(val, tval) <= 0) {
                return insertNode(t.left, n);
            }
            else {
                return insertNode(t.right, n);
            }
            
            return null;
        }
        
        if (!o) {
            return false;
        }
        
         */
        
        //insertNode(this.root, o);

        if (this.root == null) {
            this.root = new TreeNode(o);
            return true;
        }

        for (var ptr = this.root;;) {
            if (compareFunc(o, ptr.getValue()) <= 0) {
                if (ptr.left === null) {
                    ptr.left = new TreeNode(o);
                    ptr.left.parent = ptr;
                    break;
                }
                else {
                    ptr = ptr.left;
                }
            }
            else {
                if (ptr.right === null) {
                    ptr.right = new TreeNode(o);
                    ptr.right.parent = ptr;
                    break;
                }
                else {
                    ptr = ptr.right;
                }

            }
        }

        return true;
    };


    /**
     * Returns whether or not this list contains no elements
     *
     * @return {boolean} whether or not the list contains elements
     */
    BinaryTree.prototype.isEmpty = function() {
        return this.size() === 0;
    }

    /**
     * Return an iterator over the elements in this list in proper sequence
     *
     * @return {Iterator} iterator that can be used to traverse the sequence of elements in this list,
     *                    or null if the list is empty
     */
    BinaryTree.prototype.iterator = function () {
        return new BinaryTreeIterator(this);
    };

    /**
     * Remove an element at the specified position in this list
     *
     * @param {integer} i index into the list of the element to be removed
     * @return {Object} element at the specified location
     * @throws {jstl.Exception} if the index is out of range (index < 0 || index >= size())
     */
    BinaryTree.prototype.remove = function (i) {
        var ptr;

        if (i == undefined || i < 0 || i >= this.size())
            throw new jstl.Exception('IndexOutOfBoundsException', 'Index ' + i + ' is out of range');

        ptr = findByIndex(this, i);
        if (ptr.prev) 
            ptr.prev.next = ptr.next;
        else
            this.head = ptr.next;

        if (ptr.next)
            ptr.next.prev = ptr.prev;
        else
            this.tail = ptr.prev;

        this.count -= 1;
        return ptr.value;
    };

    /**
     * Return the number of elements in this list
     *
     * @return {integer} number of elements in the list
     */
    BinaryTree.prototype.size = function () {
        return this.count;
    };

    /**
     * <p>Traverse the items in the tree and invoke the specified callback for each item.
     * <ul>
     * <li>Preorder first visits all nodes on the left side, then the node value, then the
     *     right side.
     * <li>Inorder visits the current node, then the left side, then the right side.
     * <li>Postorder vists the right node, then the current node, then the left node.
     * </ul></p>
     *
     * @param {String} order to traverse the tree (preorder, inorder, postorder). A value of
     *                 -1, 0, 1 will also work.
     * @param {Function} cb callback function to invoke
     */
    BinaryTree.prototype.traverse = function (order, cb) {

        function preorder(node) {
            cb(node.getValue());
            if (node.left) preorder(node.left);
            if (node.right) preorder(node.right);
        }

        function inorder(node) {
            if (node.left) inorder(node.left);
            cb(node.getValue());
            if (node.right) inorder(node.right);           
        }

        function postorder(node) {
            if (node.left) postorder(node.left);
            if (node.right) postorder(node.right);
            cb(node.getValue());
        }
        
        function depth(rootnode) {
            var arr = [rootnode];
            while (arr.length != 0) {
                var node = arr.shift();
                cb(node.getValue());
                if (node.left) arr.push(node.left);
                if (node.right) arr.push(node.right);
           }
        }

        if (typeof order === "string") {
            order = order.toLowerCase();
        }

        if (order === "preorder" || order === -1) {
            preorder(this.root);
        } else if (order === "postorder" || order === 1) {
            postorder(this.root);
        } else if (order === "depth") {
            depth(this.root);
        }
        else {
            inorder(this.root);
        }
    };


    /**
     * Returns an array containing all the elements in this list in proper sequence
     *
     * @return {Array} a javascript array of all the elements. Note that this contains references
     *                 to the elements, not copies of the elements.
     */
    BinaryTree.prototype.toArray = function () {
        var size = this.size(), arr = [ size ], ptr, i;
        for (i = 0, ptr = this.head; i < size; ptr = ptr.next, i++) {
            arr[i] = ptr.value;
        }
      
        return arr;
    };
  
    return BinaryTree;
})();



jstl.Exception = (function() {

    /**
     * A generic exception to be used by this js standard template library
     * @constructor
     * @class A general purpose exception class to hold relevant data when jstl throws a fit.
     * @property {string} name The name of the exception
     * @property {string} description a textual description of the exception being thrown
     * @property {string|Object} data user defined data. can be anything.
     *
     * @this {Exception}
     * @param {string} [name] the name for this thrown exception
     * @param {string} [desc] a textual description of the exception being thrown
     * @param {string|Object}  [data] user defined data. can be anything.
     */
    function _Exception(name, desc, data) {
        this.name = name || 'jstlException';
        this.description = desc || 'an exception has occurred';
        this.data = data || null;
    }

    return _Exception;
})();


/**
 * A linked list implementation in javascript
 * @class LinkedList
 * @lends jstl.util.
 */
jstl.util.LinkedList = ( function() {

    /**
     * retrieve a particular location within the list.
     */
    function findByIndex(list, i) {
        var k, ptr = list.head, size = list.size(); 
        for (var k = 0; k <= size; k++) {
            if (k === i)
                return ptr;
            else
                ptr = ptr.next;
        }

        return null;
    }

    function _Element(v, prev, next) { 
        this.value = v || null;
        this.prev = prev || null;
        this.next = next || null;
    }
  
    /**
     * ListIterator. Iterator for LinkedLists. This is defined here such that the iterator cannot be created
     * on its own -- you must retrieve it from a valid LinkedList.
     *
     * @constructor
     * @this {ListIterator}
     */
    function ListIterator(list) {
        this.list = list;
        this.cursorPosition = 0;  // cursorPosition is always to the left of the specified element
    }

    /**
     * Return true if this iterator has more elements left when traversing in the forward direction
     *
     * @return {boolean}
     */
    ListIterator.prototype.hasNext = function() {
        var cursize = this.list.size();
        if (cursize != 0 && this.cursorPosition < cursize)
            return true;
        else
            return false;
    }


    /**
     * Return true if the list iterator has more elements left to traverse in the reverse direction
     *
     * @return {boolean}
     */
    ListIterator.prototype.hasPrevious = function() {
        var cursize = this.list.size();
        if (cursize != 0 && this.cursorPosition > 0)
            return true;
        else
            return false;
    }

    /**
     * Return the next element in the list
     *
     * @return {Object} element at the next position in the list
     * @throws {jstl.Exception} if there is no next element
     */
    ListIterator.prototype.next = function() {
        var cursize = this.list.size();
        var obj;

        if (cursize == 0 || this.cursorPosition >= cursize)
           throw new jstl.Exception('NoSuchElementException', 'Iterator is at the end of the list');

        obj = this.list.get(this.cursorPosition);
        this.cursorPosition += 1;
        return obj;
    }

    /**
     * Return the index of the element that would be returned by a call to 'next'. Return the size of the list
     * if the iterator is at the end of the list.
     *
     * @return {integer}
     */
    ListIterator.prototype.nextIndex = function() {
        var cursize = this.list.size();

        if (cursize == 0 || this.cursorPosition >= cursize)
            return cursize;

        return cursorPosition;
    }

    /**
     * add the specified element to the list at the specified index. If an index value isn't specified,
     * add the element to the end of the list
     *
     * @return {Object}
     * @throws {jstl.Exception} if the cursor is before the first element or there are no elements on the list
     */
    ListIterator.prototype.previous = function() {
        var cursize = this.list.size();
        var obj;

        if (cursize == 0 || this.cursorPosition <= 0)
           throw new jstl.Exception('NoSuchElementException', 'Cannot get element before beginning cursor position');

        obj = this.list.get(this.cursorPosition);
        this.cursorPosition -= 1;
        return obj;
    }

    /**
     * Return the index of the element that would be returned by a call to 'previous'. If the iterator is at the
     * beginning of the list, return -1.
     *
     * @return {integer}
     */
    ListIterator.prototype.previousIndex = function() {
        var cursize = this.list.size();

        if (cursize == 0 || this.cursorPosition <= 0)
            return -1;

        return cursorPosition;
    }

    /**
     * LinkedList. This is actually implemented as a doubly-linked-list to be efficient when performing operations
     * that require traversing from the end of the list. While there are some methods to support adding and removing
     * elements explicitly at the front and back of the list, this doesn't go so far as to provide all of the 
     * functionality to implement a stack or queue (which are provided by separate datastructures). This may turn out
     * to be a short-sided decision.
     *
     * @constructor
     * @this {LinkedList}
     */
    function LinkedList(cfg) {
        cfg = cfg || {};

        this.count = 0;
        this.head = null;
        this.tail = null;
        this.comparator = new jstl.util.Comparator(cfg);
    }

    /**
     * add the specified element to the list at the specified index. If an index value isn't specified,
     * add the element to the end of the list
     *
     * @param {Object} o element to add.
     * @param {integer} [i] index of the location to add the element
     * @return {void}
     * @throws {jstl.Exception} if the index is out of range (index < 0 || index >= size())
     */
    LinkedList.prototype.add = function(o, i) {
       var elem, ptr;
     
       this.comparator.assertElementType(o);
     
       if (i === undefined)
           return this.addLast(o);
       else {
           if (i < 0 || i >= this.size())
               throw new jstl.Exception('IndexOutOfBoundsException', 'Index ' + i + ' is out of range');

           ptr = findByIndex(this, i);
           elem = new _Element(o, ptr.prev, ptr);
           ptr.prev.next = elem;
           ptr.prev = elem;
           this.count += 1;
           return true;
       }
    };

    /**
     * insert the element at the beginning of the list
     *
     * @param {Object} o the object to add.
     * @return {boolean} whether or not the element was added
     */
    LinkedList.prototype.addFirst = function(o) {
        var elem = new _Element(o, null, this.head);
        if (this.head)
            this.head.prev = elem;

        this.head = elem;
        this.count += 1;
        return true;
     };

    /**
     * add the element to the end of the list
     *
     * @param {Object} o the element to add.
     * @return {boolean} whether or not the element was added
     */
    LinkedList.prototype.addLast = function(o) {
        var elem = new _Element(o, this.tail, null);

        if (!this.head)
            this.head = elem;

        if (this.tail)
            this.tail.next = elem;  

        this.tail = elem;
        this.count += 1;
        return true;
    }

    /**
     * clear all elements from this list
     *
     * @return {void} 
     */
    LinkedList.prototype.clear = function() {
        this.head = null;
        this.tail = null;
        this.count = 0;
        return undefined;
    };

    /**
     * Returns true if this list contains the specified element
     *
     * @param {Object} o element to check as to whether its in the list
     * @return {boolean} whether or not the element exists in the list.
     */
    LinkedList.prototype.contains = function(o) {
        var ptr;
        if ( typeof o == "object") {
            for (ptr = this.head; ptr; ptr = ptr.next) {
                if (ptr.value.equals(o))
                    return true;
            }
        }
        else {
            for (ptr = this.head; ptr; ptr = ptr.next) {
                if (ptr.value === o)
                    return true;
            }
        }

        return false; 
    };


    /**
     * Retrieve the element at the specified position in this list
     *
     * @param {integer} i index value of the item to get from the list
     * @return {Object} The object at the specified location
     * @throws {jstl.Exception} if the index is out of range (index < 0 || index >= size())
     */
    LinkedList.prototype.get = function(i) {
        var ptr;

        if (i == undefined || i < 0 || i >= this.size())
            throw new jstl.Exception('IndexOutOfBoundsException', 'Index ' + i + ' is out of range');

        ptr = findByIndex(this, i);
        return ptr.value;
    };

    /**
     * Returns the index of the specified element in the list, or -1.
     * More formally, returns the highest index such that (element==null ?  get(i)==null : element.equals(get(i)) ),
     * or -1 if there is no such index.
     *
     * @param {Object} o element to search for within the list
     * @return {integer} index of element in the list that matches this element
     */
    LinkedList.prototype.indexOf = function(o) {
        var idx, ptr;
        if ( typeof o == "object") {
            for (idx = 0, ptr = this.head; ptr; idx += 1, ptr = ptr.next) {
                if (ptr.value.equals(o))
                    return idx;
            }
        }
        else {
            for (idx = 0, ptr = this.head; ptr; idx += 1, ptr = ptr.next) {
                if (ptr.value === o)
                    return idx;
            }
        }

        return -1;
    }

    /**
     * Returns whether or not this list contains no elements
     *
     * @return {boolean} whether or not the list contains elements
     */
    LinkedList.prototype.isEmpty = function() {
        return this.size() === 0;
    }

    /**
     * Return an iterator over the elements in this list in proper sequence
     *
     * @return {Iterator} iterator that can be used to traverse the sequence of elements in this list,
     *                    or null if the list is empty
     */
    LinkedList.prototype.iterator = function() {
        return new ListIterator(this);
    }

    /**
     * Returns the index of the last occurrence of the specified element in the list, or -1.
     * More formally, returns the highest index such that (element==null ?  get(i)==null : element.equals(get(i)) ),
     * or -1 if there is no such index.
     *
     * @param {Object} o element to search for within the list
     * @return {integer} index of last element in the list that matches this element
     */
    LinkedList.prototype.lastIndexOf = function(o) {
        var idx = this.size()-1, ptr;
        if ( typeof o == "object") {
            for (ptr = this.tail; ptr; idx -= 1, ptr = ptr.prev) {
                if (ptr.value.equals(o))
                    return idx;
            }
        }
        else {
            for (ptr = this.tail; ptr; idx -= 1, ptr = ptr.prev) {
                if (ptr.value === o)
                    return idx;
            }
        }

        return -1;
    }

    /**
     * Remove an element at the specified position in this list
     *
     * @param {integer} i index into the list of the element to be removed
     * @return {Object} element at the specified location
     * @throws {jstl.Exception} if the index is out of range (index < 0 || index >= size())
     */
    LinkedList.prototype.remove = function(i) {
        var ptr;

        if (i == undefined || i < 0 || i >= this.size())
            throw new jstl.Exception('IndexOutOfBoundsException', 'Index ' + i + ' is out of range');

        ptr = findByIndex(this, i);
        if (ptr.prev) 
            ptr.prev.next = ptr.next;
        else
            this.head = ptr.next;

        if (ptr.next)
            ptr.next.prev = ptr.prev;
        else
            this.tail = ptr.prev;

        this.count -= 1;
        return ptr.value;
    }

    /**
     * Remove the first element from this list
     *
     * @return {Object} element which was first in the list, or null if the list is empty
     */
    LinkedList.prototype.removeFirst = function() {
        return this.remove(0);
    }

    /**
     * Remove the element from the end of the list
     *
     * @return {Object} element that was at the end of the list, or null if the list is empty
     */
    LinkedList.prototype.removeLast = function() {
        return this.remove( this.size() - 1 );
    }

    /**
     * Return the number of elements in this list
     *
     * @return {integer} number of elements in the list
     */
    LinkedList.prototype.size = function() {
        return this.count;
    }

    /**
     * Returns an array containing all the elements in this list in proper sequence
     *
     * @return {Array} a javascript array of all the elements. Note that this contains references
     *                 to the elements, not copies of the elements.
     */
    LinkedList.prototype.toArray = function() {
        var size = this.size(), arr = [ size ], ptr, i;
        for (i = 0, ptr = this.head; i < size; ptr = ptr.next, i++) {
            arr[i] = ptr.value;
        }
      
        return arr;
    }
  
    //jstl.util.Comparator.call(LinkedList.prototype);  // mixin the comparable interface/implementation NEEDSWORK
    return LinkedList;
})();

jstl.util.Queue = (function () {

    /** @lends jstl */

    /**
     * A queue datastructure in javascript. The implementation uses jstl.util.LinkedList to provide
     * the queue, and only exposes the appropriate methods for a queue.
     * 
     * @constructor
     * @class Represents a Queue
     * @name Queue
     * @this {Queue}
     */
    function Queue(cfg) {
        var config = cfg || {};

        this.max = null;

        if (typeof config.max === 'number') {
            if (config.max <= 0) {
                throw new jstl.Exception('QueueException', 'Maximum count for queue must be greater than 0');
            }

            this.max = config.max;
        }

        this.q = new jstl.util.LinkedList(config);
        if (this.q === null) {
            throw new jstl.Exception('QueueException', 'Error creating Queue');
        }
    }


    /**
     * Add an element to the queue.
     *
     * @memberOf Queue
     * @param {Object} e element to add to the queue
     * @return {boolean} returns true if element added
     * @throws {jstl.Exception} exception if the element cannot be added.
     */
    Queue.prototype.add = function (e) {

        if (this.max && (this.q.size() >= this.max)) {
            throw new jstl.Exception('QueueException', 'Maximum number of elements [' + this.max + '] already in queue');
        }

        if (!this.q.add(e)) {
            throw new jstl.Exception('QueueException', 'Unable to add element to the queue');
        }

        return true;
    };

    /**
     * Retrieve the element at the front of the queue without removing it.
     *
     * @return {Object} element at the front of the queue
     * @throws {jstl.Exception} exception if the element at the front cannot be retrieved.
     */
    Queue.prototype.element = function () {
        var e;
        if (this.q.size() === 0) {
            throw new jstl.Exception('QueueException', 'Cannot retrieve element at front of an empty queue');
        } else {
            e = this.q.get(0);
            if (!e) {
                throw new jstl.Exception('QueueException', 'Cannot retrieve element from queue');
            } else {
                return e;
            }
        }
    };

    /**
     * Remove all items from this Queue. Reduces the size of the queue to 0.
     * @this {Queue}
     * @return {boolean} returns true if operation was successful
     * @throws {jstl.Exception} exception if the queue cannot be cleared
     * 
     */
    Queue.prototype.empty = function () {
        if (!this.q.clear()) {
            throw new jstl.Exception('QueueException', 'Unable to clear queue');
        }

        return true;
    };

    /**
     * Add an element to the queue.
     *
     * @param {Object} e element to add to the queue
     * @return {boolean} returns true if element added, false otherwise
     */
    Queue.prototype.offer = function (e) {
        if (this.max && (this.q.size() >= this.max)) {
            return false;
        }

        if (!this.q.add(e)) {
            return false;
        }

        return true;
    };


    /**
     * Return a reference to the object at the top of the stack without removing it.
     *
     * @return {Object} returns reference to object at the top of the stack, or null if it is empty
     */
    Queue.prototype.peek = function () {
        var e;
        if (this.q.size() === 0 || ((e = this.q.get(0)) === null)) {
            return null;
        } else {
            return e;
        }
    };

    /**
     * Remove an element from the queue.
     *
     * @return {Object} element removed from the queue, or null
     */
    Queue.prototype.poll = function () {
        var e;
        if ((e = this.q.remove(0)) === null) {
            return null;
        } else {
            return e;
        }
    };

    /**
     * Remove an element from the queue.
     *
     * @return {Object} element removed from the queue
     * @throws {jstl.Exception} exception if the element cannot be removed.
     */
    Queue.prototype.remove = function () {
        var e;
        if ((e = this.q.remove(0)) === null) {
            throw new jstl.Exception('QueueException', 'Unable to remove element from the queue');
        } else {
            return e;
        }
    };

    return Queue;

})();

jstl.util.Stack = (function() {

    /** @lends jstl */

    /**
     * A stack datastructure in javascript. The implementation uses jstl.util.LinkedList to provide
     * the stack, and only exposes the appropriate methods for a stack.
     * 
     * @constructor
     * @class Represents a Stack
     * @name Stack
     * @this {Stack}
     */
    function Stack() {
        this._stack = new jstl.util.LinkedList();
    }

    /**
     * Remove all items from this stack. Reduces the size of the stack to 0.
     * @this {Stack}
     * @return {Object} returns object at the top of the stack.
     */
    Stack.prototype.empty = function() { this._stack.clear(); return this; }

    /**
     * Return a reference to the object at the top of the stack without removing it.
     *
     * @return {Object} returns reference to object at the top of the stack, or null if it is empty
     */
    Stack.prototype.peek = function() {
        var e; 
        if (this._stack.size() === 0) {
            return null;
        }
        else {
            e = this._stack.removeLast();
            this._stack.addLast(e);
            return e;
        }
    };

    /**
     * Remove the item at the top of the stack and return its value.
     *
     * @return {Object} object from the top of the stack, or null if it is empty
     * @throws {jstl.Exception} exception is raised if stack is empty
     */
    Stack.prototype.pop = function() {
        if (this._stack.size() === 0) {
            return null;
        }
        else {
            return this._stack.removeLast();
        }
    };

    /**
     * Push an item on to the top of the stack
     *
     * @param {Object} item A new item to put at the top of the stack.
     * @return {Object} A reference to this stack object
     */
    Stack.prototype.push = function(item) {
        if (item) {
            this._stack.add(item);
        }
    };

    /**
     * Return the index of the item on the stack. THIS IS NOT YET IMPLEMENTED
     *
     * @return {} null
     * @throws {jstl.Exception} 
     */
    Stack.prototype.search = function() {
        throw new jstlException('StackException', 'Search method is not yet supported');
    }

    return Stack;

})();
