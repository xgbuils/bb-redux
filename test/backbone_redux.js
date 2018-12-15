var sinon = require('sinon')
var runJsdom = require('./helpers/run_jsdom')
runJsdom()
var jQuery = require('jquery')
var Backbone = require('backbone')
var backboneRedux = require('../src/')
Backbone.$ = jQuery

var CONSTRUCTOR_PROP_VALUE = 'constructor prop'

var firstArg = function(fake) {
    return fake.getCall(0).args[0]
}

var ViewExample = Backbone.View.extend({
    initialize: function() {
        this.constructorProp = CONSTRUCTOR_PROP_VALUE
        this.renderCount = 0
        this.template = sinon.fake()
    },
    render: function() {
        return this.template(this.props)
    }
})

var reducer = function(state, action) {
    if (state === undefined) {
        return {
            user: {
                name: 'John',
                lastName: 'Doe'
            },
            items: [{
                name: 'orange',
                pieces: 2
            }, {
                name: 'banana',
                pieces: 5
            }]
        }
    }
    switch (action.type) {
    case 'CHANGE_USER':
        return {
            user: action.user,
            items: state.items
        }
    case 'INCREASE_PIECES':
        return {
            user: state.user,
            items: state.items.map(function(item, index) {
                return {
                    name: item.name,
                    pieces: index === action.index ? item.pieces + 1 : item.pieces
                }
            })
        }
    default:
        return state
    }
}

var storeMock = function() {
    var callback
    var state = reducer()
    return {
        getState: function() {
            return state
        },
        dispatch: function(action) {
            state = reducer(state, action)
            callback()
        },
        subscribe: function(cb) {
            callback = cb
        }
    }
}

var getUser = function(state) {
    return state.user
}

var getFirstItem = function(state) {
    return state.items[0]
}

var getSecondItem = function(state) {
    return state.items[1]
}

module.exports = function(t) {
    t.test('connected view creation', function(t) {
        t.test('initialize is called', function(t) {
            var store = storeMock()
            var connect = backboneRedux(store).connect
            var ConnectedView = connect(getUser)(ViewExample)
            var view = new ConnectedView()
            t.equals(
                view.constructorProp,
                CONSTRUCTOR_PROP_VALUE,
                'initialize ViewExample method is called'
            )
            t.equals(
                view.template.called,
                false,
                'render is not called'
            )
            t.deepEquals(
                view.props,
                {
                    name: 'John',
                    lastName: 'Doe'
                },
                'initial props are based on mapStateToProps and current state'
            )
            t.end()
        })

        t.test('dispatch action that changes the local props', function(t) {
            t.test('changing the user', function() {
                var store = storeMock()
                var connect = backboneRedux(store).connect
                var ConnectedUserView = connect(getUser)(ViewExample)
                var view = new ConnectedUserView()
                var newUser = {
                    name: 'Jane',
                    lastName: 'Doe'
                }
                view.dispatch({
                    type: 'CHANGE_USER',
                    user: newUser
                })
                t.deepEquals(
                    view.template.calledOnce,
                    true,
                    'render should be called once'
                )
                t.deepEquals(
                    firstArg(view.template),
                    newUser,
                    'template method should receive new view props'
                )
                sinon.restore()
                t.end()
            })

            t.test('increasing number of item pieces', function(t) {
                var store = storeMock()
                var connect = backboneRedux(store).connect
                var ConnectedItemView = connect(getFirstItem)(ViewExample)
                var view = new ConnectedItemView()
                view.dispatch({
                    type: 'INCREASE_PIECES',
                    index: 0
                })
                t.deepEquals(
                    view.template.calledOnce,
                    true,
                    'render should be called once'
                )
                t.deepEquals(
                    firstArg(view.template),
                    {
                        name: 'orange',
                        pieces: 3
                    },
                    'method should receive new view props'
                )
                sinon.restore()
                t.end()
            })
        })

        t.test('dispatch action that DOES NOT change the local props', function(t) {
            t.test('changing the number of item pieces in a user view', function() {
                var store = storeMock()
                var connect = backboneRedux(store).connect
                var ConnectedUserView = connect(getUser)(ViewExample)
                var view = new ConnectedUserView()
                view.dispatch({
                    type: 'INCREASE_PIECES',
                    index: 1
                })
                t.deepEquals(
                    view.template.called,
                    false,
                    'render should not be called once'
                )
                t.deepEquals(
                    view.props,
                    {
                        name: 'John',
                        lastName: 'Doe'
                    },
                    'props remains not changed'
                )
                sinon.restore()
                t.end()
            })

            t.test('changing the user in a item view', function(t) {
                var store = storeMock()
                var connect = backboneRedux(store).connect
                var ConnectedItemView = connect(getSecondItem)(ViewExample)
                var view = new ConnectedItemView()
                var newUser = {
                    name: 'Jane',
                    lastName: 'Doe'
                }
                view.dispatch({
                    type: 'CHANGE_USER',
                    user: newUser
                })
                t.deepEquals(
                    view.template.called,
                    false,
                    'render should not be called'
                )
                t.deepEquals(
                    view.props,
                    {
                        name: 'banana',
                        pieces: 5
                    },
                    'props remains not changed'
                )
                sinon.restore()
                t.end()
            })
        })
    })
}
