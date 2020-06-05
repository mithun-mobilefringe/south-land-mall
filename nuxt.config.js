const pkg = require('./package')

const webpack = require('webpack')
const axios = require('axios')
const MM_API_URL = "https://api.mallmaverickstaging.com/properties/299/"
const MM_API_HOST = 'https://api.mallmaverickstaging.com'
const API_KEY = "6c36171ab3f3b2c5b734ac841bc078b4"

module.exports = {
    mode: 'spa',
    /* Headers of the page */
    head: {
        title: pkg.name,
        htmlAttrs: {
            lang: 'en-US',
        },
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: pkg.description },
            { name: 'author', content: '' }, //UPDTAE AUTHOR
            { name: 'application-name', content: '' }, //UPDATE APPLICATION NAME
            { hid: 'twitter', name: 'twitter:card', content: 'summary' },
            { hid: 'og:type', name: 'og:type', content: 'website' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css?family=Work+Sans&display=swap',
                async: true
            },
            {
                rel: 'stylesheet',
                href: 'https://db.onlinewebfonts.com/c/4205c9bb224d820c7ba373ac31387d2c?family=Pistilli',
                async: true
            },
        ]
    },

    /* Set your environment variables here */
    env: {
        MM_API_URL: MM_API_URL,
        MM_API_HOST: MM_API_HOST,
        API_KEY: API_KEY
    },
    /* Customize the progress-bar color */
    loading: {
        color: '#FFFFFF',
        height: '5px'
    },

    /* Custom loading page */
    /*
    loadingIndicator: {
      name: '~/assets/loading.html',
      color: '#000',
      background: 'white'
    },
    */
    /*
     ** Customize the progress-bar color
     */
    router: {
        scrollBehavior: function(to, from, savedPosition) {
            if (!(to.query && to.query.type)) {
                return {
                    x: 0,
                    y: 0
                }
            }
        },
        // middleware: ['redirect']
    },

    /* Global CSS */
    css: [
        '~/node_modules/vue2-animate/dist/vue2-animate.min.css',
        '~/assets/stylesheets/styles.scss',
        '~/assets/stylesheets/main.scss',
    ],

    /* Plugins to load before mounting the App */
    plugins: [
        '~/plugins/es6-shim.js',
        '~/plugins/init-data.js',
        '~/plugins/vue-moment.js',
        '~/plugins/main.js',
        '~/plugins/vue-smooth-scroll.js',
        '~/plugins/vue-lazyload.js',
        '~/plugins/vue-blueshift.js',
        '~/plugins/vue-cookieconsent-component.js',
        '~/plugins/vee-validate.js',
        '~/plugins/global.js',
        '~/plugins/vue-masonry.js',
        '~/plugins/vue-elevator.js'
    ],

    /* Nuxt.js modules */
    modules: [,
        // Doc: https://bootstrap-vue.js.org/docs/
        'bootstrap-vue/nuxt',
        'nuxt-vuex-router-sync',
        '@nuxtjs/font-awesome',
        '@nuxtjs/google-analytics',
        '@nuxtjs/sitemap', ['nuxt-i18n', {
            locales: [{
                    code: 'en',
                    iso: 'en-CA',
                    name: 'English',
                    file: 'en.js'
                },
                {
                    code: 'fr',
                    iso: 'fr-CA',
                    name: 'Français',
                    file: 'fr.js'
                }
            ],
            defaultLocale: 'en',
            lazy: true,
            langDir: 'locales/',
            detectBrowserLanguage: {
                useCookie: true,
                cookieKey: 'i18n_redirected'
            },
            vueI18n: {
                fallbackLocale: 'en'
            },
            parsePages: false
        }]
    ],

    /* Google Analytics */
    'google-analytics': {
        id: ''
    },

    /* Sitemap Configuration */
    sitemap: {
        generate: true,
        hostname: "", // UPDATE HOST NAME
        routes() {
            return axios.get(API_URL + '/seo.json')
                .then(res => res.data.meta_data.filter(md => { if (md.path != null && md.path != undefined) return true }).map(md => md.path).sort().map((currRoute) => {
                    return {
                        url: currRoute,
                        changefreq: 'daily',
                        priority: 1,
                        lastmodISO: new Date().toISOString()
                    }
                }))
        }
    },

    /* Build configuration */
    build: {
        /* You can extend webpack config here */
        extend(config, ctx) {

        },
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                _: 'lodash'
                    // ...etc.
            })
        ]
    }
}