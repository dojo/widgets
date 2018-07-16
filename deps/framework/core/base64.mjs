import global from '../shim/global';
import has, { add as hasAdd } from '../has/has';
hasAdd('btoa', 'btoa' in global, true);
hasAdd('atob', 'atob' in global, true);
/**
 * Take a string encoded in base64 and decode it
 * @param encodedString The base64 encoded string
 */
export const decode = has('atob')
    ? function (encodedString) {
        /* this allows for utf8 characters to be decoded properly */
        return decodeURIComponent(Array.prototype.map
            .call(atob(encodedString), (char) => '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2))
            .join(''));
    }
    : function (encodedString) {
        return new Buffer(encodedString.toString(), 'base64').toString('utf8');
    };
/**
 * Take a string and encode it to base64
 * @param rawString The string to encode
 */
export const encode = has('btoa')
    ? function (decodedString) {
        /* this allows for utf8 characters to be encoded properly */
        return btoa(encodeURIComponent(decodedString).replace(/%([0-9A-F]{2})/g, (match, code) => String.fromCharCode(Number('0x' + code))));
    }
    : function (rawString) {
        return new Buffer(rawString.toString(), 'utf8').toString('base64');
    };
//# sourceMappingURL=base64.mjs.map