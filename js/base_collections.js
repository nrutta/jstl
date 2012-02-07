
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
_jstl.util.Collections =
    /** @lends Collections */
{
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
    
};



