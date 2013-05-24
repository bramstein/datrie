/**
 * @constructor
 */
function Trie(alphabet) {
  this.alphabet = alphabet;

  this.base = [1];
  this.check = [0];
  this.tail = [];
  this.pos = 1;
}

/**
 * Returns true if `word` is in the trie.
 *
 * @param {string} word
 * @return {boolean}
 */
Trie.prototype.contains = function (word) {
  var chars = word.split(''),
      n = 1,
      m = null;

  for (var i = 0; i < chars.length; i += 1) {
    m = this.getBase(n) + this.getCharCode(chars[i]);

    if (this.getCheck(m) !== n) {
      return false;
    }

    if (this.getBase(m) < 0) {
      break;
    }
    n = m;
  }

  return chars[i] === '#' || this.tailEquals(-this.getBase(m), chars, i + 1);
};

/**
 * Returns the tail string starting at `pos`
 * @param {number} pos
 * @return {Array.<string>}
 */
Trie.prototype.getTailString = function (pos) {
  var result = [];

  for (var i = pos - 1; i < this.tail.length; i += 1) {
    result.push(this.tail[i]);

    if (this.tail[i] === '#') {
      break;
    }
  }
  return result;
};

/**
 * Compares the string in the tail at `start` with the
 * string in `chars` starting at `pos`.
 * @param {number} start
 * @param {Array.<string>} chars
 * @param {number} pos
 * @return {boolean}
 */
Trie.prototype.tailEquals = function (start, chars, pos) {
  for (var i = start - 1, k = 0; i < this.tail.length; i += 1, k += 1) {
    if (this.tail[i] !== chars[pos + k]) {
      return false;
    }

    if (this.tail[i] === '#') {
      break;
    }
  }
  return true;
};

Trie.prototype.x_check = function (list) {
  var q = 1;

  while (true) {
    var found = false;

    for (var c = 0; c < list.length; c += 1) {
      if (this.getCheck(q + list[c])) {
        found = true;
        break;
      }
    }

    if (!found) {
      break;
    }
    q += 1;
  }
  return q;
};

/**
 * @param {Array.<string>} str
 * @param {number} pos
 * @param {number} start
 */
Trie.prototype.writeTail = function (str, pos, start) {
  for (var i = start + 1, k = 0; i < str.length; i += 1, k += 1) {
    this.tail[pos - 1 + k] = str[i];

    if (str[i] === '#') {
      break;
    }
  }

  if (pos + k + 1 > this.pos) {
    this.pos = pos + k + 1;
  }
};

Trie.prototype.findArcs = function (n) {
  var result = [];

  for (var c in this.alphabet) {
    if (this.getCheck(this.getBase(n) + this.getCharCode(c)) === n) {
      result.push(this.getCharCode(c));
    }
  }
  return result;
};

Trie.prototype.relocateBase = function (n, m, chars, i) {
  var temp_node1 = n,
      listA = this.findArcs(n),
      listB = this.findArcs(this.getCheck(m)),

      node = listA.length + 1 < listB.length ? n : this.getCheck(m),
      list = listA.length + 1 < listB.length ? listA : listB;

  var temp_base = this.getBase(node);

  this.setBase(node, this.x_check(list));

  for (var j = 0; j < list.length; j += 1) {
    var temp_node1 = temp_base + list[j],
        temp_node2 = this.getBase(node) + list[j];

    this.setBase(temp_node2, this.getBase(temp_node1));
    this.setCheck(temp_node2, node);

    if (this.getBase(temp_node1) > 0) {
      var w = node;

      for (; w < this.check.length; w += 1) {
        if (this.getCheck(this.getBase(temp_node1) + w) === temp_node1) {
          break;
        }

      }
      this.setCheck(this.getBase(temp_node2) + w, temp_node2);
    }
    this.setBase(temp_node1, 0);
    this.setCheck(temp_node1, 0);
  }
  var temp_node = this.getBase(n) + this.getCharCode(chars[i]);
  this.setBase(temp_node, -this.pos);
  this.setCheck(temp_node, n);
  this.writeTail(chars, this.pos, i);
};

Trie.prototype.insert = function (word) {
  var chars = word.split(''),
      n = 1,
      m = null;

  for (var i = 0; i < chars.length; i += 1) {
    m = this.getBase(n) + this.getCharCode(chars[i]);

    if (this.getCheck(m) !== n) {
      if (this.getCheck(m) !== 0) {
        this.relocateBase(n, m, chars, i);
      } else {
        this.setBase(m, -this.pos);
        this.setCheck(m, n);
        this.writeTail(chars, this.pos, i);
      }
      return;
    }

    if (this.getBase(m) < 0) {
      break;
    }

    n = m;
  }

  if (chars[i] === '#' || this.tailEquals(-this.getBase(m), chars, i + 1)) {
    return;
  }

  if (this.getBase(m) !== 0) {
    this.insertTail(m, -this.getBase(m), chars, i + 1);
  }
};

Trie.prototype.getBase = function (pos) {
  return this.base[pos - 1] || 0;
};

Trie.prototype.getCheck = function (pos) {
  return this.check[pos - 1] || 0;
};

Trie.prototype.setBase = function (pos, value) {
  this.base[pos - 1] = value;
};

Trie.prototype.setCheck = function (pos, value) {
  this.check[pos - 1] = value;
};

Trie.prototype.getCharCode = function (c) {
  return this.alphabet[c];
};

Trie.prototype.insertTail = function (n, tailPos, chars, i) {
  var tempBase = -this.getBase(n);

  for (var j = tailPos - 1, k = 0; j < this.tail.length; j += 1, k += 1) {
    var tailChar = this.getCharCode(this.tail[j]),
        wordChar = this.getCharCode(chars[i + k]);

    if (tailChar === wordChar) {
      this.setBase(n, this.x_check([tailChar]));
      this.setCheck(this.getBase(n) + tailChar, n);
      n = this.getBase(n) + tailChar;
    } else {
      this.setBase(n, this.x_check([tailChar, wordChar]));

      var q = this.getBase(n) + tailChar;
      this.setBase(q, -tempBase);
      this.setCheck(q, n);
      this.writeTail(this.tail, tempBase, j);

      var q = this.getBase(n) + wordChar;
      this.setBase(q, -this.pos);
      this.setCheck(q, n);
      this.writeTail(chars, this.pos, i + j);
      break;
    }

    if (this.tail[j] === '#') {
      break;
    }
  }
};

Trie.prototype.remove = function (word) {
  var chars = word.split(''),
      n = 1,
      m = null;

  for (var i = 0; i < chars.length; i += 1) {
    m = this.getBase(n) + this.getCharCode(chars[i]);

    if (this.getBase(m) < 0) {
      break;
    }
    n = m;
  }

  if (chars[i] === '#' || this.tailEquals(-this.getBase(m), chars, i + 1)) {
    this.setBase(m, 0);
    this.setCheck(m, 0);
  }
};

Trie.prototype.toString = function () {
  return JSON.stringify({
    base: this.base,
    check: this.check,
    tail: this.tail,
    pos: this.pos
  }, null, 2);
};

module.exports = Trie;
