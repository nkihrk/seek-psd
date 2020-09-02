import { Injectable } from '@angular/core';
import { LayerInfo } from '../../model/layer-info.model';
import { MemoryService } from './memory.service';

@Injectable({
	providedIn: 'root'
})
export class GpuService {
	constructor(private memory: MemoryService) {}

	render(): void {
		const c: HTMLCanvasElement = this.memory.renderer.element.main;
		c.width = this.memory.renderer.size.width;
		c.height = this.memory.renderer.size.height;
		const ctx: CanvasRenderingContext2D = c.getContext('2d');
		const w: number = this.memory.renderer.psd.width * this.memory.renderer.size.scaleRatio;
		const h: number = this.memory.renderer.psd.height * this.memory.renderer.size.scaleRatio;

		ctx.drawImage(this.memory.renderer.psd.canvas, 0, 0, w, h);
	}

	reRender(): void {
		const c: HTMLCanvasElement = this.memory.renderer.element.main;
		c.width = this.memory.renderer.size.width;
		c.height = this.memory.renderer.size.height;
		const ctx: CanvasRenderingContext2D = c.getContext('2d');

		const root = this.memory.layerInfos$.getValue();
		this.recursive(root, ($layer: LayerInfo) => {
			const psd = $layer.psd;
			if ($layer.hidden.current || !psd?.canvas) return;

			const x: number = psd.left * this.memory.renderer.size.scaleRatio;
			const y: number = psd.top * this.memory.renderer.size.scaleRatio;
			const w: number = (psd.right - psd.left) * this.memory.renderer.size.scaleRatio;
			const h: number = (psd.bottom - psd.top) * this.memory.renderer.size.scaleRatio;

			ctx.save();
			// Set opacity
			ctx.globalAlpha = psd.opacity;

			// Blend mode
			if (psd.blendMode === 'overlay') {
				ctx.globalCompositeOperation = 'overlay';
			} else if (psd.blendMode === 'screen') {
				ctx.globalCompositeOperation = 'screen';
			} else if (psd.blendMode === 'multiply') {
				ctx.globalCompositeOperation = 'multiply';
			} else if (psd.blendMode === 'linear dodge') {
				ctx.globalCompositeOperation = 'lighter';
			} else if (psd.blendMode === 'soft light') {
				ctx.globalCompositeOperation = 'soft-light';
			}

			ctx.drawImage(psd.canvas, x, y, w, h);
			ctx.restore();
		});
	}

	toggleVisibility($name: string, $uniqueId: string): void {
		const root: LayerInfo[] = this.memory.layerInfos$.getValue();
		this.recursive(root, ($layer: LayerInfo) => {
			if ($name === $layer.name && $uniqueId === $layer.uniqueId) {
				// Folder layer
				if ($layer.children.length > 0) {
					if ($layer.hidden.current) {
						const root: LayerInfo[] = $layer.children;
						this.recursive(root, ($subLayer: LayerInfo) => {
							$subLayer.hidden.current = $subLayer.hidden.prev;
						});
					} else {
						const root: LayerInfo[] = $layer.children;
						this.recursive(root, ($subLayer: LayerInfo) => {
							$subLayer.hidden.prev = $subLayer.hidden.current;
							$subLayer.hidden.current = !$layer.hidden.current;
						});
					}
				}

				$layer.hidden.current = !$layer.hidden.current;

				// To get rid of loop
				return 0;
			}
		});
	}

	private recursive($root: any[], $callback: Function): void {
		for (let i = $root.length - 1; i > -1; i--) {
			const state: number = $callback($root[i]);

			if (state === 0) return;

			if (!$root[i].children?.length) continue;
			this.recursive($root[i].children, $callback);
		}
	}
}
