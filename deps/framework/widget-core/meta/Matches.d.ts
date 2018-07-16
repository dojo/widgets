import { Base } from './Base';
export default class Matches extends Base {
    /**
     * Determine if the target of a particular `Event` matches the virtual DOM key
     * @param key The virtual DOM key
     * @param event The event object
     */
    get(key: string | number, event: Event): boolean;
}
