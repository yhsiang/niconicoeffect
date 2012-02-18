/**
 *
 * @class ModalWindow
 */
var ModalWindow = Class.create({

    /**
     *
     * @type {number}
     */
    Z_INDEX_BASE: 1000,

    /**
     *
     * @type {number}
     */
    INTERVAL_MSEC: 32,

    /**
     *
     * @type {number}
     */
    ANIMATION_SPEED: 0.1,

    /**
     *
     * @type {number}
     */
    OPACITY_MAX: 0.7,

    /**
     *
     * @type {number}
     */
    timerId: null,

    /**
     *
     * @type {Element}
     */
    back: null,

    /**
     *
     * @type {number}
     */
    opacity: null,

    /**
     *
     * @type {Array.<Element>}
     */
    selects: null,

    /**
     *
     * @type {boolean}
     */
    isAnimate: null,

    /**
     *
     * @type {Function}
     */
    preExecute: null,

    /**
     *
     * @type {Function}
     */
    postExecute: null,

    /**
     *
     * @param {string} color
     * @constructor
     * @protected
     */
    initialize: function (color) {
        this.back = new Element('div').setStyle({
            display: 'none',
            position: 'absolute',
            zIndex: this.Z_INDEX_BASE,
            backgroundColor: color || '#333333',
            top: '0px',
            left: '0px'
        });
        this.setupBackSize();
        this.opacity = 0.0;
        this.back.setOpacity(this.opacity);
        this.isAnimate = false;
        this.preExecute = Prototype.emptyFunction;
        this.postExecute = Prototype.emptyFunction;
        this.setupEventListener();
        Element.insert(document.body, { top: this.back });
    },

    /**
     *
     * @param {Function} callback
     */
    setPreExecute: function (callback) {
        this.preExecute = callback;
    },

    /**
     *
     * @param {Function} callback
     */
    setPostExecute: function (callback) {
        this.postExecute = callback;
    },

    /**
     *
     * @public
     */
    show: function () {
        if (this.isAnimate) {
            return;
        }
        this.isAnimate = true;
        this.hideSelectElement();
        this.back.show();
        this.timerId = window.setInterval(this.animateShow.bind(this), this.INTERVAL_MSEC);
    },

    /**
     *
     * @param {Event} e
     * @public
     */
    hide: function (e) {
        if (this.isAnimate || (e.type == 'keyup' && e.keyCode != Event.KEY_ESC)) {
            return;
        }
        this.isAnimate = true;
        e.stop();
        this.postExecute();
        this.timerId = window.setInterval(this.animateHide.bind(this), this.INTERVAL_MSEC);
    },

    /**
     *
     * @private
     */
    setupEventListener: function () {
        var handler = this.hide.bindAsEventListener(this);
        this.back.observe('click', handler);
        Event.observe(document.body, 'keyup', handler);
        Event.observe(window, 'resize', this.setupBackSize.bindAsEventListener(this));
    },

    /**
     *
     * @private
     */
    animateShow: function () {
        if (this.OPACITY_MAX <= this.opacity) {
            window.clearInterval(this.timerId);
            this.preExecute();
            this.isAnimate = false;
            return;
        }
        this.opacity += this.ANIMATION_SPEED;
        this.back.setOpacity(this.opacity);
    },


    /**
     *
     * @private
     */
    animateHide: function () {
        if (this.opacity <= 0.0) {
            window.clearInterval(this.timerId);
            this.back.hide();
            this.showSelectElement();
            this.isAnimate = false;
            return;
        }
        this.opacity -= this.ANIMATION_SPEED;
        this.back.setOpacity(this.opacity);
    },

    /**
     *
     * @param {Event} e
     * @private
     */
    setupBackSize: function (e) {
        var scrollHeight = this.getScrollHeight();
        var clientHeight = this.getClientHeight();
        this.back.setStyle({
            height: (scrollHeight > clientHeight ? scrollHeight : clientHeight) + 'px',
            width: this.getScrollWidth() + 'px'
        });
    },

    /**
     *
     * @private
     * @return {number}
     */
    getScrollHeight: function () {
        return document.documentElement.scrollHeight || document.body.scrollHeight;
    },

    /**
     *
     * @private
     * @return {number}
     */
    getScrollWidth: function () {
        return document.documentElement.scrollWidth || document.body.scrollWidth;
    },

    /**
     *
     * @private
     * @return {number}
     */
    getClientHeight: function () {
        return document.documentElement.clientHeight || document.body.clientHeight;
    },

    /**
     *
     * @private
     * @return {number}
     */
    getClientWidth: function () {
        return document.documentElement.clientWidth || document.body.clientWidth;
    },

    /**
     *
     * @private
     * @return {number}
     */
    getScrollTop: function () {
        return document.documentElement.scrollTop || document.body.scrollTop;
    },

    /**
     *
     * @private
     * @return {number}
     */
    getScrollLeft: function () {
        return document.documentElement.scrollLeft || document.body.scrollLeft;
    },

    /**
     *
     * @private
     */
    hideSelectElement: function () {
        this.toggleSelectElement('hidden');
    },

    /**
     *
     * @private
     */
    showSelectElement: function () {
        this.toggleSelectElement('visible');
    },

    /**
     *
     * @param {string} value
     * @private
     */
    toggleSelectElement: function (value) {
        if (!Prototype.Browser.IE || window.navigator.userAgent.indexOf('MSIE 6.0') === -1) {
            return;
        }
        if (!this.selects) {
            this.selects = $$('select');
        }
        this.selects.each(function (x) { x.setStyle({ visibility: value }); });
    }
});