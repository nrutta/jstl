
var _jstl={util:{},algorithms:{}};(function(){var root=this;var previousJstl=root.jstl;if(typeof module!=='undefined'&&module.exports){module.exports=_jstl;jstl.jstl=_jstl;}else{root['jstl']=_jstl;}
jstl.VERSION='0.0.1';})();_jstl.util.Collections={sort:function(list,comparator){var arr=list.toArray(),i;function merge(lista,listb){var lena=lista.length,lenb=listb.length,arr=[];idxa=0,idxb=0;while(idxa<lena&&idxb<lenb){if(lista[idxa]<listb[idxb])
arr.push(lista[idxa++]);else
arr.push(listb[idxb++]);}
while(idxa<lena)
arr.push(lista[idxa++]);while(idxb<lenb)
arr.push(listb[idxb++]);return arr;}
function mergeSort(list){if(list.length<=1)
return list;var half=Math.ceil(list.length/2);var first=list.slice(0,half);var second=list.slice(half);return merge(mergeSort(first),mergeSort(second));}
list.clear();debugger;arr=mergeSort(arr);for(i=0;i<arr.length;i++)
list.add(arr[i]);return list;}};_jstl.util.Comparator=(function()
{var StringComparator={compare:function(e1,e2){if(e1===e2)return 0;else if(e1<=e2)return-1;else return 1;},equals:function(e1,e2){return(e1===e2);}};var NumberComparator={compare:function(e1,e2){if(e1===e2)return 0;else if(e1<=e2)return-1;else return 1;},equals:function(e1,e2){return(e1===e2);}};var BooleanComparator={compare:function(e1,e2){if(e1===e2)return 0;else if(e1<=e2)return-1;else return 1;},equals:function(e1,e2){return(e1===e2);}};Comparator=function(cfg){var config=cfg||{};this.assertType=config.assertType||null;this.comparator=config.comparator||null;if(this.comparator){if(typeof this.comparator!="object"){throw new jstl.Exception('ComparatorException','Comparator does not exist');}
else if(!this.comparator.compare||typeof this.comparator.compare!="function"){throw new jstl.Exception('ComparatorException','Comparator does not have a valid compare function');}
else if(!this.comparator.equals||typeof this.comparator.equals!="function"){throw new jstl.Exception('ComparatorException','Comparator does not have a valid equals function');}}
if(this.assertType){if(typeof this.assertType=="string"){if(this.assertType=="string")
this.comparator=StringComparator;else if(this.assertType=="number")
this.comparator=NumberComparator;else if(this.assertType=="boolean")
this.comparator=BooleanComparator}
else if(typeof this.assertType=="object"){this.propertyType=this.assertType["type"];}}}
Comparator.prototype.assertElementType=function(e){if(!this.assertType)
return true;if(this.assertType===typeof e){if(this.assertType==='object'){}
return true;}
throw new jstl.Exception('ClassCastException','Element type ['+typeof e+'] does not match asserted type ['+this.assertType+']');}
Comparator.prototype.getEqualsFunction=function(){return(this.comparator)?this.comparator.equals:null;};Comparator.prototype.getCompareFunction=function(){return(this.comparator)?this.comparator.compare:null;};return Comparator;})();(function(){Iterator=function(){}
Iterator.prototype.hasNext=function(){throw new jstl.Exception('UnsupportedException','Iterator interface does not provide hasNext implementation');}
Iterator.prototype.hasPrevious=function(){throw new jstl.Exception('UnsupportedException','Iterator interface does not provide hasPrevious implementation');}
Iterator.prototype.next=function(){throw new jstl.Exception('UnsupportedException','Iterator interface does not provide next implementation');}
Iterator.prototype.nextIndex=function(){throw new jstl.Exception('UnsupportedException','Iterator interface does not provide nextIndex implementation');}
Iterator.prototype.previous=function(){throw new jstl.Exception('UnsupportedException','Iterator interface does not provide previous implementation');}
Iterator.prototype.previousIndex=function(){throw new jstl.Exception('UnsupportedException','Iterator interface does not provide previousIndex implementation');}
_jstl.util.Iterator=Iterator;})();(function(){function TreeNode(v,prev,next){this.value=v||null;this.level=null;this.left=prev||null;this.right=next||null;this.parent=null;}
TreeNode.prototype.getLevel=function(){return this.level;};TreeNode.prototype.getLeft=function(){return this.left;};TreeNode.prototype.getRight=function(){return this.left;};TreeNode.prototype.getValue=function(){return this.value;};TreeNode.prototype.setLeft=function(n){this.left=n;return this;};TreeNode.prototype.setRight=function(n){this.right=n;return this;};function BinaryTreeIterator(tree){this.tree=tree;this.currentNode=undefined;};BinaryTreeIterator.prototype.hasNext=function(){var save=this.currentNode;var nxt=this.next();this.currentNode=save;return(nxt)?true:false;};BinaryTreeIterator.prototype.hasPrevious=function(){var cursize=this.list.size();if(cursize!=0&&this.cursorPosition>0)
return true;else
return false;};BinaryTreeIterator.prototype.next=function(){var ptr,parent;if(this.currentNode===undefined){for(ptr=this.tree.root;ptr;ptr=ptr.left){if(ptr.left===null){this.currentNode=ptr;break;}}
if(this.currentNode===undefined){return null;}}
else if(this.currentNode===null){return null;}
else if(this.currentNode.right){for(ptr=this.currentNode.right;;){if(ptr.left){ptr=ptr.left;}
else if(ptr.right){ptr=ptr.right;}
else{this.currentNode=ptr;break;}}}
else{for(ptr=this.currentNode;ptr.parent;ptr=ptr.parent){if(ptr.parent.left===ptr){this.currentNode=ptr.parent;break;}}
if(ptr.parent===null){this.currentNode=null;}}
return(this.currentNode)?this.currentNode.getValue():null;};BinaryTreeIterator.prototype.previous=function(){var ptr,parent;if(this.currentNode===undefined){return null;}
else if(this.currentNode===null){for(ptr=this.tree.root;ptr;ptr=ptr.right){if(ptr.right===null){this.currentNode=ptr;break;}}
if(this.currentNode==null){return null;}}
else if(this.currentNode.left){for(ptr=this.currentNode.left;ptr;ptr=ptr.right){if(ptr.right===null){this.currentNode=ptr;break;}}}
else{for(ptr=this.currentNode;ptr.parent;ptr=ptr.parent){if(ptr.parent.right===ptr){this.currentNode=ptr.parent;break;}}
if(ptr.parent===null){this.currentNode=undefined;}}
return(this.currentNode)?this.currentNode.getValue():null;};function BinaryTree(cfg){var config=cfg||{};this.root=null;this.maxLevel=0;this.current=null;this.comparator=new _jstl.util.Comparator(config);this.count=0;}
BinaryTree.prototype.add=function(o){return this.insert(o);};BinaryTree.prototype.clear=function(){this.root=new TreeNode();this.current=null;this.count=0;return undefined;};BinaryTree.prototype.contains=function(o){if(this.get(o)!==null)
return true;else
return false;};BinaryTree.prototype.get=function(o){var ptr;function preorder(node,o){var val;if(node===null)
return null;val=node.getValue();cmp=comparator.compare(val,o);if(cmp===0)
return node;if(cmp===1){return preorder(node.left,o);}
else{return preorder(node.right,o);}}};BinaryTree.prototype.insert=function(o){var compareFunc=this.comparator.getCompareFunction();this.comparator.assertElementType(o);if(this.root==null){this.root=new TreeNode(o);return true;}
for(var ptr=this.root;;){if(compareFunc(o,ptr.getValue())<=0){if(ptr.left===null){ptr.left=new TreeNode(o);ptr.left.parent=ptr;break;}
else{ptr=ptr.left;}}
else{if(ptr.right===null){ptr.right=new TreeNode(o);ptr.right.parent=ptr;break;}
else{ptr=ptr.right;}}}
return true;};BinaryTree.prototype.isEmpty=function(){return this.size()===0;}
BinaryTree.prototype.iterator=function(){return new BinaryTreeIterator(this);};BinaryTree.prototype.remove=function(i){var ptr;if(i==undefined||i<0||i>=this.size())
throw new jstl.Exception('IndexOutOfBoundsException','Index '+i+' is out of range');ptr=findByIndex(this,i);if(ptr.prev)
ptr.prev.next=ptr.next;else
this.head=ptr.next;if(ptr.next)
ptr.next.prev=ptr.prev;else
this.tail=ptr.prev;this.count-=1;return ptr.value;};BinaryTree.prototype.size=function(){return this.count;};BinaryTree.prototype.traverse=function(order,cb){function preorder(node){cb(node.getValue());if(node.left)preorder(node.left);if(node.right)preorder(node.right);}
function inorder(node){if(node.left)inorder(node.left);cb(node.getValue());if(node.right)inorder(node.right);}
function postorder(node){if(node.left)postorder(node.left);if(node.right)postorder(node.right);cb(node.getValue());}
function depth(rootnode){var arr=[rootnode];while(arr.length!=0){var node=arr.shift();cb(node.getValue());if(node.left)arr.push(node.left);if(node.right)arr.push(node.right);}}
if(typeof order==="string"){order=order.toLowerCase();}
if(order==="preorder"||order===-1){preorder(this.root);}else if(order==="postorder"||order===1){postorder(this.root);}else if(order==="depth"){depth(this.root);}
else{inorder(this.root);}};BinaryTree.prototype.toArray=function(){var size=this.size(),arr=[size],ptr,i;for(i=0,ptr=this.head;i<size;ptr=ptr.next,i++){arr[i]=ptr.value;}
return arr;};_jstl.util.BinaryTree=BinaryTree;}());(function(){_jstl.Exception=function(name,desc,data){this.name=name||'jstlException';this.description=desc||'an exception has occurred';this.data=data||null;}})();(function(){function findByIndex(list,i){var k,ptr=list.head,size=list.size();for(var k=0;k<=size;k++){if(k===i)
return ptr;else
ptr=ptr.next;}
return null;}
function _Element(v,prev,next){this.value=v||null;this.prev=prev||null;this.next=next||null;}
ListIterator=function(list){this.list=list;this.cursorPosition=0;}
ListIterator.prototype.hasNext=function(){var cursize=this.list.size();if(cursize!=0&&this.cursorPosition<cursize)
return true;else
return false;}
ListIterator.prototype.hasPrevious=function(){var cursize=this.list.size();if(cursize!=0&&this.cursorPosition>0)
return true;else
return false;}
ListIterator.prototype.next=function(){var cursize=this.list.size();var obj;if(cursize==0||this.cursorPosition>=cursize)
throw new jstl.Exception('NoSuchElementException','Iterator is at the end of the list');obj=this.list.get(this.cursorPosition);this.cursorPosition+=1;return obj;}
ListIterator.prototype.nextIndex=function(){var cursize=this.list.size();if(cursize==0||this.cursorPosition>=cursize)
return cursize;return cursorPosition;}
ListIterator.prototype.previous=function(){var cursize=this.list.size();var obj;if(cursize==0||this.cursorPosition<=0)
throw new jstl.Exception('NoSuchElementException','Cannot get element before beginning cursor position');obj=this.list.get(this.cursorPosition);this.cursorPosition-=1;return obj;}
ListIterator.prototype.previousIndex=function(){var cursize=this.list.size();if(cursize==0||this.cursorPosition<=0)
return-1;return cursorPosition;}
LinkedList=function(cfg){cfg=cfg||{};this.count=0;this.head=null;this.tail=null;this.comparator=new _jstl.util.Comparator(cfg);}
LinkedList.prototype.add=function(o,i){var elem,ptr;this.comparator.assertElementType(o);if(i===undefined)
return this.addLast(o);else{if(i<0||i>=this.size())
throw new jstl.Exception('IndexOutOfBoundsException','Index '+i+' is out of range');ptr=findByIndex(this,i);elem=new _Element(o,ptr.prev,ptr);ptr.prev.next=elem;ptr.prev=elem;this.count+=1;return true;}};LinkedList.prototype.addFirst=function(o){var elem=new _Element(o,null,this.head);if(this.head)
this.head.prev=elem;this.head=elem;this.count+=1;return true;};LinkedList.prototype.addLast=function(o){var elem=new _Element(o,this.tail,null);if(!this.head)
this.head=elem;if(this.tail)
this.tail.next=elem;this.tail=elem;this.count+=1;return true;}
LinkedList.prototype.clear=function(){this.head=null;this.tail=null;this.count=0;return undefined;};LinkedList.prototype.contains=function(o){var ptr;if(typeof o=="object"){for(ptr=this.head;ptr;ptr=ptr.next){if(ptr.value.equals(o))
return true;}}
else{for(ptr=this.head;ptr;ptr=ptr.next){if(ptr.value===o)
return true;}}
return false;};LinkedList.prototype.get=function(i){var ptr;if(i==undefined||i<0||i>=this.size())
throw new jstl.Exception('IndexOutOfBoundsException','Index '+i+' is out of range');ptr=findByIndex(this,i);return ptr.value;};LinkedList.prototype.indexOf=function(o){var idx,ptr;if(typeof o=="object"){for(idx=0,ptr=this.head;ptr;idx+=1,ptr=ptr.next){if(ptr.value.equals(o))
return idx;}}
else{for(idx=0,ptr=this.head;ptr;idx+=1,ptr=ptr.next){if(ptr.value===o)
return idx;}}
return-1;}
LinkedList.prototype.isEmpty=function(){return this.size()===0;}
LinkedList.prototype.iterator=function(){return new ListIterator(this);}
LinkedList.prototype.lastIndexOf=function(o){var idx=this.size()-1,ptr;if(typeof o=="object"){for(ptr=this.tail;ptr;idx-=1,ptr=ptr.prev){if(ptr.value.equals(o))
return idx;}}
else{for(ptr=this.tail;ptr;idx-=1,ptr=ptr.prev){if(ptr.value===o)
return idx;}}
return-1;}
LinkedList.prototype.remove=function(i){var ptr;if(i==undefined||i<0||i>=this.size())
throw new jstl.Exception('IndexOutOfBoundsException','Index '+i+' is out of range');ptr=findByIndex(this,i);if(ptr.prev)
ptr.prev.next=ptr.next;else
this.head=ptr.next;if(ptr.next)
ptr.next.prev=ptr.prev;else
this.tail=ptr.prev;this.count-=1;return ptr.value;}
LinkedList.prototype.removeFirst=function(){return this.remove(0);}
LinkedList.prototype.removeLast=function(){return this.remove(this.size()-1);}
LinkedList.prototype.size=function(){return this.count;}
LinkedList.prototype.toArray=function(){var size=this.size(),arr=[size],ptr,i;for(i=0,ptr=this.head;i<size;ptr=ptr.next,i++){arr[i]=ptr.value;}
return arr;}
_jstl.util.LinkedList=LinkedList;})();_jstl.util.Queue=(function(){"use strict";function Queue(cfg){var config=cfg||{};this.max=null;if(typeof config.max==='number'){if(config.max<=0){throw new jstl.Exception('QueueException','Maximum count for queue must be greater than 0');}
this.max=config.max;}
this.q=new _jstl.util.LinkedList(config);if(this.q===null){throw new jstl.Exception('QueueException','Error creating Queue');}}
Queue.prototype.add=function(e){if(this.max&&(this.q.size()>=this.max)){throw new jstl.Exception('QueueException','Maximum number of elements ['+this.max+'] already in queue');}
if(!this.q.add(e)){throw new jstl.Exception('QueueException','Unable to add element to the queue');}
return true;};Queue.prototype.element=function(){var e;if(this.q.size()===0){throw new jstl.Exception('QueueException','Cannot retrieve element at front of an empty queue');}else{e=this.q.get(0);if(!e){throw new jstl.Exception('QueueException','Cannot retrieve element from queue');}else{return e;}}};Queue.prototype.empty=function(){if(!this.q.clear()){throw new jstl.Exception('QueueException','Unable to clear queue');}
return true;};Queue.prototype.offer=function(e){if(this.max&&(this.q.size()>=this.max)){return false;}
if(!this.q.add(e)){return false;}
return true;};Queue.prototype.peek=function(){var e;if(this.q.size()===0||((e=this.q.get(0))===null)){return null;}else{return e;}};Queue.prototype.poll=function(){var e;if((e=this.q.remove(0))===null){return null;}else{return e;}};Queue.prototype.remove=function(){var e;if((e=this.q.remove(0))===null){throw new jstl.Exception('QueueException','Unable to remove element from the queue');}else{return e;}};return Queue;}());_jstl.util.Stack=(function(){function Stack(){this._stack=new _jstl.util.LinkedList();}
Stack.prototype.empty=function(){this._stack.clear();return this;}
Stack.prototype.peek=function(){if(this._stack.size()===0){return null;}
else{return this._stack.get(0);}};Stack.prototype.pop=function(){if(this._stack.size()===0){return null;}
else{return this._stack.remove(0);}};Stack.prototype.push=function(item){if(item){this._stack.add(item);}};Stack.prototype.search=function(){throw new jstlException('StackException','Search method is not yet supported');}
return Stack;})();