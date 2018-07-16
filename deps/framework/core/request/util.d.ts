import { RequestOptions } from './interfaces';
/**
 * Returns a URL formatted with optional query string and cache-busting segments.
 *
 * @param url The base URL.
 * @param options The RequestOptions used to generate the query string or cacheBust.
 */
export declare function generateRequestUrl(url: string, options?: RequestOptions): string;
export declare function getStringFromFormData(formData: any): string;
