import { Handle } from '../../core/interfaces';
import { Constructor, DNode } from './../interfaces';
import { WidgetBase } from './../WidgetBase';
import { Registry } from './../Registry';
/**
 * Represents the attach state of the projector
 */
export declare enum ProjectorAttachState {
    Attached = 1,
    Detached = 2,
}
/**
 * Attach type for the projector
 */
export declare enum AttachType {
    Append = 1,
    Merge = 2,
}
export interface AttachOptions {
    /**
     * If `'append'` it will appended to the root. If `'merge'` it will merged with the root. If `'replace'` it will
     * replace the root.
     */
    type: AttachType;
    /**
     * Element to attach the projector.
     */
    root?: Element;
}
export interface ProjectorProperties {
    registry?: Registry;
}
export interface ProjectorMixin<P> {
    readonly properties: Readonly<P> & Readonly<ProjectorProperties>;
    /**
     * Append the projector to the root.
     */
    append(root?: Element): Handle;
    /**
     * Merge the projector onto the root.
     *
     * The `root` and any of its `children` will be re-used.  Any excess DOM nodes will be ignored and any missing DOM nodes
     * will be created.
     * @param root The root element that the root virtual DOM node will be merged with.  Defaults to `document.body`.
     */
    merge(root?: Element): Handle;
    /**
     * Attach the project to a _sandboxed_ document fragment that is not part of the DOM.
     *
     * When sandboxed, the `Projector` will run in a sync manner, where renders are completed within the same turn.
     * The `Projector` creates a `DocumentFragment` which replaces any other `root` that has been set.
     * @param doc The `Document` to use, which defaults to the global `document`.
     */
    sandbox(doc?: Document): void;
    /**
     * Sets the properties for the widget. Responsible for calling the diffing functions for the properties against the
     * previous properties. Runs though any registered specific property diff functions collecting the results and then
     * runs the remainder through the catch all diff function. The aggregate of the two sets of the results is then
     * set as the widget's properties
     *
     * @param properties The new widget properties
     */
    setProperties(properties: this['properties']): void;
    /**
     * Sets the widget's children
     */
    setChildren(children: DNode[]): void;
    /**
     * Return a `string` that represents the HTML of the current projection.  The projector needs to be attached.
     */
    toHtml(): string;
    /**
     * Indicates if the projectors is in async mode, configured to `true` by defaults.
     */
    async: boolean;
    /**
     * Root element to attach the projector
     */
    root: Element;
    /**
     * The status of the projector
     */
    readonly projectorState: ProjectorAttachState;
    /**
     * Runs registered destroy handles
     */
    destroy(): void;
}
export declare function ProjectorMixin<P, T extends Constructor<WidgetBase<P>>>(Base: T): T & Constructor<ProjectorMixin<P>>;
export default ProjectorMixin;
