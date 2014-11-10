## Double Array Trie library

**Note: this is a work in progress**

This library implements a double array trie in JavaScript. Nested JavaScript object tries are easy to build but take up large amounts of memory and need to be serialized and deserialized when sending them over the wire. A double array trie consists of three fixed size arrays which can be efficiently stored and transmitted.

    var Trie = require('datrie');

   
    var trie = new Trie({
      '#': 1,
      'a': 2,
      'b': 3,
      'c': 4,
      'd': 5,
      'k': 6
    });

    trie.insert('bad#');
    trie.insert('back#');

    trie.contains('bad#); // true
    trie.contains('back#'); // true
    trie.contains('hello'); // false

    trie.remove('back#');
    trie.contains('back#'); // false

## Installation

    $ npm install datrie

## License

This library is licensed under the three clause BSD license.
