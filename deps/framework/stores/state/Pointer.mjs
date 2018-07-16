export function decode(segment) {
    return segment.replace(/~1/g, '/').replace(/~0/g, '~');
}
function encode(segment) {
    return segment.replace(/~/g, '~0').replace(/\//g, '~1');
}
export function walk(segments, object, clone = true, continueOnUndefined = true) {
    if (clone) {
        object = Object.assign({}, object);
    }
    const pointerTarget = {
        object,
        target: object,
        segment: ''
    };
    return segments.reduce((pointerTarget, segment, index) => {
        if (pointerTarget.target === undefined) {
            return pointerTarget;
        }
        if (Array.isArray(pointerTarget.target) && segment === '-') {
            segment = String(pointerTarget.target.length - 1);
        }
        if (index + 1 < segments.length) {
            const nextSegment = segments[index + 1];
            let target = pointerTarget.target[segment];
            if (target === undefined && !continueOnUndefined) {
                pointerTarget.target = undefined;
                return pointerTarget;
            }
            if (clone || target === undefined) {
                if (Array.isArray(target)) {
                    target = [...target];
                }
                else if (typeof target === 'object') {
                    target = Object.assign({}, target);
                }
                else if (isNaN(parseInt(nextSegment, 0))) {
                    target = {};
                }
                else {
                    target = [];
                }
                pointerTarget.target[segment] = target;
                pointerTarget.target = target;
            }
            else {
                pointerTarget.target = target;
            }
        }
        else {
            pointerTarget.segment = segment;
        }
        return pointerTarget;
    }, pointerTarget);
}
export class Pointer {
    constructor(segments) {
        if (Array.isArray(segments)) {
            this._segments = segments;
        }
        else {
            this._segments = (segments[0] === '/' ? segments : `/${segments}`).split('/');
            this._segments.shift();
        }
        if (segments.length === 0 || ((segments.length === 1 && segments[0] === '/') || segments[0] === '')) {
            throw new Error('Access to the root is not supported.');
        }
        this._segments = this._segments.map(decode);
    }
    get segments() {
        return this._segments;
    }
    get path() {
        return `/${this._segments.map(encode).join('/')}`;
    }
    get(object) {
        const pointerTarget = walk(this.segments, object, false, false);
        if (pointerTarget.target === undefined) {
            return undefined;
        }
        return pointerTarget.target[pointerTarget.segment];
    }
    toJSON() {
        return this.toString();
    }
    toString() {
        return this.path;
    }
}
//# sourceMappingURL=Pointer.mjs.map