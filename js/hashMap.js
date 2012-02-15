/**
 * <p>A Hashed Map implementation in javascript. Things still to do include:
 * <ul>
 *     <li> implement hashCode support for objects
 *     <li> implement hashCode support for entire hashMap
 *     <li> implement better hashCode algorithm
 *     <li> hashMapIterator (maybe each is good enough)
 *     <li> more testing
 * 
 * @class HashMap
 * @lends jstl.util.
 */
jstl.util.HashMap = ( function() {

    /**
     * Bucket. Datastructure to store key/value pairs that happen to map to the same location. Right
     * now a LinkedList is used to chain multiple elements within the same bucket. This is the
     * simplicity approach -- next iteration should improve by using a growable array (which may be
     * small in space allocation and faster in access). Other improvements can be caching the most
     * recently accessed key/value pair, or even the key/value pair that is accessed the most.
     *
     * @param{Object} cfg defines the Comparator object to use for comparison operations against the key
     */
    function Bucket(cfg) {
        this.chain = new jstl.util.LinkedList(cfg);
        this.recent_key = null;
        this.recent_value = null;
    }
  
    Bucket.prototype.clear = function () {
        var sz = this.size();
        this.recent_key = this.recent_value = null;
        this.chain.clear();
        return sz;
    };
    Bucket.prototype.containsValue = function (v) {
        var li = this.chain.iterator();
        var e;
        
        if (this.recent_value === v) {
            return true;
        }
        
        while (li.hasNext()) {
            e = li.next();
            if (e.v === v) {
                return true;
            }
        }

        return false;
    };
    Bucket.prototype.each = function(cb) {
        var li = this.chain.iterator();
        while (li.hasNext()) {
            e = li.next();
            cb(e.k, e.v);
        }
        
        return true;
    };
    Bucket.prototype.get = function (k) {
        if (this.recent_key === k )
            return this.recent_value;
            
        return this.chain.get(k);
    };
    
    /**
     * put a key/value pair into this bucket. make sure this key doesn't already exist.
     */
    Bucket.prototype.put = function (k, v) {
        if (this.chain.contains(k)) {
            throw new jstl.Exception('IllegalArgumentException', 'Key ' + k + ' already exists.');
        }
        
        this.chain.addFirst({k: k, v: v});
        this.recent_key = k;
        this.recent_value = v;
        return true;
    };
    
    /**
     * Remove key/value pair from this bucket. NEEDSWORK: removal via the LinkedList structure is
     * inefficient, as it first needs to calculate the index, then call remove (which iterates to
     * that location). Would be nice if LinkedList.remove() supported index and object parameters,
     * or have 2 separate methods.
     */
    Bucket.prototype.remove = function (k) {
        var idx = this.chain.indexOf(k), val = null;
        if (idx !== -1) {
            val = this.chain.remove(k);
            if (this.recent_key === k) {
                this.recent_key = this.recent_value = null;
            }
        }
        
        return val;
    };
    Bucket.prototype.size = function () {
        return this.chain.size();
    };
    Bucket.prototype.values = function (collection) {
        // NEEDSWORK: what to return? An iterator? Or append on to the collection passed in.
    };


    /**
     * Produce a hash value based upon an input key. This will map to one of the buckets managed
     * by the HashMap.
     */
    function mapKeyToBucket(hm, k) {
        var hash = hm.comparator.hashCode(k),
            capacity = hm.capacity,
            bucket = Math.abs((hash % capacity) - 1);
        return bucket;
    }

    /**
     * Resize the hashmap to increase its capacity. This is a simple approach, where its just doubled
     * in size, and done all at once.
     */
    function resize(hm) {
        var i, len = hm.capacity;
        var oldBuckets = hm.buckets;
        var oldBucketsOccupied = hm.bucketsOccupied;
        
        hm.capacity = hm.capacity * 2;
        hm.capacityHwm = hm.capacity * hm.loadFactor;
        hm.buckets = [ hm.capacity ];
        hm.bucketsOccupied = [ hm.capacity ];
        hm.bucketsCapacity = 0;
        for (i = 0; i < hm.capacity; i += 1) {
            hm.buckets[i] = new Bucket(hm.config);
            hm.bucketsOccupied[i] = 0;
        }

        // now iterate through all key/value pairs in buckets and rehash them into
        // the newly created buckets.
        //
        hm.checkCapacity = false;
        for (i = 0; i < oldBuckets.length; i++) {
            if (oldBucketsOccupied[i]) {
                oldBuckets[i].each(function(k, v) {
                    // NEEDSWORK: need to make sure this operation doesn't cause capacity to be breached,
                    // which would cause a recursive operation to resize again.
                    //
                    hm.put(k, v);    
                });
            }
        }
        hm.checkCapacity = true;
    }

    /**
     * HashMap, which provides buckets to store key/value pairs.
     * There is no balancing going on in this tree implementation. A Comparator is required for
     * this to correctly function, as the implication of a tree is that elements are actually
     * sorted.
     *
     * @constructor
     * @this {BinaryTree}
     */
    function HashMap(cfg) {
        var i;
        
        this.config = cfg || {};
        this.comparator = new jstl.util.Comparator(this.config);
        this.loadFactor = this.config.loadFactor || .75;
        this.capacity = this.config.capacity || 100;
        this.capacityHwm = this.capacity * this.loadFactor;
        this.checkCapacity = true;
        this.buckets = [this.capacity];
        this.bucketsOccupied = [this.capacity];
        this.bucketsCapacity = 0;
        this.count = 0;
        
        for (i = 0; i < this.capacity; i++) {
            this.buckets[i] = new Bucket(this.config);
            this.bucketsOccupied[i] = 0;
        }
    }

    /**
     * Clear all entries from the existing HashMap. bucket capacity is not reset, only values within
     * buckets gets cleared.
     *
     * @returns {Object} reference to HashMap object
     */
    HashMap.prototype.clear = function () {
        var i, len = this.buckets.length;
       
        if (this.count !== 0) { 
            for (i = 0; i < len; i++) {
                this.buckets[i].clear();
            }
        
            this.count = 0;
        }
        
        return this;
    };
   
    /**
     * Determine if a particular value exists within the HashMap. This on the surface seems to be
     * a very expensive operation as we're going to have to iterate through all values within all
     * buckets.
     *
     * @param {Object} value to check for within the HashMap
     * @returns {boolean} true or false depending upon whether the value exists
     */
    HashMap.prototype.containsValue = function (v) {
        var i, len = this.buckets.length;

        if (this.count !== 0) {
            for (i = 0; i < len; i += 1) {
                if (this.buckets[i].containsValue(v)) {
                    return true;
                }
            }
        }
        
        return false;
    };
    
    /**
     * Iterate over all elements within the hashmap and invoke the specified callback on each one.
     */
    HashMap.prototype.each = function (cb) {
        var i, len = this.buckets.length;
        
        if (typeof cb !== "function") {
            return false;
        }
        
        for (i = 0; i < len; i += 1) {
            this.buckets[i].each(cb);
        }
        
        return true;
    };
    
    HashMap.prototype.get = function (k) {
        var bucket;
        if (this.count === 0) {
            return null;
        }
        
        bucket = mapKeyToBucket(this, k);
        return this.buckets[bucket].get(k);
    };
    
    /**
     * put a key/value pair into this bucket. make sure this key doesn't already exist.
     */
    HashMap.prototype.put = function (k, v) {
        var bucket = mapKeyToBucket(this, k);
        
        if (this.buckets[bucket].put(k, v) === true) {
            this.count += 1;

            // capacity check. We're counting only if a bucket has a key/value pair in it,
            // not 'how many'. Once the occupancy of buckets exceeds the prescribed load
            // factor, resize the hashmap.
            //
            if (this.bucketsOccupied[ bucket ] === 0) {
                this.bucketsOccupied[bucket] = 1;
                this.bucketsCapacity += 1;
                if (this.checkCapacity === true) {
                    //console.log("bucketsLoadFactor: " + this.bucketsCapacity + ", total elements stored: " + this.count);
                    if (this.bucketsCapacity > this.capacityHwm) {
                        //console.log("resize the hashmap: buckets used = " + this.bucketsCapacity + ", max capacity = " + this.capacityHwm);
                        resize(this);
                        //console.log("resize complete ....");
                    }
                }
            }
            return true;
        }
        else {
            return false;
        }
    };
    
    HashMap.prototype.remove = function (k) {
        var bucket;
        if (this.count === 0) {
            return false;
        }
        
        bucket = mapKeyToBucket(this, k);
        if (this.buckets[bucket].remove(k) === true) {
            this.count -= 1;
            return true;
        }
        else {
            return false;
        }
    };
    
    HashMap.prototype.size = function () {
        return this.count;
    };
    
    
    HashMap.prototype.values = function (collection) {
        // NEEDSWORK: what to return? An iterator? Or append on to the collection passed in.
    };

  
    return HashMap;
})();

