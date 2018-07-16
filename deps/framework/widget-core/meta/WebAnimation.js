(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./Base", "../../shim/Map", "../../shim/global"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var Base_1 = require("./Base");
    var Map_1 = require("../../shim/Map");
    var global_1 = require("../../shim/global");
    var WebAnimations = /** @class */ (function (_super) {
        tslib_1.__extends(WebAnimations, _super);
        function WebAnimations() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._animationMap = new Map_1.default();
            return _this;
        }
        WebAnimations.prototype._createPlayer = function (node, properties) {
            var effects = properties.effects, _a = properties.timing, timing = _a === void 0 ? {} : _a;
            var fx = typeof effects === 'function' ? effects() : effects;
            var keyframeEffect = new KeyframeEffect(node, fx, timing);
            return new Animation(keyframeEffect, global_1.default.document.timeline);
        };
        WebAnimations.prototype._updatePlayer = function (player, controls) {
            var play = controls.play, reverse = controls.reverse, cancel = controls.cancel, finish = controls.finish, onFinish = controls.onFinish, onCancel = controls.onCancel, playbackRate = controls.playbackRate, startTime = controls.startTime, currentTime = controls.currentTime;
            if (playbackRate !== undefined) {
                player.playbackRate = playbackRate;
            }
            if (reverse) {
                player.reverse();
            }
            if (cancel) {
                player.cancel();
            }
            if (finish) {
                player.finish();
            }
            if (startTime !== undefined) {
                player.startTime = startTime;
            }
            if (currentTime !== undefined) {
                player.currentTime = currentTime;
            }
            if (play) {
                player.play();
            }
            else {
                player.pause();
            }
            if (onFinish) {
                player.onfinish = onFinish.bind(this._bind);
            }
            if (onCancel) {
                player.oncancel = onCancel.bind(this._bind);
            }
        };
        WebAnimations.prototype.animate = function (key, animateProperties) {
            var _this = this;
            var node = this.getNode(key);
            if (node) {
                if (!Array.isArray(animateProperties)) {
                    animateProperties = [animateProperties];
                }
                animateProperties.forEach(function (properties) {
                    properties = typeof properties === 'function' ? properties() : properties;
                    if (properties) {
                        var id = properties.id;
                        if (!_this._animationMap.has(id)) {
                            _this._animationMap.set(id, {
                                player: _this._createPlayer(node, properties),
                                used: true
                            });
                        }
                        var animation = _this._animationMap.get(id);
                        var _a = properties.controls, controls = _a === void 0 ? {} : _a;
                        if (animation) {
                            _this._updatePlayer(animation.player, controls);
                            _this._animationMap.set(id, {
                                player: animation.player,
                                used: true
                            });
                        }
                    }
                });
            }
        };
        WebAnimations.prototype.get = function (id) {
            var animation = this._animationMap.get(id);
            if (animation) {
                var _a = animation.player, currentTime = _a.currentTime, playState = _a.playState, playbackRate = _a.playbackRate, startTime_1 = _a.startTime;
                return {
                    currentTime: currentTime,
                    playState: playState,
                    playbackRate: playbackRate,
                    startTime: startTime_1
                };
            }
        };
        WebAnimations.prototype.afterRender = function () {
            var _this = this;
            this._animationMap.forEach(function (animation, key) {
                if (!animation.used) {
                    animation.player.cancel();
                    _this._animationMap.delete(key);
                }
                animation.used = false;
            });
        };
        return WebAnimations;
    }(Base_1.Base));
    exports.WebAnimations = WebAnimations;
    exports.default = WebAnimations;
});
//# sourceMappingURL=WebAnimation.js.map