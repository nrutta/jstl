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
