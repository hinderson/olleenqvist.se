'use strict';

var utils = {};

utils = {

    forEach: function (array, callback, scope) {
		for (var i = 0, len = array.length; i < len; i++) {
			callback.call(scope, i, array[i]);
		}
	},

    delegate: function (criteria, listener) {
		return function (e) {
			var el = e.target;
			do {
				if (!criteria(el)) continue;
				e.delegateTarget = el;
				listener.apply(this, arguments);
				return;
			} while( (el = el.parentNode) );
		};
	},

	partialDelegate: function (criteria) {
		return function (handler) {
			return utils.delegate(criteria, handler);
		};
	},

	criteria: {
		isAnElement: function (e) {
			return e instanceof HTMLElement;
		},
		hasClass: function (cls) {
			return function (e) {
				return utils.criteria.isAnElement(e) && e.classList.contains(cls);
			};
		},
		hasTagName: function (tag) {
			return function (e) {
				return utils.criteria.isAnElement(e) && e.nodeName === tag.toUpperCase();
			};
		},
		hasTagNames: function (tags) {
			if (tags.length > 0) {
				return function (e) {
					for (var i = 0, len = tags.length; i < len; i++) {
						if (utils.criteria.isAnElement(e) && e.nodeName === tags[i].toUpperCase()) {
							return utils.criteria.isAnElement(e) && e.nodeName === tags[i].toUpperCase();
						}
					}
				};
			}
		}
	},

};

module.exports = utils;
