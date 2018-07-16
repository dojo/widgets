(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../shim/global", "../shim/array", "./d", "./Registry", "../shim/WeakMap"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var global_1 = require("../shim/global");
    var array_1 = require("../shim/array");
    var d_1 = require("./d");
    var Registry_1 = require("./Registry");
    var WeakMap_1 = require("../shim/WeakMap");
    var NAMESPACE_W3 = 'http://www.w3.org/';
    var NAMESPACE_SVG = NAMESPACE_W3 + '2000/svg';
    var NAMESPACE_XLINK = NAMESPACE_W3 + '1999/xlink';
    var emptyArray = [];
    var nodeOperations = ['focus', 'blur', 'scrollIntoView', 'click'];
    exports.widgetInstanceMap = new WeakMap_1.default();
    var instanceMap = new WeakMap_1.default();
    var nextSiblingMap = new WeakMap_1.default();
    var projectorStateMap = new WeakMap_1.default();
    function same(dnode1, dnode2) {
        if (d_1.isVNode(dnode1) && d_1.isVNode(dnode2)) {
            if (d_1.isDomVNode(dnode1) || d_1.isDomVNode(dnode2)) {
                if (dnode1.domNode !== dnode2.domNode) {
                    return false;
                }
            }
            if (dnode1.tag !== dnode2.tag) {
                return false;
            }
            if (dnode1.properties.key !== dnode2.properties.key) {
                return false;
            }
            return true;
        }
        else if (d_1.isWNode(dnode1) && d_1.isWNode(dnode2)) {
            if (dnode1.instance === undefined && typeof dnode2.widgetConstructor === 'string') {
                return false;
            }
            if (dnode1.widgetConstructor !== dnode2.widgetConstructor) {
                return false;
            }
            if (dnode1.properties.key !== dnode2.properties.key) {
                return false;
            }
            return true;
        }
        return false;
    }
    var missingTransition = function () {
        throw new Error('Provide a transitions object to the projectionOptions to do animations');
    };
    function getProjectionOptions(projectorOptions, projectorInstance) {
        var defaults = {
            namespace: undefined,
            styleApplyer: function (domNode, styleName, value) {
                domNode.style[styleName] = value;
            },
            transitions: {
                enter: missingTransition,
                exit: missingTransition
            },
            depth: 0,
            merge: false,
            sync: false,
            projectorInstance: projectorInstance
        };
        return tslib_1.__assign({}, defaults, projectorOptions);
    }
    function checkStyleValue(styleValue) {
        if (typeof styleValue !== 'string') {
            throw new Error('Style values must be strings');
        }
    }
    function updateEvent(domNode, eventName, currentValue, projectionOptions, bind, previousValue) {
        var projectorState = projectorStateMap.get(projectionOptions.projectorInstance);
        var eventMap = projectorState.nodeMap.get(domNode) || new WeakMap_1.default();
        if (previousValue) {
            var previousEvent = eventMap.get(previousValue);
            domNode.removeEventListener(eventName, previousEvent);
        }
        var callback = currentValue.bind(bind);
        if (eventName === 'input') {
            callback = function (evt) {
                currentValue.call(this, evt);
                evt.target['oninput-value'] = evt.target.value;
            }.bind(bind);
        }
        domNode.addEventListener(eventName, callback);
        eventMap.set(currentValue, callback);
        projectorState.nodeMap.set(domNode, eventMap);
    }
    function addClasses(domNode, classes) {
        if (classes) {
            var classNames = classes.split(' ');
            for (var i = 0; i < classNames.length; i++) {
                domNode.classList.add(classNames[i]);
            }
        }
    }
    function removeClasses(domNode, classes) {
        if (classes) {
            var classNames = classes.split(' ');
            for (var i = 0; i < classNames.length; i++) {
                domNode.classList.remove(classNames[i]);
            }
        }
    }
    function buildPreviousProperties(domNode, previous, current) {
        var diffType = current.diffType, properties = current.properties, attributes = current.attributes;
        if (!diffType || diffType === 'vdom') {
            return { properties: previous.properties, attributes: previous.attributes, events: previous.events };
        }
        else if (diffType === 'none') {
            return { properties: {}, attributes: previous.attributes ? {} : undefined, events: previous.events };
        }
        var newProperties = {
            properties: {}
        };
        if (attributes) {
            newProperties.attributes = {};
            newProperties.events = previous.events;
            Object.keys(properties).forEach(function (propName) {
                newProperties.properties[propName] = domNode[propName];
            });
            Object.keys(attributes).forEach(function (attrName) {
                newProperties.attributes[attrName] = domNode.getAttribute(attrName);
            });
            return newProperties;
        }
        newProperties.properties = Object.keys(properties).reduce(function (props, property) {
            props[property] = domNode.getAttribute(property) || domNode[property];
            return props;
        }, {});
        return newProperties;
    }
    function nodeOperation(propName, propValue, previousValue, domNode, projectionOptions) {
        var result;
        if (typeof propValue === 'function') {
            result = propValue();
        }
        else {
            result = propValue && !previousValue;
        }
        if (result === true) {
            var projectorState = projectorStateMap.get(projectionOptions.projectorInstance);
            projectorState.deferredRenderCallbacks.push(function () {
                domNode[propName]();
            });
        }
    }
    function removeOrphanedEvents(domNode, previousProperties, properties, projectionOptions, onlyEvents) {
        if (onlyEvents === void 0) { onlyEvents = false; }
        var projectorState = projectorStateMap.get(projectionOptions.projectorInstance);
        var eventMap = projectorState.nodeMap.get(domNode);
        if (eventMap) {
            Object.keys(previousProperties).forEach(function (propName) {
                var isEvent = propName.substr(0, 2) === 'on' || onlyEvents;
                var eventName = onlyEvents ? propName : propName.substr(2);
                if (isEvent && !properties[propName]) {
                    var eventCallback = eventMap.get(previousProperties[propName]);
                    if (eventCallback) {
                        domNode.removeEventListener(eventName, eventCallback);
                    }
                }
            });
        }
    }
    function updateAttribute(domNode, attrName, attrValue, projectionOptions) {
        if (projectionOptions.namespace === NAMESPACE_SVG && attrName === 'href') {
            domNode.setAttributeNS(NAMESPACE_XLINK, attrName, attrValue);
        }
        else if ((attrName === 'role' && attrValue === '') || attrValue === undefined) {
            domNode.removeAttribute(attrName);
        }
        else {
            domNode.setAttribute(attrName, attrValue);
        }
    }
    function updateAttributes(domNode, previousAttributes, attributes, projectionOptions) {
        var attrNames = Object.keys(attributes);
        var attrCount = attrNames.length;
        for (var i = 0; i < attrCount; i++) {
            var attrName = attrNames[i];
            var attrValue = attributes[attrName];
            var previousAttrValue = previousAttributes[attrName];
            if (attrValue !== previousAttrValue) {
                updateAttribute(domNode, attrName, attrValue, projectionOptions);
            }
        }
    }
    function updateProperties(domNode, previousProperties, properties, projectionOptions, includesEventsAndAttributes) {
        if (includesEventsAndAttributes === void 0) { includesEventsAndAttributes = true; }
        var propertiesUpdated = false;
        var propNames = Object.keys(properties);
        var propCount = propNames.length;
        if (propNames.indexOf('classes') === -1 && previousProperties.classes) {
            if (Array.isArray(previousProperties.classes)) {
                for (var i = 0; i < previousProperties.classes.length; i++) {
                    removeClasses(domNode, previousProperties.classes[i]);
                }
            }
            else {
                removeClasses(domNode, previousProperties.classes);
            }
        }
        includesEventsAndAttributes && removeOrphanedEvents(domNode, previousProperties, properties, projectionOptions);
        for (var i = 0; i < propCount; i++) {
            var propName = propNames[i];
            var propValue = properties[propName];
            var previousValue = previousProperties[propName];
            if (propName === 'classes') {
                var previousClasses = Array.isArray(previousValue) ? previousValue : [previousValue];
                var currentClasses = Array.isArray(propValue) ? propValue : [propValue];
                if (previousClasses && previousClasses.length > 0) {
                    if (!propValue || propValue.length === 0) {
                        for (var i_1 = 0; i_1 < previousClasses.length; i_1++) {
                            removeClasses(domNode, previousClasses[i_1]);
                        }
                    }
                    else {
                        var newClasses = tslib_1.__spread(currentClasses);
                        for (var i_2 = 0; i_2 < previousClasses.length; i_2++) {
                            var previousClassName = previousClasses[i_2];
                            if (previousClassName) {
                                var classIndex = newClasses.indexOf(previousClassName);
                                if (classIndex === -1) {
                                    removeClasses(domNode, previousClassName);
                                }
                                else {
                                    newClasses.splice(classIndex, 1);
                                }
                            }
                        }
                        for (var i_3 = 0; i_3 < newClasses.length; i_3++) {
                            addClasses(domNode, newClasses[i_3]);
                        }
                    }
                }
                else {
                    for (var i_4 = 0; i_4 < currentClasses.length; i_4++) {
                        addClasses(domNode, currentClasses[i_4]);
                    }
                }
            }
            else if (nodeOperations.indexOf(propName) !== -1) {
                nodeOperation(propName, propValue, previousValue, domNode, projectionOptions);
            }
            else if (propName === 'styles') {
                var styleNames = Object.keys(propValue);
                var styleCount = styleNames.length;
                for (var j = 0; j < styleCount; j++) {
                    var styleName = styleNames[j];
                    var newStyleValue = propValue[styleName];
                    var oldStyleValue = previousValue && previousValue[styleName];
                    if (newStyleValue === oldStyleValue) {
                        continue;
                    }
                    propertiesUpdated = true;
                    if (newStyleValue) {
                        checkStyleValue(newStyleValue);
                        projectionOptions.styleApplyer(domNode, styleName, newStyleValue);
                    }
                    else {
                        projectionOptions.styleApplyer(domNode, styleName, '');
                    }
                }
            }
            else {
                if (!propValue && typeof previousValue === 'string') {
                    propValue = '';
                }
                if (propName === 'value') {
                    var domValue = domNode[propName];
                    if (domValue !== propValue &&
                        (domNode['oninput-value']
                            ? domValue === domNode['oninput-value']
                            : propValue !== previousValue)) {
                        domNode[propName] = propValue;
                        domNode['oninput-value'] = undefined;
                    }
                    if (propValue !== previousValue) {
                        propertiesUpdated = true;
                    }
                }
                else if (propName !== 'key' && propValue !== previousValue) {
                    var type = typeof propValue;
                    if (type === 'function' && propName.lastIndexOf('on', 0) === 0 && includesEventsAndAttributes) {
                        updateEvent(domNode, propName.substr(2), propValue, projectionOptions, properties.bind, previousValue);
                    }
                    else if (type === 'string' && propName !== 'innerHTML' && includesEventsAndAttributes) {
                        updateAttribute(domNode, propName, propValue, projectionOptions);
                    }
                    else if (propName === 'scrollLeft' || propName === 'scrollTop') {
                        if (domNode[propName] !== propValue) {
                            domNode[propName] = propValue;
                        }
                    }
                    else {
                        domNode[propName] = propValue;
                    }
                    propertiesUpdated = true;
                }
            }
        }
        return propertiesUpdated;
    }
    function findIndexOfChild(children, sameAs, start) {
        for (var i = start; i < children.length; i++) {
            if (same(children[i], sameAs)) {
                return i;
            }
        }
        return -1;
    }
    function toParentVNode(domNode) {
        return {
            tag: '',
            properties: {},
            children: undefined,
            domNode: domNode,
            type: d_1.VNODE
        };
    }
    exports.toParentVNode = toParentVNode;
    function toTextVNode(data) {
        return {
            tag: '',
            properties: {},
            children: undefined,
            text: "" + data,
            domNode: undefined,
            type: d_1.VNODE
        };
    }
    exports.toTextVNode = toTextVNode;
    function toInternalWNode(instance, instanceData) {
        return {
            instance: instance,
            rendered: [],
            coreProperties: instanceData.coreProperties,
            children: instance.children,
            widgetConstructor: instance.constructor,
            properties: instanceData.inputProperties,
            type: d_1.WNODE
        };
    }
    function filterAndDecorateChildren(children, instance) {
        if (children === undefined) {
            return emptyArray;
        }
        children = Array.isArray(children) ? children : [children];
        for (var i = 0; i < children.length;) {
            var child = children[i];
            if (child === undefined || child === null) {
                children.splice(i, 1);
                continue;
            }
            else if (typeof child === 'string') {
                children[i] = toTextVNode(child);
            }
            else {
                if (d_1.isVNode(child)) {
                    if (child.properties.bind === undefined) {
                        child.properties.bind = instance;
                        if (child.children && child.children.length > 0) {
                            filterAndDecorateChildren(child.children, instance);
                        }
                    }
                }
                else {
                    if (!child.coreProperties) {
                        var instanceData = exports.widgetInstanceMap.get(instance);
                        child.coreProperties = {
                            bind: instance,
                            baseRegistry: instanceData.coreProperties.baseRegistry
                        };
                    }
                    if (child.children && child.children.length > 0) {
                        filterAndDecorateChildren(child.children, instance);
                    }
                }
            }
            i++;
        }
        return children;
    }
    exports.filterAndDecorateChildren = filterAndDecorateChildren;
    function nodeAdded(dnode, transitions) {
        if (d_1.isVNode(dnode) && dnode.properties) {
            var enterAnimation = dnode.properties.enterAnimation;
            if (enterAnimation) {
                if (typeof enterAnimation === 'function') {
                    enterAnimation(dnode.domNode, dnode.properties);
                }
                else {
                    transitions.enter(dnode.domNode, dnode.properties, enterAnimation);
                }
            }
        }
    }
    function nodeToRemove(dnode, transitions, projectionOptions) {
        if (d_1.isWNode(dnode)) {
            var item = instanceMap.get(dnode.instance);
            var rendered = (item ? item.dnode.rendered : dnode.rendered) || emptyArray;
            if (dnode.instance) {
                var instanceData = exports.widgetInstanceMap.get(dnode.instance);
                instanceData.onDetach();
                instanceMap.delete(dnode.instance);
            }
            for (var i = 0; i < rendered.length; i++) {
                nodeToRemove(rendered[i], transitions, projectionOptions);
            }
        }
        else {
            var domNode_1 = dnode.domNode;
            var properties = dnode.properties;
            if (dnode.children && dnode.children.length > 0) {
                for (var i = 0; i < dnode.children.length; i++) {
                    nodeToRemove(dnode.children[i], transitions, projectionOptions);
                }
            }
            var exitAnimation = properties.exitAnimation;
            if (properties && exitAnimation) {
                domNode_1.style.pointerEvents = 'none';
                var removeDomNode = function () {
                    domNode_1 && domNode_1.parentNode && domNode_1.parentNode.removeChild(domNode_1);
                    dnode.domNode = undefined;
                };
                if (typeof exitAnimation === 'function') {
                    exitAnimation(domNode_1, removeDomNode, properties);
                    return;
                }
                else {
                    transitions.exit(dnode.domNode, properties, exitAnimation, removeDomNode);
                    return;
                }
            }
            domNode_1 && domNode_1.parentNode && domNode_1.parentNode.removeChild(domNode_1);
            dnode.domNode = undefined;
        }
    }
    function checkDistinguishable(childNodes, indexToCheck, parentInstance) {
        var childNode = childNodes[indexToCheck];
        if (d_1.isVNode(childNode) && !childNode.tag) {
            return; // Text nodes need not be distinguishable
        }
        var key = childNode.properties.key;
        if (key === undefined || key === null) {
            for (var i = 0; i < childNodes.length; i++) {
                if (i !== indexToCheck) {
                    var node = childNodes[i];
                    if (same(node, childNode)) {
                        var nodeIdentifier = void 0;
                        var parentName = parentInstance.constructor.name || 'unknown';
                        if (d_1.isWNode(childNode)) {
                            nodeIdentifier = childNode.widgetConstructor.name || 'unknown';
                        }
                        else {
                            nodeIdentifier = childNode.tag;
                        }
                        console.warn("A widget (" + parentName + ") has had a child addded or removed, but they were not able to uniquely identified. It is recommended to provide a unique 'key' property when using the same widget or element (" + nodeIdentifier + ") multiple times as siblings");
                        break;
                    }
                }
            }
        }
    }
    function updateChildren(parentVNode, siblings, oldChildren, newChildren, parentInstance, projectionOptions) {
        oldChildren = oldChildren || emptyArray;
        newChildren = newChildren;
        var oldChildrenLength = oldChildren.length;
        var newChildrenLength = newChildren.length;
        var transitions = projectionOptions.transitions;
        var projectorState = projectorStateMap.get(projectionOptions.projectorInstance);
        projectionOptions = tslib_1.__assign({}, projectionOptions, { depth: projectionOptions.depth + 1 });
        var oldIndex = 0;
        var newIndex = 0;
        var i;
        var textUpdated = false;
        var _loop_1 = function () {
            var oldChild = oldIndex < oldChildrenLength ? oldChildren[oldIndex] : undefined;
            var newChild = newChildren[newIndex];
            if (d_1.isVNode(newChild) && typeof newChild.deferredPropertiesCallback === 'function') {
                newChild.inserted = d_1.isVNode(oldChild) && oldChild.inserted;
                addDeferredProperties(newChild, projectionOptions);
            }
            if (oldChild !== undefined && same(oldChild, newChild)) {
                oldIndex++;
                newIndex++;
                textUpdated =
                    updateDom(oldChild, newChild, projectionOptions, parentVNode, parentInstance, oldChildren.slice(oldIndex), newChildren.slice(newIndex)) || textUpdated;
                return "continue";
            }
            var findOldIndex = findIndexOfChild(oldChildren, newChild, oldIndex + 1);
            var addChild = function () {
                var insertBeforeDomNode = undefined;
                var childrenArray = oldChildren;
                var nextIndex = oldIndex + 1;
                var child = oldChildren[oldIndex];
                if (!child) {
                    child = siblings[0];
                    nextIndex = 1;
                    childrenArray = siblings;
                }
                if (child) {
                    var insertBeforeChildren = [child];
                    while (insertBeforeChildren.length) {
                        var insertBefore = insertBeforeChildren.shift();
                        if (d_1.isWNode(insertBefore)) {
                            var item = instanceMap.get(insertBefore.instance);
                            if (item && item.dnode.rendered) {
                                insertBeforeChildren.push.apply(insertBeforeChildren, tslib_1.__spread(item.dnode.rendered));
                            }
                        }
                        else {
                            if (insertBefore.domNode) {
                                if (insertBefore.domNode.parentElement !== parentVNode.domNode) {
                                    break;
                                }
                                insertBeforeDomNode = insertBefore.domNode;
                                break;
                            }
                        }
                        if (insertBeforeChildren.length === 0 && childrenArray[nextIndex]) {
                            insertBeforeChildren.push(childrenArray[nextIndex]);
                            nextIndex++;
                        }
                    }
                }
                createDom(newChild, parentVNode, newChildren.slice(newIndex + 1), insertBeforeDomNode, projectionOptions, parentInstance);
                nodeAdded(newChild, transitions);
                var indexToCheck = newIndex;
                projectorState.afterRenderCallbacks.push(function () {
                    checkDistinguishable(newChildren, indexToCheck, parentInstance);
                });
            };
            if (!oldChild || findOldIndex === -1) {
                addChild();
                newIndex++;
                return "continue";
            }
            var removeChild = function () {
                var indexToCheck = oldIndex;
                projectorState.afterRenderCallbacks.push(function () {
                    checkDistinguishable(oldChildren, indexToCheck, parentInstance);
                });
                if (d_1.isWNode(oldChild)) {
                    var item = instanceMap.get(oldChild.instance);
                    if (item) {
                        oldChild = item.dnode;
                    }
                }
                nodeToRemove(oldChild, transitions, projectionOptions);
            };
            var findNewIndex = findIndexOfChild(newChildren, oldChild, newIndex + 1);
            if (findNewIndex === -1) {
                removeChild();
                oldIndex++;
                return "continue";
            }
            addChild();
            removeChild();
            oldIndex++;
            newIndex++;
        };
        while (newIndex < newChildrenLength) {
            _loop_1();
        }
        if (oldChildrenLength > oldIndex) {
            var _loop_2 = function () {
                var indexToCheck = i;
                projectorState.afterRenderCallbacks.push(function () {
                    checkDistinguishable(oldChildren, indexToCheck, parentInstance);
                });
                var childToRemove = oldChildren[i];
                if (d_1.isWNode(childToRemove)) {
                    var item = instanceMap.get(childToRemove.instance);
                    if (item) {
                        childToRemove = item.dnode;
                    }
                }
                nodeToRemove(childToRemove, transitions, projectionOptions);
            };
            // Remove child fragments
            for (i = oldIndex; i < oldChildrenLength; i++) {
                _loop_2();
            }
        }
        return textUpdated;
    }
    function addChildren(parentVNode, children, projectionOptions, parentInstance, insertBefore, childNodes) {
        if (insertBefore === void 0) { insertBefore = undefined; }
        if (children === undefined) {
            return;
        }
        var projectorState = projectorStateMap.get(projectionOptions.projectorInstance);
        if (projectorState.merge && childNodes === undefined) {
            childNodes = array_1.from(parentVNode.domNode.childNodes);
        }
        var transitions = projectionOptions.transitions;
        projectionOptions = tslib_1.__assign({}, projectionOptions, { depth: projectionOptions.depth + 1 });
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var nextSiblings = children.slice(i + 1);
            if (d_1.isVNode(child)) {
                if (projectorState.merge && childNodes) {
                    var domElement = undefined;
                    while (child.domNode === undefined && childNodes.length > 0) {
                        domElement = childNodes.shift();
                        if (domElement && domElement.tagName === (child.tag.toUpperCase() || undefined)) {
                            child.domNode = domElement;
                        }
                    }
                }
                createDom(child, parentVNode, nextSiblings, insertBefore, projectionOptions, parentInstance);
            }
            else {
                createDom(child, parentVNode, nextSiblings, insertBefore, projectionOptions, parentInstance, childNodes);
            }
            nodeAdded(child, transitions);
        }
    }
    function initPropertiesAndChildren(domNode, dnode, parentInstance, projectionOptions) {
        addChildren(dnode, dnode.children, projectionOptions, parentInstance, undefined);
        if (typeof dnode.deferredPropertiesCallback === 'function' && dnode.inserted === undefined) {
            addDeferredProperties(dnode, projectionOptions);
        }
        if (dnode.attributes && dnode.events) {
            updateAttributes(domNode, {}, dnode.attributes, projectionOptions);
            updateProperties(domNode, {}, dnode.properties, projectionOptions, false);
            removeOrphanedEvents(domNode, {}, dnode.events, projectionOptions, true);
            var events_1 = dnode.events;
            Object.keys(events_1).forEach(function (event) {
                updateEvent(domNode, event, events_1[event], projectionOptions, dnode.properties.bind);
            });
        }
        else {
            updateProperties(domNode, {}, dnode.properties, projectionOptions);
        }
        if (dnode.properties.key !== null && dnode.properties.key !== undefined) {
            var instanceData = exports.widgetInstanceMap.get(parentInstance);
            instanceData.nodeHandler.add(domNode, "" + dnode.properties.key);
        }
        dnode.inserted = true;
    }
    function createDom(dnode, parentVNode, nextSiblings, insertBefore, projectionOptions, parentInstance, childNodes) {
        var domNode;
        var projectorState = projectorStateMap.get(projectionOptions.projectorInstance);
        if (d_1.isWNode(dnode)) {
            var widgetConstructor = dnode.widgetConstructor;
            var parentInstanceData = exports.widgetInstanceMap.get(parentInstance);
            if (!Registry_1.isWidgetBaseConstructor(widgetConstructor)) {
                var item = parentInstanceData.registry().get(widgetConstructor);
                if (item === null) {
                    return;
                }
                widgetConstructor = item;
            }
            var instance_1 = new widgetConstructor();
            dnode.instance = instance_1;
            nextSiblingMap.set(instance_1, nextSiblings);
            var instanceData_1 = exports.widgetInstanceMap.get(instance_1);
            instanceData_1.invalidate = function () {
                instanceData_1.dirty = true;
                if (instanceData_1.rendering === false) {
                    projectorState.renderQueue.push({ instance: instance_1, depth: projectionOptions.depth });
                    scheduleRender(projectionOptions);
                }
            };
            instanceData_1.rendering = true;
            instance_1.__setCoreProperties__(dnode.coreProperties);
            instance_1.__setChildren__(dnode.children);
            instance_1.__setProperties__(dnode.properties);
            var rendered = instance_1.__render__();
            instanceData_1.rendering = false;
            if (rendered) {
                var filteredRendered = filterAndDecorateChildren(rendered, instance_1);
                dnode.rendered = filteredRendered;
                addChildren(parentVNode, filteredRendered, projectionOptions, instance_1, insertBefore, childNodes);
            }
            instanceMap.set(instance_1, { dnode: dnode, parentVNode: parentVNode });
            instanceData_1.nodeHandler.addRoot();
            projectorState.afterRenderCallbacks.push(function () {
                instanceData_1.onAttach();
            });
        }
        else {
            if (projectorState.merge && projectorState.mergeElement !== undefined) {
                domNode = dnode.domNode = projectionOptions.mergeElement;
                projectorState.mergeElement = undefined;
                initPropertiesAndChildren(domNode, dnode, parentInstance, projectionOptions);
                return;
            }
            var doc = parentVNode.domNode.ownerDocument;
            if (!dnode.tag && typeof dnode.text === 'string') {
                if (dnode.domNode !== undefined && parentVNode.domNode) {
                    var newDomNode = dnode.domNode.ownerDocument.createTextNode(dnode.text);
                    if (parentVNode.domNode === dnode.domNode.parentNode) {
                        parentVNode.domNode.replaceChild(newDomNode, dnode.domNode);
                    }
                    else {
                        parentVNode.domNode.appendChild(newDomNode);
                        dnode.domNode.parentNode && dnode.domNode.parentNode.removeChild(dnode.domNode);
                    }
                    dnode.domNode = newDomNode;
                }
                else {
                    domNode = dnode.domNode = doc.createTextNode(dnode.text);
                    if (insertBefore !== undefined) {
                        parentVNode.domNode.insertBefore(domNode, insertBefore);
                    }
                    else {
                        parentVNode.domNode.appendChild(domNode);
                    }
                }
            }
            else {
                if (dnode.domNode === undefined) {
                    if (dnode.tag === 'svg') {
                        projectionOptions = tslib_1.__assign({}, projectionOptions, { namespace: NAMESPACE_SVG });
                    }
                    if (projectionOptions.namespace !== undefined) {
                        domNode = dnode.domNode = doc.createElementNS(projectionOptions.namespace, dnode.tag);
                    }
                    else {
                        domNode = dnode.domNode = dnode.domNode || doc.createElement(dnode.tag);
                    }
                }
                else {
                    domNode = dnode.domNode;
                }
                initPropertiesAndChildren(domNode, dnode, parentInstance, projectionOptions);
                if (insertBefore !== undefined) {
                    parentVNode.domNode.insertBefore(domNode, insertBefore);
                }
                else if (domNode.parentNode !== parentVNode.domNode) {
                    parentVNode.domNode.appendChild(domNode);
                }
            }
        }
    }
    function updateDom(previous, dnode, projectionOptions, parentVNode, parentInstance, oldNextSiblings, nextSiblings) {
        if (d_1.isWNode(dnode)) {
            var instance = previous.instance;
            var _a = instanceMap.get(instance), parentVNode_1 = _a.parentVNode, node = _a.dnode;
            var previousRendered = node ? node.rendered : previous.rendered;
            var instanceData = exports.widgetInstanceMap.get(instance);
            instanceData.rendering = true;
            instance.__setCoreProperties__(dnode.coreProperties);
            instance.__setChildren__(dnode.children);
            instance.__setProperties__(dnode.properties);
            nextSiblingMap.set(instance, nextSiblings);
            dnode.instance = instance;
            if (instanceData.dirty === true) {
                var rendered = instance.__render__();
                instanceData.rendering = false;
                dnode.rendered = filterAndDecorateChildren(rendered, instance);
                updateChildren(parentVNode_1, oldNextSiblings, previousRendered, dnode.rendered, instance, projectionOptions);
            }
            else {
                instanceData.rendering = false;
                dnode.rendered = previousRendered;
            }
            instanceMap.set(instance, { dnode: dnode, parentVNode: parentVNode_1 });
            instanceData.nodeHandler.addRoot();
        }
        else {
            if (previous === dnode) {
                return false;
            }
            var domNode_2 = (dnode.domNode = previous.domNode);
            var textUpdated = false;
            var updated = false;
            if (!dnode.tag && typeof dnode.text === 'string') {
                if (dnode.text !== previous.text) {
                    var newDomNode = domNode_2.ownerDocument.createTextNode(dnode.text);
                    domNode_2.parentNode.replaceChild(newDomNode, domNode_2);
                    dnode.domNode = newDomNode;
                    textUpdated = true;
                    return textUpdated;
                }
            }
            else {
                if (dnode.tag && dnode.tag.lastIndexOf('svg', 0) === 0) {
                    projectionOptions = tslib_1.__assign({}, projectionOptions, { namespace: NAMESPACE_SVG });
                }
                if (previous.children !== dnode.children) {
                    var children = filterAndDecorateChildren(dnode.children, parentInstance);
                    dnode.children = children;
                    updated =
                        updateChildren(dnode, oldNextSiblings, previous.children, children, parentInstance, projectionOptions) || updated;
                }
                var previousProperties_1 = buildPreviousProperties(domNode_2, previous, dnode);
                if (dnode.attributes && dnode.events) {
                    updateAttributes(domNode_2, previousProperties_1.attributes, dnode.attributes, projectionOptions);
                    updated =
                        updateProperties(domNode_2, previousProperties_1.properties, dnode.properties, projectionOptions, false) || updated;
                    removeOrphanedEvents(domNode_2, previousProperties_1.events, dnode.events, projectionOptions, true);
                    var events_2 = dnode.events;
                    Object.keys(events_2).forEach(function (event) {
                        updateEvent(domNode_2, event, events_2[event], projectionOptions, dnode.properties.bind, previousProperties_1.events[event]);
                    });
                }
                else {
                    updated =
                        updateProperties(domNode_2, previousProperties_1.properties, dnode.properties, projectionOptions) ||
                            updated;
                }
                if (dnode.properties.key !== null && dnode.properties.key !== undefined) {
                    var instanceData = exports.widgetInstanceMap.get(parentInstance);
                    instanceData.nodeHandler.add(domNode_2, "" + dnode.properties.key);
                }
            }
            if (updated && dnode.properties && dnode.properties.updateAnimation) {
                dnode.properties.updateAnimation(domNode_2, dnode.properties, previous.properties);
            }
        }
    }
    function addDeferredProperties(vnode, projectionOptions) {
        // transfer any properties that have been passed - as these must be decorated properties
        vnode.decoratedDeferredProperties = vnode.properties;
        var properties = vnode.deferredPropertiesCallback(!!vnode.inserted);
        var projectorState = projectorStateMap.get(projectionOptions.projectorInstance);
        vnode.properties = tslib_1.__assign({}, properties, vnode.decoratedDeferredProperties);
        projectorState.deferredRenderCallbacks.push(function () {
            var properties = tslib_1.__assign({}, vnode.deferredPropertiesCallback(!!vnode.inserted), vnode.decoratedDeferredProperties);
            updateProperties(vnode.domNode, vnode.properties, properties, projectionOptions);
            vnode.properties = properties;
        });
    }
    function runDeferredRenderCallbacks(projectionOptions) {
        var projectorState = projectorStateMap.get(projectionOptions.projectorInstance);
        if (projectorState.deferredRenderCallbacks.length) {
            if (projectionOptions.sync) {
                while (projectorState.deferredRenderCallbacks.length) {
                    var callback = projectorState.deferredRenderCallbacks.shift();
                    callback && callback();
                }
            }
            else {
                global_1.default.requestAnimationFrame(function () {
                    while (projectorState.deferredRenderCallbacks.length) {
                        var callback = projectorState.deferredRenderCallbacks.shift();
                        callback && callback();
                    }
                });
            }
        }
    }
    function runAfterRenderCallbacks(projectionOptions) {
        var projectorState = projectorStateMap.get(projectionOptions.projectorInstance);
        if (projectionOptions.sync) {
            while (projectorState.afterRenderCallbacks.length) {
                var callback = projectorState.afterRenderCallbacks.shift();
                callback && callback();
            }
        }
        else {
            if (global_1.default.requestIdleCallback) {
                global_1.default.requestIdleCallback(function () {
                    while (projectorState.afterRenderCallbacks.length) {
                        var callback = projectorState.afterRenderCallbacks.shift();
                        callback && callback();
                    }
                });
            }
            else {
                setTimeout(function () {
                    while (projectorState.afterRenderCallbacks.length) {
                        var callback = projectorState.afterRenderCallbacks.shift();
                        callback && callback();
                    }
                });
            }
        }
    }
    function scheduleRender(projectionOptions) {
        var projectorState = projectorStateMap.get(projectionOptions.projectorInstance);
        if (projectionOptions.sync) {
            render(projectionOptions);
        }
        else if (projectorState.renderScheduled === undefined) {
            projectorState.renderScheduled = global_1.default.requestAnimationFrame(function () {
                render(projectionOptions);
            });
        }
    }
    function render(projectionOptions) {
        var projectorState = projectorStateMap.get(projectionOptions.projectorInstance);
        projectorState.renderScheduled = undefined;
        var renderQueue = projectorState.renderQueue;
        var renders = tslib_1.__spread(renderQueue);
        projectorState.renderQueue = [];
        renders.sort(function (a, b) { return a.depth - b.depth; });
        var previouslyRendered = [];
        while (renders.length) {
            var instance = renders.shift().instance;
            if (instanceMap.has(instance) && previouslyRendered.indexOf(instance) === -1) {
                previouslyRendered.push(instance);
                var _a = instanceMap.get(instance), parentVNode = _a.parentVNode, dnode = _a.dnode;
                var instanceData = exports.widgetInstanceMap.get(instance);
                var nextSiblings = nextSiblingMap.get(instance);
                updateDom(dnode, toInternalWNode(instance, instanceData), projectionOptions, parentVNode, instance, nextSiblings, nextSiblings);
            }
        }
        runAfterRenderCallbacks(projectionOptions);
        runDeferredRenderCallbacks(projectionOptions);
    }
    exports.dom = {
        append: function (parentNode, instance, projectionOptions) {
            if (projectionOptions === void 0) { projectionOptions = {}; }
            var instanceData = exports.widgetInstanceMap.get(instance);
            var finalProjectorOptions = getProjectionOptions(projectionOptions, instance);
            var projectorState = {
                afterRenderCallbacks: [],
                deferredRenderCallbacks: [],
                nodeMap: new WeakMap_1.default(),
                renderScheduled: undefined,
                renderQueue: [],
                merge: projectionOptions.merge || false,
                mergeElement: projectionOptions.mergeElement
            };
            projectorStateMap.set(instance, projectorState);
            finalProjectorOptions.rootNode = parentNode;
            var parentVNode = toParentVNode(finalProjectorOptions.rootNode);
            var node = toInternalWNode(instance, instanceData);
            instanceMap.set(instance, { dnode: node, parentVNode: parentVNode });
            instanceData.invalidate = function () {
                instanceData.dirty = true;
                if (instanceData.rendering === false) {
                    projectorState.renderQueue.push({ instance: instance, depth: finalProjectorOptions.depth });
                    scheduleRender(finalProjectorOptions);
                }
            };
            updateDom(node, node, finalProjectorOptions, parentVNode, instance, [], []);
            projectorState.afterRenderCallbacks.push(function () {
                instanceData.onAttach();
            });
            runDeferredRenderCallbacks(finalProjectorOptions);
            runAfterRenderCallbacks(finalProjectorOptions);
            return {
                domNode: finalProjectorOptions.rootNode
            };
        },
        create: function (instance, projectionOptions) {
            return this.append(document.createElement('div'), instance, projectionOptions);
        },
        merge: function (element, instance, projectionOptions) {
            if (projectionOptions === void 0) { projectionOptions = {}; }
            projectionOptions.merge = true;
            projectionOptions.mergeElement = element;
            var projection = this.append(element.parentNode, instance, projectionOptions);
            var projectorState = projectorStateMap.get(instance);
            projectorState.merge = false;
            return projection;
        }
    };
});
//# sourceMappingURL=vdom.js.map