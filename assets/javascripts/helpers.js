"use strict";

const helpers = {
  isBreakpoint(breakpoint) {
    const bp = window.getComputedStyle(document.querySelector('body'), ':before').getPropertyValue('content').replace(/\"/g, '');

    /* tslint:disable:ter-indent */
    switch (breakpoint) {
      case 'xs': {
        return breakpoint === bp;
      }
      case 'sm': {
        return bp === 'sm' || bp === 'xs';
      }
      case 'md': {
        return bp === 'sm' || bp === 'xs' || bp === 'md';
      }
      case 'lg': {
        return bp === 'sm' || bp === 'xs' || bp === 'md' || bp === 'lg';
      }
      default: {
        return breakpoint === bp;
      }
    }
    /* tslint:enable:ter-indent */
  },

  /**
   * Get url parameter path on path position
   * @param  {number} pos Position of url parameter
   * @returns string
   */
  getUrlParams(pos) {
    // TODO: See if the Vue Router can extract this info for us
    const uri = new URI();
    const results = this.trimByChar(decodeURIComponent(uri.path()), '/').split('/'); // decodeURIComponent needed for different languages
    if (pos < results.length)
      return results[pos];

    return;
  },


  /**
   * Shorten a string by a given length
   * @param  {string} str The string to shorten
   * @param  {number} length The length to shorten to.
   * @param  {string} postfix Whether to add a postfix to the end of the shortened string.
   * @returns {string} Shorten string.
   */
  shorten(str, length, postfix) {
    if (!str || str.length <= length)
      return str;

    return str.substring(0, length) + postfix;
  },


  trimByChar(str, character) {
    const first = str.split('').findIndex(char => char !== character);
    const last = str.split('').reverse().findIndex(char => char !== character);
    return str.substring(first, str.length - last);
  },


  /**
   * Generates the image url to use for the image.
   * @param  {string} imageCDN Image CDN hostname
   * @param  {number} assetId Image asset Id
   * @returns string
   */
  toImageUrl(imageCDN, assetId) {
    if (assetId === null || assetId === 0)
      return '';

    return `${imageCDN}asset/get/${assetId}`;
  },


  /**
   * Resizes the image using the larger of the height or width so that it would
   * fit in a square box while keeping the aspect ratio.
   * @param  {string} imageUrl Full ':imageCDN/asset/get/:assetId' url
   * @param  {number} width Target width
   * @param  {number} height Target Height
   */
  resizeImage(imageUrl, width, height) {
    const method = 3; // 3 = Fit in Box
    return imageUrl.replace('/get/', '/resize/') + `/${method}/${width}/${height}.jpg`;
  },

  /**
   * Scroll to element
   * @param  {string} elementId The element id to scroll to
   * @param  {} smoothScroll Whether or not to turn on smooth scrolling effect
   * @param  {} offset The offset (padding) from the top of the window when function completes
   * @param  {} scrollableElem The scrollable container if not the body.
   */
  scrollToAnchor(elementId, smoothScroll = true, offset = 90, scrollableElem = null) {
    const duration = smoothScroll ? 1450 : 1;
    let containerElem = $('html, body');
    let posFromTop = $(elementId).offset().top;

    if (scrollableElem) {
      containerElem = $(scrollableElem);
      posFromTop = $(elementId).position().top + containerElem.scrollTop();
    }

    const scrollTo = posFromTop - offset;

    containerElem.animate({
      scrollTop: scrollTo
    }, duration, function () {
      $(elementId).focus();
    });
  },

  setFavorites(favorableItems, favIds) {
    const favSet = new Set(favIds);
    return favorableItems.map((item) => {
      item.isUserFavorite = favSet.has(item.id);
      return item;
    });
  },

  /**
   * Filter a stores array  by category and sub-category
   * @param  {Store[]} stores Stores array to filter.
   * @param  {number} categoryId
   * @param  {number} subCategoryId
   */
  filterStoresByCategory(stores, categoryId, subCategoryId) {

    if (categoryId > 0) {
      if (categoryId > 0 && subCategoryId > 0) {
        stores = stores.filter(n => n.categoryIds.indexOf(categoryId) > -1 && n.categoryIds.indexOf(subCategoryId) > -1);
      } else {
        stores = stores.filter(n => n.categoryIds.indexOf(categoryId) > -1);
      }
      return _.orderBy(stores, [store => store.name.toLowerCase()], ['asc']);
    }

    return [];
  },

  /**
   * Determine the mobile operating system.
   * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
   *
   * @returns {String}
   */
  getMobileOS() {
    const userAgent = navigator.userAgent || navigator.vendor || (window).opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
      return 'Windows Phone';
    }

    if (/android/i.test(userAgent)) {
      return 'Android';
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window).MSStream) {
      return 'iOS';
    }

    return 'unknown';
  },


  /**
   * Search an array of stores
   * @param  {string} criteria What to search on
   * @param  {Store[]} stores Stores array to search on
   * @returns {Store[]} Result of the search
   */
  storeSearch(criteria, stores) {
    // if there is no input, return all the stores
    if (criteria) {
      let matches = fuzzysort.go(criteria, stores, {
        allowTypo: true,
        limit: 10,
        key: 'name'
      });
      let namesMatched = [];
      matches.forEach(n => namesMatched.push(n.target));
      //filter for stores only if they appear in the store name results from the fuzzy search
      stores = stores.filter(n => namesMatched.indexOf(n.name) != -1);
    }
    return _.orderBy(stores, [store => store.name.toLowerCase()], ['asc']);
  },
  isMissingImage(image_url) {
    return _.includes(image_url, 'missing');
  }
}

export default helpers
