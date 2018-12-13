var shallowEqual = require('./shallow_equal')

module.exports = function(store) {
    return {
        connect: function(mapStateToProps) {
            return function(View) {
                return View.extend({
                    initialize: function(options) {
                        var view = this
                        store.subscribe(function() {
                            var newProps = mapStateToProps(store.getState(), options)
                            if (!shallowEqual(newProps, view.props)) {
                                view.props = newProps
                                view.render()
                            }
                        })
                        view.props = mapStateToProps(store.getState(), options)
                        View.prototype.initialize.call(view, options)
                    },
                    dispatch: function(action) {
                        store.dispatch(action)
                    }
                })
            }
        }
    }
}
