var test = require('tape')
var tapSpec = require('tap-spec')
var shallowEqual = require('./shallow_equal')
var backboneRedux = require('./backbone_redux')

test('shallow equal', shallowEqual)
test('backbone redux connect', backboneRedux)

test.createStream()
    .pipe(tapSpec())
    .pipe(process.stdout)
