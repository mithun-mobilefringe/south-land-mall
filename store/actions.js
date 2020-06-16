import types from "./mutation_types";
import Cookies from "js-cookie";
import axios from "./axios";
import Vue from 'vue'

const actions = {
    getMMData: function({
        state,
        commit
    }, {
        resource,
        queryParams = null
    }) {
        return new Promise((resolve, reject) => {
            let load_resource = ''
            if (resource == 'stores') {
                load_resource = 'stores/list'
            } else {
                load_resource = resource
            }
            axios
                .get(load_resource + "?api_key=" + process.env.API_KEY, {
                    params: queryParams
                })
                .then(response => {
                    switch (resource) {
                        case "":
                            commit(types.SET_PROPERTY, {
                                property: response.data
                            });
                            break;
                        case "homepage":
                            commit(types.SET_HOMEPAGE, {
                                homepage: response.data
                            });
                            break;
                        case "banners":
                            commit(types.SET_BANNERS, {
                                banners: response.data
                            });
                            break;
                        case "galleries":
                            commit(types.SET_REPOS, {
                                repos: response.data
                            });
                            break;
                        case "stores":
                            commit(types.SET_STORES, {
                                stores: response.data
                            });
                            break;
                        case "promotions":
                            commit(types.SET_PROMOTIONS, {
                                promotions: response.data
                            });
                            break;
                        case "events":
                            commit(types.SET_EVENTS, {
                                events: response.data
                            });
                            break;
                        case "jobs":
                            commit(types.SET_JOBS, {
                                jobs: response.data
                            });
                            break;
                        case "categories":
                            commit(types.SET_CATEGORIES, {
                                categories: response.data
                            });
                            break;
                        case "pages":
                            commit(types.SET_PAGES, {
                                pages: response.data
                            });
                            break;
                        case "news":
                            commit(types.SET_NEWS, {
                                news: response.data
                            });
                            break;
                        case "hours":
                            commit(types.SET_HOURS, {
                                hours: response.data
                            });
                            break;
                        case "blogs":
                            commit(types.SET_BLOGS, {
                                blogs: response.data
                            });
                            break;
                    }
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    LOAD_SEO: function({
        state,
        commit
    }, list) {
        return new Promise((resolve, reject) => {
            axios.get(process.env.MM_API_URL + "meta_data?path=" + list.url + "&api_key=" +
                process.env.API_KEY).then(response => {
                resolve(response);
            }).catch(error => {
                console.log("Data load error: " + error.message);
                reject(error);
            });
        })
    },
    LOAD_PAGE_DATA: function({
        commit
    }, list) {
        return new Promise((resolve, reject) => {
            axios
                .get(list.url)
                .then(response => {
                    // commit('SET_MALL_DATA', { list: response.data })
                    resolve(response);
                })
                .catch(error => {
                    console.log("Data load error: " + error.message);
                    reject(error);
                });
        });
    },
    //Login/Register Functions
    async api({
        commit,
        state
    }, data) {
        let url = process.env.MM_API_HOST + '/taubman/' + data.endpoint
        if (state.selectedProperty == null) {
            return
        }

        let requireOpts = {
            mall_id: state.selectedProperty.id,
            signature: process.env.API_KEY,
            timestamp: (new Date).toISOString()
        }

        let requestHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        if (state.authInfo) {
            requestHeaders = Object.assign(requestHeaders, state.authInfo)
        }
        let requestData = Object.assign({}, requireOpts, data.data)

        commit('LAST_REQUEST', {
            endpoint: url,
            body: JSON.stringify(requestData),
            headers: JSON.stringify(requestHeaders)
        })

        let response = await fetch(url, {
            method: 'POST',
            headers: requestHeaders,
            body: JSON.stringify(requestData)
        })

        let headers = {}
        for (var pair of response.headers.entries()) {
            headers[pair[0]] = pair[1]
        }

        let body = await response.json()
        commit('LAST_RESPONSE', {
            status: response.status,
            body: JSON.stringify(body, null, 2),
            headers: JSON.stringify(headers, null, 2)
        })
        if (data.endpoint === 'get_favorites') {
            let tmpJson = body
            if (tmpJson['data']) {
                commit('SET_FAVORITES', tmpJson['data'])
            }
        }
        if (data.endpoint === 'get_profile') {
            let tmpJson = body
            if (tmpJson['data']) {
                console.log('bsft - id', tmpJson['data'])
                Vue.blueshift.identify(tmpJson['data'])
                commit('SET_PROFILE', tmpJson['data'])
            }
        }

        if (data.endpoint === 'login_hash') {
            let tmpJson = body
            if (tmpJson['data']) {
                console.log('bsft - id', tmpJson['data'])
                Vue.blueshift.identify(tmpJson['data'])
                commit('SET_PROFILE', tmpJson['data'])
            }
        }

        if (headers['access-token']) {
            commit('SET_AUTH_INFO', {
                'access-token': headers['access-token'],
                'uid': headers['uid'],
                'client': headers['client']

            })
            var auth = {
                'access-token': headers['access-token'],
                'uid': headers['uid'],
                'client': headers['client']

            }
            Cookies.set("auInfo", JSON.stringify(auth));

        } else {
            commit('SET_AUTH_INFO', null)
            Cookies.remove('auInfo')
        }

        return state.lastResponse
    },


    selectProperty({
        commit
    }, property) {
        this.commit('SELECT_PROPERTY', property)
    },
    loadAuthInfo({
        commit
    }) {
        var auth = Cookies.get("auInfo");
        if (auth) {
            auth = JSON.parse(auth)
            commit('SET_AUTH_INFO', auth)
        } else {
            commit('SET_AUTH_INFO', null)
        }
    },
};

export default actions;