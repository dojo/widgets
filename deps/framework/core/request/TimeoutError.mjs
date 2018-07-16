export class TimeoutError {
    get name() {
        return 'TimeoutError';
    }
    constructor(message) {
        message = message || 'The request timed out';
        this.message = message;
    }
}
export default TimeoutError;
//# sourceMappingURL=TimeoutError.mjs.map