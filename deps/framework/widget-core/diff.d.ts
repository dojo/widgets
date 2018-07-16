import { PropertyChangeRecord } from './interfaces';
export declare function always(previousProperty: any, newProperty: any): PropertyChangeRecord;
export declare function ignore(previousProperty: any, newProperty: any): PropertyChangeRecord;
export declare function reference(previousProperty: any, newProperty: any): PropertyChangeRecord;
export declare function shallow(previousProperty: any, newProperty: any): PropertyChangeRecord;
export declare function auto(previousProperty: any, newProperty: any): PropertyChangeRecord;
