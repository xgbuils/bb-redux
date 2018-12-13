var shallowEqual = require('../src/shallow_equal')

module.exports = function(t) {
    t.test('same reference', function(t) {
        var a = {
            a: {
                b: 3
            },
            c: 4
        }
        t.equals(
            shallowEqual(a, a),
            true
        )
        t.end()
    })
    t.test('falsy values', function(t) {
        t.equals(
            shallowEqual(0, 0),
            true
        )
        t.equals(
            shallowEqual(null, null),
            true
        )
        t.equals(
            shallowEqual(undefined, undefined),
            true
        )
        t.equals(
            shallowEqual('', ''),
            true
        )

        t.equals(
            shallowEqual(0, null),
            false
        )
        t.equals(
            shallowEqual(null, undefined),
            false
        )
        t.equals(
            shallowEqual(undefined, ''),
            false
        )
        t.equals(
            shallowEqual('', 0),
            false
        )

        t.end()
    })
    t.test('numbers', function(t) {
        t.equals(
            shallowEqual(1, 1),
            true,
            'equal numbers must return true'
        )
        t.equals(
            shallowEqual(4, 1),
            false,
            'distinct numbers must return false'
        )
        t.end()
    })
    t.test('strings', function(t) {
        t.equals(
            shallowEqual('foo', 'foo'),
            true,
            'equal strings must return true'
        )
        t.equals(
            shallowEqual('fizz', 'buzz'),
            false,
            'distinct strings with same length must return false'
        )
        t.equals(
            shallowEqual('a', 'aaaaa'),
            false,
            'distinct strings must return false'
        )
        t.end()
    })
    t.test('arrays of primitive types', function(t) {
        t.equals(
            shallowEqual([1, 2, 3, 4], [1, 2, 3, 4]),
            true,
            'equal arrays must return true'
        )
        t.equals(
            shallowEqual([], []),
            true,
            'two empty arrays must return true'
        )
        t.equals(
            shallowEqual([1, 2, 3, 5], [1, 2, 3, 3]),
            false,
            'distinct arrays with same length must return false'
        )
        t.equals(
            shallowEqual(['fizz', 'buzz', 'bar'], ['fizz', 'buzz']),
            false,
            'arrays with different length must return false'
        )
        t.equals(
            shallowEqual([], [5, 3]),
            false,
            'empty array and no empty array must return false'
        )
        t.end()
    })
    t.test('arrays of complex types', function(t) {
        var item1 = {a: 2}
        var item2 = {a: 2}
        t.equals(
            shallowEqual([item1], [item2]),
            false,
            'deep equal arrays must return false if elements are not strictly equal'
        )
        t.equals(
            shallowEqual([item1, item2], [item1, item2]),
            true,
            'if elements are strictly equal then must return true'
        )
        t.end()
    })
    t.test('object of primitive types', function(t) {
        t.equals(
            shallowEqual({
                a: 1,
                b: 'nyan'
            }, {
                a: 1,
                b: 'nyan'
            }),
            true,
            'equal objects must return true'
        )
        t.equals(
            shallowEqual({}, {}),
            true,
            'empty objects must return true'
        )
        t.equals(
            shallowEqual({
                a: 1,
                foo: 'nyan'
            }, {
                a: 1,
                bar: 'nyan'
            }),
            false,
            'objects with different keys must return false'
        )
        t.equals(
            shallowEqual({
                a: 1,
                b: 'nyan'
            }, {
                a: 1,
                b: 'cat'
            }),
            false,
            'objects with different values must return false'
        )
        t.equals(
            shallowEqual({
                a: 1
            }, {
                a: 1,
                b: 2
            }),
            false,
            'if first object misses a key must return false'
        )
        t.equals(
            shallowEqual({
                a: 1,
                b: 2
            }, {
                b: 2
            }),
            false,
            'if second object misses a key must return false'
        )
        var A = function() {
            this.a = 1
            this.b = 2
        }
        A.prototype.c = 3
        var notOwnPropObj = new A()
        t.equals(
            shallowEqual({
                a: 1,
                b: 2
            }, notOwnPropObj),
            true,
            'if the own properties are equal must return true'
        )
        t.end()
    })
    t.test('objects of complex types', function(t) {
        var value1 = {a: 2}
        var value2 = {a: 2}
        t.equals(
            shallowEqual({foo: value1}, {foo: value2}),
            false,
            'deep equal objects must return false if prop values are not strictly equal'
        )
        t.equals(
            shallowEqual({foo: value1}, {foo: value1}),
            true,
            'if prop values are strictly equal then must return true'
        )
        t.equals(
            shallowEqual({
                foo: value1,
                bar: value2
            }, {
                foo: value1,
                bar: value1
            }),
            false,
            'if some prop value is not strictly equal then must return false'
        )
        t.end()
    })
}
