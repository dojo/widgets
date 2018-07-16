import { PatchOperation } from './state/Patch';
import { State, Store } from './Store';
/**
 * Default Payload interface
 */
export interface DefaultPayload {
    [index: string]: any;
}
/**
 * The arguments passed to a `Command`
 */
export interface CommandRequest<T = any, P extends object = DefaultPayload> extends State<T> {
    payload: P;
}
/**
 * A command factory interface. Returns the passed command. This provides a way to automatically infer and/or
 * verify the type of multiple commands without explicitly specifying the generic for each command
 */
export interface CommandFactory<T = any, P extends object = DefaultPayload> {
    <R extends object = P>(command: Command<T, R>): Command<T, R>;
}
/**
 * Command that returns patch operations based on the command request
 */
export interface Command<T = any, P extends object = DefaultPayload> {
    (request: CommandRequest<T, P>): Promise<PatchOperation<T>[]> | PatchOperation<T>[];
}
/**
 * Transformer function
 */
export interface Transformer<P extends object = DefaultPayload, R extends object = DefaultPayload> {
    (payload: R): P;
}
/**
 * A process that returns an executor using a Store and Transformer
 */
export interface Process<T = any, P extends object = DefaultPayload> {
    <R extends object = DefaultPayload>(store: Store<T>, transformer: Transformer<P, R>): ProcessExecutor<T, P, R>;
    (store: Store<T>): ProcessExecutor<T, P, P>;
}
/**
 * Represents an error from a ProcessExecutor
 */
export interface ProcessError<T = any> {
    error: Error | null;
    command?: Command<T, any>[] | Command<T, any>;
}
export interface ProcessResultExecutor<T = any> {
    <P extends object = DefaultPayload, R extends object = DefaultPayload>(process: Process<T, P>, payload: R, transformer: Transformer<P, R>): Promise<ProcessResult<T, P> | ProcessError<T>>;
    <P extends object = object>(process: Process<T, P>, payload: P): Promise<ProcessResult<T, P> | ProcessError<T>>;
}
/**
 * Represents a successful result from a ProcessExecutor
 */
export interface ProcessResult<T = any, P extends object = DefaultPayload> extends State<T> {
    executor: ProcessResultExecutor<T>;
    store: Store<T>;
    operations: PatchOperation<T>[];
    undoOperations: PatchOperation<T>[];
    apply: (operations: PatchOperation<T>[], invalidate?: boolean) => PatchOperation<T>[];
    payload: P;
    id: string;
    error?: ProcessError<T> | null;
}
/**
 * Runs a process for the given arguments.
 */
export interface ProcessExecutor<T = any, P extends object = DefaultPayload, R extends object = DefaultPayload> {
    (payload: R): Promise<ProcessResult<T, P>>;
}
/**
 * Callback for a process, returns an error as the first argument
 */
export interface ProcessCallback<T = any> {
    (error: ProcessError<T> | null, result: ProcessResult<T>): void;
}
/**
 * Function for undoing operations
 */
export interface Undo {
    (): void;
}
/**
 * ProcessCallbackDecorator callback
 */
export interface ProcessCallbackDecorator {
    (callback?: ProcessCallback): ProcessCallback;
}
/**
 * CreateProcess factory interface
 */
export interface CreateProcess<T = any, P extends object = DefaultPayload> {
    (id: string, commands: (Command<T, P>[] | Command<T, P>)[], callback?: ProcessCallback<T>): Process<T, P>;
}
/**
 * Creates a command factory with the specified type
 */
export declare function createCommandFactory<T, P extends object = DefaultPayload>(): CommandFactory<T, P>;
/**
 * Commands that can be passed to a process
 */
export declare type Commands<T = any, P extends object = DefaultPayload> = (Command<T, P>[] | Command<T, P>)[];
export declare function getProcess(id: string): any;
export declare function processExecutor<T = any, P extends object = DefaultPayload>(id: string, commands: Commands<T, P>, store: Store<T>, callback: ProcessCallback | undefined, transformer: Transformer<P> | undefined): ProcessExecutor<T, any, any>;
/**
 * Factories a process using the provided commands and an optional callback. Returns an executor used to run the process.
 *
 * @param commands The commands for the process
 * @param callback Callback called after the process is completed
 */
export declare function createProcess<T = any, P extends object = DefaultPayload>(id: string, commands: Commands<T, P>, callback?: ProcessCallback): Process<T, P>;
/**
 * Creates a process factory that will create processes with the specified callback decorators applied.
 * @param callbackDecorators array of process callback decorators to be used by the return factory.
 */
export declare function createProcessFactoryWith(callbackDecorators: ProcessCallbackDecorator[]): CreateProcess;
/**
 * Creates a `ProcessCallbackDecorator` from a `ProcessCallback`.
 * @param processCallback the process callback to convert to a decorator.
 */
export declare function createCallbackDecorator(processCallback: ProcessCallback): ProcessCallbackDecorator;
