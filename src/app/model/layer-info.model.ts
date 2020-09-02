export interface LayerInfo {
	name: string;
	uniqueId: string;
	hidden: {
		current: boolean;
		prev: boolean;
	};
	psd: any;
	children: LayerInfo[];
}
