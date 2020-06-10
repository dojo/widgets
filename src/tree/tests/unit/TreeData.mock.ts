import { TreeNodeOption, LinkedTreeNode } from '../../index';

//
//  + parent-1
//    + leaf-1-1
//  + parent-2
//
export const simpleTree: TreeNodeOption[] = [
	{
		id: 'parent-1',
		value: 'parent 1'
	},
	{
		id: 'leaf-1-1',
		value: 'leaf 1-1',
		parent: 'parent-1'
	},
	{
		id: 'parent-2',
		value: 'parent-2'
	}
];

export const simpleTreeLinked: LinkedTreeNode[] = [
	{
		id: simpleTree[0].id,
		node: simpleTree[0],
		depth: 0,
		children: [
			{
				id: simpleTree[1].id,
				node: simpleTree[1],
				depth: 1,
				children: []
			}
		]
	},
	{
		id: simpleTree[1].id,
		node: simpleTree[1],
		depth: 1,
		children: []
	},
	{
		id: simpleTree[2].id,
		node: simpleTree[2],
		depth: 0,
		children: []
	}
];
