import { Offset } from './offset.model';

export interface PointerOffset extends Offset {
	raw: {
		x: number;
		y: number;
	};
	tmp: {
		x: number;
		y: number;
	};
}
