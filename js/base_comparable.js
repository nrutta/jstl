
/**
 * General purpose definitions for the Comparator object, which can be used by various collections to 
 * help with their 'contains()' and 'equals()' operations.
 *
 * @fileOverview <p>This contains functions to be reused by various collection datastructures to implement
 * comparable operations (e.g. contains, equals). Javascript defines a small set of types (number, string,
 * boolean, undefined, null) and this methods will support comparison operations of these types.</p>
 *
 */

_jstl.util.Comparator = (function()
{
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
    Comparator = function(cfg) {
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


