/**
 * A linked list implementation in javascript
 * @class LinkedList
 * @lends jstl.util.
 */
(function() {

    function TreeNode(v, prev, next) { 
        this.value = v || null;
        this.level = null;
        this.left = prev || null;
        this.right = next || null;
    }
  
    TreeNode.prototype.getLevel = function () { return this.level; };
    TreeNode.prototype.getLeft = function () { return this.left; };
    TreeNode.prototype.getRight = function () { return this.left; };
    TreeNode.prototype.getValue = function () { return this.value; };
    TreeNode.prototype.setLeft = function (n) { this.left = n; return this; };
    TreeNode.prototype.setRight = function (n) { this.right = n; return this; };
  
    /**
     * BinaryTreeIterator. Iterator for LinkedLists. This is defined here such that the iterator cannot be created
     * on its own -- you must retrieve it from a valid LinkedList.
     *
     * @constructor
     * @this {BinaryTreeIterator}
     */
    BinaryTreeIterator = function(list) {
        this.list = list;
        this.cursorPosition = 0;  // cursorPosition is always to the left of the specified element
    }

    /**
     * Return true if this iterator has more elements left when traversing in the forward direction
     *
     * @return {boolean}
     */
    BinaryTreeIterator.prototype.hasNext = function() {
        var cursize = this.list.size();
        if (cursize != 0 && this.cursorPosition < cursize)
            return true;
        else
            return false;
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
     * Return the next element in the list
     *
     * @return {Object} element at the next position in the list
     * @throws {jstl.Exception} if there is no next element
     */
    BinaryTreeIterator.prototype.next = function() {
        var cursize = this.list.size();
        var obj;

        if (cursize == 0 || this.cursorPosition >= cursize)
           throw new jstl.Exception('NoSuchElementException', 'Iterator is at the end of the list');

        obj = this.list.get(this.cursorPosition);
        this.cursorPosition += 1;
        return obj;
    };

    /**
     * Return the index of the element that would be returned by a call to 'next'. Return the
     * size of the list if the iterator is at the end of the list.
     *
     * @return {integer}
     */
    BinaryTreeIterator.prototype.nextIndex = function() {
        var cursize = this.list.size();

        if (cursize == 0 || this.cursorPosition >= cursize)
            return cursize;

        return cursorPosition;
    };

    /**
     * add the specified element to the list at the specified index. If an index value isn't
     * specified, add the element to the end of the list
     *
     * @return {Object}
     * @throws {jstl.Exception} if the cursor is before the first element or there are no elements on the list
     */
    BinaryTreeIterator.prototype.previous = function() {
        var cursize = this.list.size();
        var obj;

        if (cursize == 0 || this.cursorPosition <= 0)
           throw new jstl.Exception('NoSuchElementException', 'Cannot get element before beginning cursor position');

        obj = this.list.get(this.cursorPosition);
        this.cursorPosition -= 1;
        return obj;
    };

    /**
     * Return the index of the element that would be returned by a call to 'previous'. If the
     * iterator is at the beginning of the list, return -1.
     *
     * @return {integer}
     */
    BinaryTreeIterator.prototype.previousIndex = function() {
        var cursize = this.list.size();

        if (cursize == 0 || this.cursorPosition <= 0)
            return -1;

        return cursorPosition;
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
        this.comparator = new _jstl.util.Comparator(config);
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
     * Retrieve the element at the specified position in this list. NEEDSWORK: does this exist in tree land?
     *
     * @param {integer} i index value of the item to get from the list
     * @return {Object} The object at the specified location
     * @throws {jstl.Exception} if the index is out of range (index < 0 || index >= size())
     */
    BinaryTree.prototype.get = function(i) {
        var ptr;

        if (i == undefined || i < 0 || i >= this.size()) {
            throw new jstl.Exception('IndexOutOfBoundsException', 'Index ' + i + ' is out of range');
        }

        ptr = findByIndex(this, i);
        return ptr.value;
    };

    BinaryTree.prototype.insert = function (o) {
        var compareFunc = this.comparator.getCompareFunction();
        
        function insertNode(t, val) {
            var tval;

            if (!t.value) {
                t = new TreeNode(val);
                return t;
            }

            tval = t.getValue();

            if (compareFunc(val, tval) <= 0) {
                return this.insertNode(t.left, n);
            }
            else {
                return this.insertNode(t.right, n);
            }
            
            return null;
        }
        
        if (!o) {
            return false;
        }
        
        this.comparator.assertElementType(o);
        //insertNode(this.root, o);

        if (this.root == null) {
            this.root = new TreeNode(o);
            return true;
        }

        for (var ptr = this.root;;) {
            if (compareFunc(o, ptr.getValue()) <= 0) {
                if (ptr.left === null) {
                    ptr.left = new TreeNode(o);
                    break;
                }
                else {
                    ptr = ptr.left;
                }
            }
            else {
                if (ptr.right === null) {
                    ptr.right = new TreeNode(o);
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
    BinaryTree.prototype.iterator = function() {
        return new BinaryTreeIterator(this);
    }

    /**
     * Remove an element at the specified position in this list
     *
     * @param {integer} i index into the list of the element to be removed
     * @return {Object} element at the specified location
     * @throws {jstl.Exception} if the index is out of range (index < 0 || index >= size())
     */
    BinaryTree.prototype.remove = function(i) {
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
     * Return the number of elements in this list
     *
     * @return {integer} number of elements in the list
     */
    BinaryTree.prototype.size = function() {
        return this.count;
    }

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
            if (node.left) inorder(node.left);
            if (node.right) inorder(node.right);
        }

        function inorder(node) {
            if (node.left) inorder(node.left);
            cb(node.getValue());
            if (node.right) inorder(node.right);           
        }

        function postorder(node) {
            if (node.left) inorder(node.left);
            if (node.right) inorder(node.right);
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
    }


    /**
     * Returns an array containing all the elements in this list in proper sequence
     *
     * @return {Array} a javascript array of all the elements. Note that this contains references
     *                 to the elements, not copies of the elements.
     */
    BinaryTree.prototype.toArray = function() {
        var size = this.size(), arr = [ size ], ptr, i;
        for (i = 0, ptr = this.head; i < size; ptr = ptr.next, i++) {
            arr[i] = ptr.value;
        }
      
        return arr;
    }
  
    _jstl.util.BinaryTree = BinaryTree;
}());

