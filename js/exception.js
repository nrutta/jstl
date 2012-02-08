

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


