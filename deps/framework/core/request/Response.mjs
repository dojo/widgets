import Promise from '../../shim/Promise';
class Response {
    json() {
        return this.text().then(JSON.parse);
    }
}
export default Response;
export function getFileReaderPromise(reader) {
    return new Promise((resolve, reject) => {
        reader.onload = function () {
            resolve(reader.result);
        };
        reader.onerror = function () {
            reject(reader.error);
        };
    });
}
export function getTextFromBlob(blob) {
    const reader = new FileReader();
    const promise = getFileReaderPromise(reader);
    reader.readAsText(blob);
    return promise;
}
export function getArrayBufferFromBlob(blob) {
    const reader = new FileReader();
    const promise = getFileReaderPromise(reader);
    reader.readAsArrayBuffer(blob);
    return promise;
}
export function getTextFromArrayBuffer(buffer) {
    const view = new Uint8Array(buffer);
    const chars = [];
    view.forEach((charCode, index) => {
        chars[index] = String.fromCharCode(charCode);
    });
    return chars.join('');
}
//# sourceMappingURL=Response.mjs.map