
_jstl.util.Stack = (function() {

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
      this._stack = new _jstl.util.LinkedList();
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
      if (this._stack.size() === 0) {
          return null;
      }
      else {
          return this._stack.get(0);
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
          return this._stack.remove(0);
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

  //_jstl.util.Stack = Stack;
  return Stack;

})();
