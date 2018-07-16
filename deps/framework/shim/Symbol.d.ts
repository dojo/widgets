declare global  {
    interface SymbolConstructor {
        observable: symbol;
    }
}
export declare let Symbol: SymbolConstructor;
/**
 * A custom guard function that determines if an object is a symbol or not
 * @param  {any}       value The value to check to see if it is a symbol or not
 * @return {is symbol}       Returns true if a symbol or not (and narrows the type guard)
 */
export declare function isSymbol(value: any): value is symbol;
export default Symbol;
export {};
