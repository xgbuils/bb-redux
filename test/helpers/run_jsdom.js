var JSDOM = require('jsdom').JSDOM

module.exports = function run() {
    var dom = new JSDOM()

    var window = dom.window
    var document = window.document

    global.window = window
    global.document = document
}

