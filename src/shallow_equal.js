var objectShallowEqual = function(a, b) {
    var aKeys = Object.keys(a)
    var bKeys = Object.keys(b)
    var length = aKeys.length

    if (length !== bKeys.length) {
        return false
    }

    for (var i = 0; i < length; ++i) {
        var key = aKeys[i]
        if (a[key] !== b[key]) {
            return false
        }
    }

    return true
}

var arrayShallowEqual = function(a, b) {
    var length = a.length
    if (length !== b.length) {
        return false
    }

    for (var i = 0; i < length; ++i) {
        if (a[i] !== b[i]) {
            return false
        }
    }
    return true
}

module.exports = function shallowEqual(a, b) {
    if (a === b) {
        return true
    } else if (!a || !b) {
        return false
    } else if (Array.isArray(a) && Array.isArray(b)) {
        return arrayShallowEqual(a, b)
    } else if (typeof a === 'object' && typeof b === 'object') {
        return objectShallowEqual(a, b)
    }
    return false
}
