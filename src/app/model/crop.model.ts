import { Offset } from './offset.model';

export interface Crop {
	offset: Offset;
	size: {
		width: number;
		height: number;
	};
}
