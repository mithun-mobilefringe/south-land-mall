import Vue from 'vue'

const _PLUGIN = {
  install: function (Vue, options) {
    // let mixinAttached = false
    let eventApiKey = process.env.BLUESHIFT_EVENT_KEY

    function pageLoad() {
      window._blueshiftid = eventApiKey;
      window.blueshift = window.blueshift || [];
      if (blueshift.constructor === Array) {
        blueshift.load = function () {
          var d = function (a) {
              return function () {
                blueshift.push([a].concat(Array.prototype.slice.call(arguments, 0)))
              }
            },
            e = ["config", "identify", "track", "click", "pageload", "capture", "retarget", "live"];
          for (var f = 0; f < e.length; f++) blueshift[e[f]] = d(e[f])
        };
      }
      blueshift.load();
      blueshift.retarget();
      blueshift.pageload();
      if (blueshift.constructor === Array) {
        (function () {
          var b = document.createElement("script");
          b.type = "text/javascript", b.async = !0, b.src = ("https:" === document.location.protocol ? "https:" : "http:") + "//cdn.getblueshift.com/blueshift.js";
          var c = document.getElementsByTagName("script")[0];
          c.parentNode.insertBefore(b, c);
        })()
      }
    }

    // 1. add global method or property
    const _blueshift = {
      identify: (user) => {
        let data = {
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname
        }

        blueshift.identify(data)
      },

      view: (opts) => {
        blueshift.track('view', opts)
      },

      viewStore: (storeId) => {
        blueshift.track('view', {
          product_id: 'store_' + storeId
        })

        console.log('blueshift -- track store', 'store_' + storeId)
      }
    }

    Vue.blueshift = _blueshift

    Vue.directive('blueshift-visited-store', {
      bind: function (el, binding, vnode) {
        _blueshift.viewStore(binding.value)
      }
    })


    pageLoad()
  }
}

Vue.use(_PLUGIN)
// export default _PLUGIN
