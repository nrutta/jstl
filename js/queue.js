
_jstl.util.Queue = (function () {
    "use strict";

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

        this.q = new _jstl.util.LinkedList(config);
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



    //_jstl.util.Queue = Queue;
    return Queue;

}());
