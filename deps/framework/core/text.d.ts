import { AmdRequire, AmdConfig } from './interfaces';
export declare function get(url: string): Promise<string | null>;
export declare function normalize(id: string, toAbsMid: (moduleId: string) => string): string;
export declare function load(id: string, require: AmdRequire, load: (value?: any) => void, config?: AmdConfig): void;
