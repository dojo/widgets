import { AmdRequire, NodeRequire } from './interfaces';
import { isPlugin, useDefault } from './load/util';
export declare type Require = AmdRequire | NodeRequire;
export interface Load {
    (require: Require, ...moduleIds: string[]): Promise<any[]>;
    (...moduleIds: string[]): Promise<any[]>;
}
export declare function isAmdRequire(object: any): object is AmdRequire;
export declare function isNodeRequire(object: any): object is NodeRequire;
declare const load: Load;
export default load;
export { isPlugin, useDefault };
