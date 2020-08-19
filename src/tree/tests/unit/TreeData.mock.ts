import { TreeNodeOption } from '../../index';

//
//  + parent-1
//    + leaf-1-1
//  + parent-2
//
export const simpleTree: TreeNodeOption[] = [
	{
		id: 'parent-1',
		value: 'parent 1',
		parent: 'root',
		hasChildren: true
	},
	{
		id: 'leaf-1-1',
		value: 'leaf 1-1',
		parent: 'parent-1',
		hasChildren: false
	},
	{
		id: 'parent-2',
		value: 'parent-2',
		parent: 'root',
		hasChildren: false
	}
];
