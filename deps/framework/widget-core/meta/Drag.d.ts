import { Base } from './Base';
export interface DragResults {
    /**
     * The movement of pointer during the duration of the drag state
     */
    delta: Position;
    /**
     * Is the DOM node currently in a drag state
     */
    isDragging: boolean;
    /**
     * A matrix of posistions that represent the start position for the current drag interaction
     */
    start?: PositionMatrix;
}
/**
 * An x/y position structure
 */
export interface Position {
    x: number;
    y: number;
}
/**
 * A matrix of x/y positions
 */
export interface PositionMatrix {
    /**
     * Client x/y position
     */
    client: Position;
    /**
     * Offset x/y position
     */
    offset: Position;
    /**
     * Page x/y position
     */
    page: Position;
    /**
     * Screen x/y position
     */
    screen: Position;
}
export declare class Drag extends Base {
    private _boundInvalidate;
    get(key: string | number): Readonly<DragResults>;
}
export default Drag;
