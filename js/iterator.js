/**
 * Iterator interface for javascript. This defines a set of methods that specific iterators should
 * implement. As such, these methods default to raising an exception, to make sure that any object
 * inheriting from this interface redefines the appropriate methods.
 * 
 * @class Iterator
 * @lends jstl.util.
 */
(function() {

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

  _jstl.util.Iterator = Iterator;
})();
