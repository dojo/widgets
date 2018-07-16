(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var browserSpecificTransitionEndEventName = '';
    var browserSpecificAnimationEndEventName = '';
    function determineBrowserStyleNames(element) {
        if ('WebkitTransition' in element.style) {
            browserSpecificTransitionEndEventName = 'webkitTransitionEnd';
            browserSpecificAnimationEndEventName = 'webkitAnimationEnd';
        }
        else if ('transition' in element.style || 'MozTransition' in element.style) {
            browserSpecificTransitionEndEventName = 'transitionend';
            browserSpecificAnimationEndEventName = 'animationend';
        }
        else {
            throw new Error('Your browser is not supported');
        }
    }
    function initialize(element) {
        if (browserSpecificAnimationEndEventName === '') {
            determineBrowserStyleNames(element);
        }
    }
    function runAndCleanUp(element, startAnimation, finishAnimation) {
        initialize(element);
        var finished = false;
        var transitionEnd = function () {
            if (!finished) {
                finished = true;
                element.removeEventListener(browserSpecificTransitionEndEventName, transitionEnd);
                element.removeEventListener(browserSpecificAnimationEndEventName, transitionEnd);
                finishAnimation();
            }
        };
        startAnimation();
        element.addEventListener(browserSpecificAnimationEndEventName, transitionEnd);
        element.addEventListener(browserSpecificTransitionEndEventName, transitionEnd);
    }
    function exit(node, properties, exitAnimation, removeNode) {
        var activeClass = properties.exitAnimationActive || exitAnimation + "-active";
        runAndCleanUp(node, function () {
            node.classList.add(exitAnimation);
            requestAnimationFrame(function () {
                node.classList.add(activeClass);
            });
        }, function () {
            removeNode();
        });
    }
    function enter(node, properties, enterAnimation) {
        var activeClass = properties.enterAnimationActive || enterAnimation + "-active";
        runAndCleanUp(node, function () {
            node.classList.add(enterAnimation);
            requestAnimationFrame(function () {
                node.classList.add(activeClass);
            });
        }, function () {
            node.classList.remove(enterAnimation);
            node.classList.remove(activeClass);
        });
    }
    exports.default = {
        enter: enter,
        exit: exit
    };
});
//# sourceMappingURL=cssTransitions.js.map