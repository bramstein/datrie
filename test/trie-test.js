var Trie = require('../lib/trie'),
    expect = require('expect.js');

describe('Trie', function () {
  var trie = null;

  beforeEach(function () {
    trie = new Trie({
      '#': 1,
      'a': 2,
      'b': 3,
      'c': 4,
      'd': 5,
      'e': 6,
      'f': 7,
      'g': 8,
      'h': 9,
      'i': 10,
      'j': 11,
      'k': 12,
      'l': 13,
      'm': 14,
      'n': 15,
      'o': 16,
      'p': 17,
      'q': 18,
      'r': 19,
      's': 20,
      't': 21,
      'u': 22,
      'v': 23,
      'w': 24,
      'x': 25,
      'y': 26,
      'z': 27
    });
  });

  it('should have the correct initial state', function () {
    expect(trie.base).to.eql([1]);
    expect(trie.check).to.eql([0]);
    expect(trie.tail).to.eql([]);
    expect(trie.pos).to.eql(1);
  });

  describe('lookup words', function () {
    beforeEach(function () {
      trie.base =  [4, 0, 1, -15, -1, -12, 1, 0, 0, 0, 0, 0, 0, 0, -9];
      trie.check = [0, 0, 7,   3,  3,   3, 1, 0, 0, 0, 0, 0, 0, 0,  1];
      trie.tail = ['h', 'e', 'l', 'o', 'r', '#', null, null, 'a', 'r', '#', 'g', 'e', '#', 'y', '#'];
      trie.pos = 17;
    });

    it('returns true for words that are in the trie', function () {
      expect(trie.contains('bachelor#')).to.be(true);
      expect(trie.contains('jar#')).to.be(true);
      expect(trie.contains('badge#')).to.be(true);
      expect(trie.contains('baby#')).to.be(true);
    });

    it('returns false for words that are not in the trie', function () {
      expect(trie.contains('example#')).to.be(false);
      expect(trie.contains('test#')).to.be(false);
    });

    it('correctly does tail matching', function () {
      expect(trie.contains('back#')).to.be(false);
      expect(trie.contains('jaded#')).to.be(false);
      expect(trie.contains('bac#')).to.be(false);
      expect(trie.contains('ba#')).to.be(false);
    });
  });

  describe('insert a word into an empty trie (case 1)', function () {
    beforeEach(function () {
      trie.insert('bachelor#');
    });

    it('should have the correct internal state', function () {
      expect(trie.base).to.eql([1, , , -1]);
      expect(trie.check).to.eql([0, , , 1]);
      expect(trie.tail).to.eql(['a', 'c', 'h', 'e', 'l', 'o', 'r', '#']);
      expect(trie.pos).to.eql(9);
    });

    it('should have the same internal state after another insert of the same word', function () {
      trie.insert('bachelor#');
      expect(trie.base).to.eql([1, , , -1]);
      expect(trie.check).to.eql([0, , , 1]);
      expect(trie.tail).to.eql(['a', 'c', 'h', 'e', 'l', 'o', 'r', '#']);
      expect(trie.pos).to.eql(9);
    });
  });

  describe('insert a word into the trie without collisions (case 2)', function () {
    beforeEach(function () {
      trie.insert('bachelor#');
      trie.insert('jar#');
    });

    it('should have the correct internal state', function () {
      expect(trie.base).to.eql([1, , , -1, , , , , , , , -9]);
      expect(trie.check).to.eql([0, , , 1, , , , , , , ,  1]);
      expect(trie.tail).to.eql(['a', 'c', 'h', 'e', 'l', 'o', 'r', '#', 'a', 'r', '#']);
      expect(trie.pos).to.eql(12);
    });

    it('should have the correct internal state after another insert of the same word', function () {
      trie.insert('jar#');
      expect(trie.base).to.eql([1, , , -1, , , , , , , , -9]);
      expect(trie.check).to.eql([0, , , 1, , , , , , , ,  1]);
      expect(trie.tail).to.eql(['a', 'c', 'h', 'e', 'l', 'o', 'r', '#', 'a', 'r', '#']);
      expect(trie.pos).to.eql(12);
    });
  });

  describe('insert a word into the trie with a collision but not base relocation (case 3)', function () {
    beforeEach(function () {
      trie.insert('bachelor#');
      trie.insert('jar#');
      trie.insert('badge#');
    });

    it('should have the correct internal state', function () {
      expect(trie.base).to.eql( [1, , 1, 1, -1, -12, , , , , , -9]);
      expect(trie.check).to.eql([0, , 4, 1,  3,   3, , , , , ,  1]);
      expect(trie.tail).to.eql(['h', 'e', 'l', 'o', 'r', '#', 'r', '#', 'a', 'r', '#', 'g', 'e', '#']);
      expect(trie.pos).to.eql(15);
    });

    it('should have the correct internal state after another insert of the same word', function () {
      trie.insert('badge#');
      expect(trie.base).to.eql( [1, , 1, 1, -1, -12, , , , , , -9]);
      expect(trie.check).to.eql([0, , 4, 1,  3,   3, , , , , ,  1]);
      expect(trie.tail).to.eql(['h', 'e', 'l', 'o', 'r', '#', 'r', '#', 'a', 'r', '#', 'g', 'e', '#']);
      expect(trie.pos).to.eql(15);
    });
  });

  describe('insert a word into the trie with a collision and base relocation (case 4)', function () {
    beforeEach(function () {
      trie.insert('bachelor#');
      trie.insert('jar#');
      trie.insert('badge#');
      trie.insert('baby#');
    });

    it('should have the correct internal state', function () {
      expect(trie.base).to.eql( [4, , 1, -15, -1, -12, 1, , , , , 0, , , -9]);
      expect(trie.check).to.eql([0, , 7,   3,  3,   3, 1, , , , , 0, , ,  1]);
      expect(trie.tail).to.eql(['h', 'e', 'l', 'o', 'r', '#', 'r', '#', 'a', 'r', '#', 'g', 'e', '#', 'y', '#']);
      expect(trie.pos).to.eql(17);
    });

    it('should have the correct internal state after another insert of the same word', function () {
      trie.insert('baby#');
      expect(trie.base).to.eql( [4, , 1, -15, -1, -12, 1, , , , , 0, , , -9]);
      expect(trie.check).to.eql([0, , 7,   3,  3,   3, 1, , , , , 0, , ,  1]);
      expect(trie.tail).to.eql(['h', 'e', 'l', 'o', 'r', '#', 'r', '#', 'a', 'r', '#', 'g', 'e', '#', 'y', '#']);
      expect(trie.pos).to.eql(17);
    });
  });

  describe('insert additional words', function () {
    it('should find the words after inserting them', function () {
      trie.insert('bachelor#');
      trie.insert('jar#');
      trie.insert('badge#');
      trie.insert('baby#');
      trie.insert('back#');
      trie.insert('bad#');
      trie.insert('example#');
      trie.insert('lamp#');
      trie.insert('jacket#');

      expect(trie.contains('bachelor#')).to.be(true);
      expect(trie.contains('jar#')).to.be(true);
      expect(trie.contains('badge#')).to.be(true);
      expect(trie.contains('baby#')).to.be(true);
      expect(trie.contains('back#')).to.be(true);
      expect(trie.contains('bad#')).to.be(true);
      expect(trie.contains('example#')).to.be(true);
      expect(trie.contains('lamp#')).to.be(true);
      expect(trie.contains('jacket#')).to.be(true);
    });
  });

  describe('write tail', function () {
    it('should write a simple string to the tail', function () {
      trie.writeTail(['h', 'e', 'l', 'l', 'o', '#'], 1, 0);

      expect(trie.tail).to.eql(['e', 'l', 'l', 'o', '#']);
      expect(trie.pos).to.eql(6);
    });

    it('should not change pos when overwriting the same tail', function () {
      trie.writeTail(['h', 'e', 'l', 'l', 'o', '#'], 1, 0);
      trie.writeTail(['h', 'e', 'l', 'l', 'o', '#'], 1, 0);

      expect(trie.tail).to.eql(['e', 'l', 'l', 'o', '#']);
      expect(trie.pos).to.eql(6);
    });

    it('should handle inserting two tails', function () {
      trie.writeTail(['h', 'e', 'l', 'l', 'o', '#'], 1, 0);
      trie.writeTail(['w', 'o', 'r', 'l', 'd', '#'], trie.pos, 0);

      expect(trie.tail).to.eql(['e', 'l', 'l', 'o', '#', 'o', 'r', 'l', 'd', '#']);
      expect(trie.pos).to.eql(11);
    });

    it('can overwrite itself', function () {
      trie.writeTail(['h', 'e', 'l', 'l', 'o', '#'], 1, 0);
      trie.writeTail(trie.tail, 1, 0);

      expect(trie.tail).to.eql(['l', 'l', 'o', '#', '#']);
      expect(trie.pos).to.eql(6);
    });

    it('can overwrite itself mid-tail', function () {
       trie.writeTail(['h', 'e', 'l', 'l', 'o', '#'], 1, 0);
       var pos = trie.pos;
       trie.writeTail(['w', 'o', 'r', 'l', 'd', '#'], pos, 0);
       trie.writeTail(trie.tail, pos, pos - 1);

      expect(trie.tail).to.eql(['e', 'l', 'l', 'o', '#', 'r', 'l', 'd', '#', '#']);
      expect(trie.pos).to.eql(11);
    });
  });
});
