!function(global, factory) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = factory(require("angular"), require("vue")) : "function" == typeof define && define.amd ? define("ngVue", [ "angular", "vue" ], factory) : global.ngVue = factory(global.angular, global.Vue);
}(this, function(angular, Vue) {
    "use strict";
    function addHooks(map, hooks) {
        hooks && Object.keys(hooks).forEach(function(h) {
            map[h] = map[h] ? map[h] : [], map[h].push(hooks[h]);
        });
    }
    function callHooks(map, name, callback) {
        var hooks = map[name];
        hooks && hooks.forEach(callback);
    }
    function createVueHooksMap(hookCallback) {
        return Object.keys(vueHooks).reduce(function(available, name) {
            return _extends({}, available, defineProperty({}, name, function() {
                var _cb = hookCallback.bind(this);
                callHooks(vueHooks, name, _cb);
            }));
        }, {});
    }
    function ngVueProvider($injector) {
        var _this = this, _inQuirkMode = !1, vuexStore = void 0;
        this.activeQuirkMode = function() {
            _inQuirkMode = !0;
        }, this.enableVuex = function(store) {
            vuexStore = store;
        }, this.install = function(plugin) {
            var _plugin = plugin($injector), $name = _plugin.$name, $config = _plugin.$config, $plugin = _plugin.$plugin, $vue = _plugin.$vue;
            addHooks(pluginHooks, $plugin), addHooks(vueHooks, $vue), angular.extend(_this, defineProperty({}, $name, $config));
        }, this.$get = [ "$injector", function($injector) {
            var cb = function(hook) {
                hook($injector, Vue, this);
            };
            callHooks(pluginHooks, "init", cb);
            var vueHooks = createVueHooksMap(cb);
            return {
                getVueHooks: function() {
                    return vueHooks;
                },
                getVuexStore: function() {
                    return vuexStore;
                },
                inQuirkMode: function() {
                    return _inQuirkMode;
                }
            };
        } ];
    }
    function addFilter(name, filter) {
        registered[name] = filter;
    }
    function resolveStringFilters($injector) {
        var $filter = $injector.get("$filter");
        lazyStringFilters.forEach(function(name) {
            addFilter(name, $filter(name));
        }), lazyStringFilters = [];
    }
    function registerFilters(filters) {
        angular.isArray(filters) ? lazyStringFilters = lazyStringFilters.concat(filters) : angular.isObject(filters) && Object.keys(filters).forEach(function(name) {
            addFilter(name, filters[name]);
        });
    }
    var angular__default = "default" in angular ? angular.default : angular;
    Vue = "default" in Vue ? Vue.default : Vue;
    var defineProperty = function(obj, key, value) {
        return key in obj ? Object.defineProperty(obj, key, {
            value: value,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : obj[key] = value, obj;
    }, _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }, pluginHooks = Object.create(null), vueHooks = Object.create(null);
    angular__default.module("ngVue.plugins", []).provider("$ngVue", [ "$injector", ngVueProvider ]);
    var registered = Object.create(null), lazyStringFilters = [], ngFilters = function(Vue$$1) {
        Object.keys(registered).forEach(function(name) {
            return Vue$$1.filter(name, registered[name]);
        });
    }, onPluginInit = function($injector, Vue$$1) {
        resolveStringFilters($injector), Vue$$1.use(ngFilters);
    };
    return angular__default.module("ngVue.plugins").config([ "$ngVueProvider", function($ngVueProvider) {
        $ngVueProvider.install(function() {
            return {
                $name: "filters",
                $config: {
                    register: registerFilters
                },
                $plugin: {
                    init: onPluginInit
                }
            };
        });
    } ]);
});
