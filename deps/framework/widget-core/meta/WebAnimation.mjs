import { Base } from './Base';
import Map from '../../shim/Map';
import global from '../../shim/global';
export class WebAnimations extends Base {
    constructor() {
        super(...arguments);
        this._animationMap = new Map();
    }
    _createPlayer(node, properties) {
        const { effects, timing = {} } = properties;
        const fx = typeof effects === 'function' ? effects() : effects;
        const keyframeEffect = new KeyframeEffect(node, fx, timing);
        return new Animation(keyframeEffect, global.document.timeline);
    }
    _updatePlayer(player, controls) {
        const { play, reverse, cancel, finish, onFinish, onCancel, playbackRate, startTime, currentTime } = controls;
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
    }
    animate(key, animateProperties) {
        const node = this.getNode(key);
        if (node) {
            if (!Array.isArray(animateProperties)) {
                animateProperties = [animateProperties];
            }
            animateProperties.forEach((properties) => {
                properties = typeof properties === 'function' ? properties() : properties;
                if (properties) {
                    const { id } = properties;
                    if (!this._animationMap.has(id)) {
                        this._animationMap.set(id, {
                            player: this._createPlayer(node, properties),
                            used: true
                        });
                    }
                    const animation = this._animationMap.get(id);
                    const { controls = {} } = properties;
                    if (animation) {
                        this._updatePlayer(animation.player, controls);
                        this._animationMap.set(id, {
                            player: animation.player,
                            used: true
                        });
                    }
                }
            });
        }
    }
    get(id) {
        const animation = this._animationMap.get(id);
        if (animation) {
            const { currentTime, playState, playbackRate, startTime } = animation.player;
            return {
                currentTime,
                playState,
                playbackRate,
                startTime
            };
        }
    }
    afterRender() {
        this._animationMap.forEach((animation, key) => {
            if (!animation.used) {
                animation.player.cancel();
                this._animationMap.delete(key);
            }
            animation.used = false;
        });
    }
}
export default WebAnimations;
//# sourceMappingURL=WebAnimation.mjs.map