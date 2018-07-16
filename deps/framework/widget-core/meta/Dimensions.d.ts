import { Base } from './Base';
export interface TopLeft {
    left: number;
    top: number;
}
export interface BottomRight {
    bottom: number;
    right: number;
}
export interface Size {
    height: number;
    width: number;
}
export interface DimensionResults {
    position: TopLeft & BottomRight;
    offset: TopLeft & Size;
    size: Size;
    scroll: TopLeft & Size;
    client: TopLeft & Size;
}
export declare class Dimensions extends Base {
    get(key: string | number): Readonly<DimensionResults>;
}
export default Dimensions;
