import moment from 'moment'
import tz from 'moment-timezone'

const getters = {
    blogs: state => state.blogs,
    getLocale: state => {
        let locale = state.locale;
        return locale;
    },
    timezone: state => {
        let property = state.property;
        let timezone = (property !== null && property !== undefined) ? property.time_zone : null;
        return timezone;
    },
    property: state => state.property,
    repos: state => state.repos,
    getTodayHours: state => {
        try {
            let hours = state.hours;
            let property = state.property;
            let timezone = property.time_zone;
            let todayHours = hours.find(hour => hour.day_of_week === moment().day());
            let holidayHours = hours.find(hour => hour.is_holiday == true && (moment(hour.holiday_date).tz(timezone).date() == moment().tz(timezone).date() && moment(hour.holiday_date).tz(timezone).month() + 1 == moment().tz(timezone).month() + 1 && moment(hour.holiday_date).tz(timezone).year() == moment().tz(timezone).year()));
            let hoursObject = null;
            if (holidayHours) {
                hoursObject = holidayHours;
            } else {
                hoursObject = todayHours;
            }
            hoursObject.locale = state.locale; // IMPORTANT! Here I am adding the state's locale in the hours object such that it will trigger a change in the template anytime the locale changes in the app.
            return hoursObject;
        } catch (err) {
            return null;
        }
    },
    getPropertyHours: state => {
        try {
            let hours = state.hours.regular_hours;
            // let property = state.property;
            // let timezone = property.time_zone;
            // let hoursObject = _.filter(hours, function (o) {
            //   return o.store_ids === null && !o.is_holiday;
            // });

            // hoursObject.locale = state.locale; // IMPORTANT! Here I am adding the state's locale in the hours object such that it will trigger a change in the template anytime the locale changes in the app.
            return hours;
        } catch (err) {
            return null;
        }
    },
    getPropertyHolidayHours: state => {
        try {
            let hours = state.hours.holiday_hours;
            // let property = state.property;
            // let timezone = property.time_zone;
            // let hoursObject = _.filter(hours, function (o) {
            //   return o.store_ids === null && o.is_holiday;
            // });

            // hoursObject.locale = state.locale; // IMPORTANT! Here I am adding the state's locale in the hours object such that it will trigger a change in the template anytime the locale changes in the app.
            return hours;
        } catch (err) {
            return null;
        }
    },
    homepage: state => {
        try {
            let promos = state.homepage.featured_promotions;
            let stores = state.stores;
            promos.map(promo => {
                // promo.image_url = promo.promo_image_url_abs;
                promo.locale = state.locale;
                promo.store = null;
                if (promo.promotionable_type === "Store") {
                    let foundStore = stores.find(store => store.id === promo.promotionable_id);
                    if (foundStore) {
                        promo.store = foundStore;
                    }
                }
            });
            return state.homepage
        } catch (err) {
            return {}
        }
    },
    processedBanners: state => {
        try {
            return state.banners;
        } catch (err) {
            return [];
        }
    },
    processedPromos: state => {
        try {
            let promos = state.promotions;
            let stores = state.stores;
            // Add image_url attribute with CDN link
            promos.map(promo => {
                // promo.image_url = promo.promo_image_url_abs;
                promo.locale = state.locale;
                promo.store = null;
                if (promo.promotionable_type === "Store") {
                    let foundStore = stores.find(store => store.id === promo.promotionable_id);
                    if (foundStore) {
                        promo.store = foundStore;
                    }
                }
            });
            return promos;
        } catch (err) {
            return [];
        }
    },
    processedEvents: state => {
        try {
            let events = state.events;
            let stores = state.stores;
            // Add image_url attribute with CDN link
            events.map(event => {
                // event.image_url = event.event_image_url_abs;
                event.locale = state.locale;
                event.store = null;
                if (event.eventable_type === "Store") {
                    let foundStore = stores.find(store => store.id === event.eventable_id);
                    if (foundStore) {
                        event.store = foundStore;
                    }
                }
            });
            return events;
        } catch (err) {
            return [];
        }
    },
    processedCoupons: state => {
        try {
            let coupons = state.coupons;
            let stores = state.stores;
            // Add image_url attribute with CDN link
            coupons.map(coupon => {
                coupon.locale = state.locale;
                coupon.store = null;
                if (coupon.promotionable_type === "Store") {
                    let foundStore = stores.find(store => store.id === coupon.promotionable_id);
                    if (foundStore) {
                        coupon.store = foundStore;
                    }
                }
            });
            return coupons;
        } catch (err) {
            return [];
        }
    },
    processedJobs: state => {
        try {
            let jobs = state.jobs;
            let stores = state.stores;
            // Add image_url attribute with CDN link
            jobs.map(job => {
                job.locale = state.locale;
                job.store = null;
                if (job.jobable_type === "Store") {
                    let foundStore = stores.find(store => store.id === job.jobable_id);
                    if (foundStore) {
                        job.store = foundStore;
                    }
                }
            });
            return jobs;
        } catch (err) {
            return [];
        }
    },
    processedStores: state => {
        try {
            let stores = state.stores;
            // Add image_url attribute with CDN link
            stores.map(store => {
                // store.image_url = "https://mallmaverick.cdn.speedyrails.net" + store.store_front_url;
            });
            return stores;
        } catch (err) {
            return [];
        }
    },
    processedCategories: state => {
        try {
            return state.categories;
        } catch (err) {
            return [];
        }
    },
    processedSubcategories: state => {
        try {
            return state.subcategories;
        } catch (err) {
            return [];
        }
    },
    processedContests: state => {
        try {
            let contests = state.contests;
            contests.map(contest => {
                contest.image_url = "https://assets.mallmaverick.com" + contest.photo_url;
            });
            return contests;
        } catch (err) {
            return [];
        }
    },
    processedNews: state => {
        try {
            let news = state.news;
            let stores = state.stores;
            // Add image_url attribute with CDN link
            news.map(event => {
                event.store = null;
                if (event.eventable_type === "Store") {
                    let foundStore = stores.find(store => store.id === event.eventable_id.toString());
                    if (foundStore) {
                        event.store = foundStore;
                    }
                }
            });
            return news;
        } catch (err) {
            return [];
        }
    },
    processedPages: state => {
        try {
            return state.pages;
        } catch (err) {
            return [];
        }
    },
    processedFeatures: state => {
        try {
            return state.features;
        } catch (err) {
            return [];
        }
    },
    findBannerByName: (state, getters) => (name) => {
        let banners = getters.processedBanners;
        if (banners)
            return banners.find(banner => banner.name === name)
        else
            return {}
    },
    findStoreBySlug: (state, getters) => (slug) => {
        let stores = state.stores;
        return stores.find(store => store.slug === slug)
    },
    findStoreById: (state, getters) => (id) => {
        let stores = state.stores;
        return stores.find(store => _.toNumber(store.id) === _.toNumber(id))
    },
    findCategoryById: (state, getters) => (id) => {
        let categories = getters.processedCategories;
        return categories.find(category => _.toNumber(category.id) === _.toNumber(id))
    },
    findCategoryByName: (state, getters) => (name) => {
        let categories = getters.processedCategories;
        return categories.find(category => _.toString(category.name) === _.toString(name))
    },
    findSubcategoryById: (state, getters) => (id) => {
        let categories = getters.processedCategories;
        return categories.find(category => _.toNumber(category.id) === _.toNumber(id))
    },
    findSubcategoryByName: (state, getters) => (name) => {
        let categories = getters.processedCategories;
        return categories.find(category => _.toString(category.name) === _.toString(name))
    },
    findSubcategoriesByParentID: (state, getters) => (parent_cat_id) => {
        let all_subcategories = getters.processedCategories;
        let subcategory = _.filter(all_subcategories, function(o) {
            return _.toNumber(o.parent_category_id) === _.toNumber(parent_cat_id);
        });
        return subcategory
    },
    findPromoBySlug: (state, getters) => (slug) => {
        let promos = getters.processedPromos;
        return promos.find(promo => promo.slug === slug)
    },
    findPromoById: (state, getters) => (id) => {
        let promos = getters.processedPromos;
        return promos.find(promo => _.toNumber(promo.id) === _.toNumber(id))
    },
    findEventBySlug: (state, getters) => (slug) => {
        let events = getters.processedEvents;
        return events.find(event => event.slug === slug)
    },
    findEventById: (state, getters) => (id) => {
        let events = getters.processedEvents;
        return events.find(event => _.toNumber(event.id) === _.toNumber(id))
    },
    findCouponBySlug: (state, getters) => (slug) => {
        let coupons = getters.processedCoupons;
        return coupons.find(coupon => coupon.slug === slug)
    },
    findCouponById: (state, getters) => (id) => {
        let coupons = getters.processedCoupons;
        return coupons.find(coupon => _.toNumber(coupon.id) === _.toNumber(id))
    },
    findJobBySlug: (state, getters) => (slug) => {
        let jobs = getters.processedJobs;
        return jobs.find(job => job.slug === slug)
    },
    findJobById: (state, getters) => (id) => {
        let jobs = getters.processedJobs;
        return jobs.find(job => _.toNumber(job.id) === _.toNumber(id))
    },
    findContestBySlug: (state, getters) => (slug) => {
        let contests = getters.processedContests;
        return contests.find(contest => contest.slug === slug)
    },
    findContestById: (state, getters) => (id) => {
        let contests = getters.processedContests;
        return contests.find(contest => _.toNumber(contest.id) === _.toNumber(id))
    },
    findBlogByName: (state, getters) => (name) => {
        let blogs = state.blogs;
        return blogs.find(blog => blog.name === name)
    },
    findBlogBySlug: (state, getters) => (slug) => {
        let blogs = state.blogs;
        return blogs.find(blog => blog.slug === slug)
    },
    findRepoByName: (state, getters) => (name) => {
        let repos = state.repos;
        if (repos)
            return repos.find(repo => repo.name === name)
        else
            return {}
    },
    findRepoBySlug: (state, getters) => (slug) => {
        let repos = state.repos;
        if (repos)
            return repos.find(repo => repo.slug === slug)
        else
            return {}
    },
    findRepoById: (state, getters) => (id) => {
        let repos = state.repos;
        return repos.find(repo => repo.id === id)
    },
    findRepoPostByIdWithId: (state, getters) => (id, repo_id) => {
        let repos = getters.findRepoById(id);
        if (repos && repos.images) {
            let repo_dets = repos.images
            return repo_dets.find(repo => repo.id === repo_id)
        }
    },
    findBlogPostBySlug: (state, getters) => (name, slug) => {
        let blogs = getters.findBlogByName(name);
        let blog_posts = blogs.posts;
        return blog_posts.find(blog_post => blog_post.slug === slug)
    },
    findPointOfInterest: (state, getters) => (name) => {
        let pois = state.pois;
        return pois.find(poi => poi.name === name)
    },
    findPointOfInterestBySlug: (state, getters) => (name, slug) => {
        let pois = getters.findPointOfInterest(name);
        let pois_locations = pois.locations;
        return pois_locations.find(pois_location => pois_location.slug === slug)
    },
    findHourById: (state, getters) => (id) => {
        let hours = state.hours;
        if (hours)
            return hours.find(hour => _.toNumber(hour.id) === _.toNumber(id))
        else
            return null
    },
    findMetaDataByPath: (state, getters) => (path) => {
        try {
            let meta_data = state.meta_data.meta_data;
            let found = meta_data.find(meta => meta.path === path);
            if (found) {
                return found;
            } else {
                let meta = {
                    meta_title: "",
                    meta_description: "",
                    meta_keywords: ""
                }
                return meta;
            }
        } catch (err) {
            let meta = {
                meta_title: "",
                meta_description: "",
                meta_keywords: ""
            }
            return meta;
        }
    },
    storesByAlphaIndex: (state, getters) => {
        let stores = getters.processedStores;
        let grouped = _.groupBy(stores, store => (isNaN(_.upperCase(store.name.charAt(0))) ? _.upperCase(store.name.charAt(0)) : "#"));
        return grouped;
    },
    storesByCategoryName: (state, getters) => {
        let stores = getters.processedStores;
        let categories = state.categories;
        let tempStores = [];
        let groupedCategoriesById = _.groupBy(categories, category => category.id.toString());
        _.each(stores, store => _.each(store.categories, cat => {
            try {
                let catName = groupedCategoriesById[cat][0].name;
                store.category_name = catName;
                tempStores.push(store);
            } catch (e) {
                // some exception
            }
        }));
        tempStores = _.orderBy(tempStores, store => store.category_name);
        let groupedStoresByCategoryName = _.groupBy(tempStores, store => store.category_name);
        return groupedStoresByCategoryName;
    },
    findNewStores: (state, getters) => {
        let stores = getters.processedStores;
        let new_stores = _.filter(stores, function(o) {
            return o.is_new_store === true;
        });
        return new_stores;
    },
    processedDineStores: (state, getters) => {
        let stores = getters.processedStores;
        var categoryType = "dine";
        var cat = null;
        for (const category of getters.processedCategories) {
            if (category.name.toLowerCase() == categoryType.toLowerCase()) {
                cat = category;
                break;
            }
        }
        let dine_stores = _.filter(stores, function(o) {
            return _.indexOf(o.categories, _.toNumber(cat.id)) > -1;
        });
        return dine_stores;
    },
    findComingSoonStores: (state, getters) => {
        let stores = getters.processedStores;
        let coming_soon = _.filter(stores, function(o) {
            return o.is_coming_soon_store == true;
        });
        return coming_soon
    },
    findPromosByStoreId: (state, getters) => (id) => {
        let store_promos = _.filter(getters.processedPromos, function(o) {
            o.is_promo = true;
            return o.promotionable_id === _.toNumber(id);
        });
        store_promos = _.sortBy(store_promos, ["end_date"]).reverse();
        return store_promos;
    },
    findEventsByStoreId: (state, getters) => (id) => {
        let store_events = _.filter(getters.processedEvents, function(o) {
            o.is_event = true;
            return o.eventable_id === _.toNumber(id);
        });
        store_events = _.sortBy(store_events, ["end_date"]).reverse();
        return store_events;
    },
    findJobsByStoreId: (state, getters) => (id) => {
        let store_jobs = _.filter(getters.processedJobs, function(o) {
            o.is_job = true;
            return o.jobable_id === _.toNumber(id);
        });
        store_jobs = _.sortBy(store_jobs, ["end_date"]).reverse();
        return store_jobs;
    },
    findNewsByStoreId: (state, getters) => (id) => {
        let store_news = _.filter(getters.processedNews, function(o) {
            o.is_news = true;
            return o.eventable_id === _.toNumber(id);
        });
        store_news = _.sortBy(store_news, ["end_date"]).reverse();
        return store_news;
    },
    findStoreItemsByStoreId: (state, getters) => (id) => {
        let store_promos = _.filter(getters.processedPromos, function(o) {
            o.is_promo = true;
            return o.promotionable_id === _.toNumber(id);
        });
        let store_events = _.filter(getters.processedEvents, function(o) {
            o.is_event = true;
            return o.eventable_id === _.toNumber(id);
        });
        let store_jobs = _.filter(getters.processedJobs, function(o) {
            o.is_job = true;
            return o.jobable_id === _.toNumber(id);
        });
        let store_news = _.filter(getters.processedNews, function(o) {
            o.is_news = true;
            return o.eventable_id === _.toNumber(id);
        });
        store_promos = _.sortBy(store_promos, ["end_date"]).reverse();
        store_events = _.sortBy(store_events, ["end_date"]).reverse();
        store_jobs = _.sortBy(store_jobs, ["end_date"]).reverse();
        store_news = _.sortBy(store_news, ["end_date"]).reverse();
        let all_items = _.concat(store_promos, store_events, store_jobs, store_news)
        return all_items
    },
    findNewsBySlug: (state, getters) => (slug) => {
        let events = getters.processedNews;
        return events.find(event => event.slug === slug)
    },
    findNewsById: (state, getters) => (id) => {
        let events = getters.processedNews;
        return events.find(event => _.toNumber(event.id) === _.toNumber(id))
    },
    findPageBySlug: (state, getters) => (slug, vm) => {
        let pages = state.pages;
        let thePage = null
        if (vm) {
            thePage = _.find(pages, function(o) {
                return vm.sanitizeString(o.slug) == (vm.sanitizeString(slug))
            })
        } else {
            thePage = _.find(pages, function(o) {
                return o.slug == slug
            })
        }
        return thePage
    },
    locale: (state) => {
        // moment.locale(state.i18n.locale);
        // console.log('state.i18n', state)
        return 'en' //state.i18n.locale;
    },
    //Login/Register Functions
    isLoggedIn(state) {
        return state.authInfo !== null
    },
    favorites(state) {
        return state.favorites
    },
    profile(state) {
        return state.profile
    }
}

export default getters