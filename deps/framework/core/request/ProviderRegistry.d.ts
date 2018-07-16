import { Provider, ProviderTest } from './interfaces';
import MatchRegistry from '../MatchRegistry';
import { Handle } from '../interfaces';
export declare class ProviderRegistry extends MatchRegistry<Provider> {
    setDefaultProvider(provider: Provider): void;
    register(test: string | RegExp | ProviderTest | null, value: Provider, first?: boolean): Handle;
}
export default ProviderRegistry;
