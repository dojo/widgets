import { ProcessCallback } from '../process';
import { PatchOperation } from '../state/Patch';
import Store from '../Store';
export interface HistoryOperation {
    id: string;
    operations: PatchOperation[];
}
export interface HistoryData {
    history: HistoryOperation[];
    redo: HistoryOperation[];
}
export declare class HistoryManager {
    private _storeMap;
    collector(callback?: ProcessCallback): ProcessCallback;
    canUndo(store: Store): boolean;
    canRedo(store: Store): boolean;
    redo(store: Store): void;
    undo(store: Store): void;
    deserialize(store: Store, data: HistoryData): void;
    serialize(store: Store): HistoryData;
}
export default HistoryManager;
