import { Layer } from 'ag-psd';

export interface LayerInfo {
	name: string;
	uniqueId: string;
	hidden: {
		current: boolean;
		prev: boolean;
		parent: boolean;
	};
	folderCanvas: HTMLCanvasElement;
	psd: Layer;
	children: LayerInfo[];
}
