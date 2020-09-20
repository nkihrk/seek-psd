import { Injectable } from '@angular/core';
import { LayerInfo } from '../../model/layer-info.model';
import { MemoryService } from './memory.service';
import { Layer } from 'ag-psd';

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
		const aspect: number = this.memory.renderer.psd.height / this.memory.renderer.psd.width;

		// Main renderer
		const c: HTMLCanvasElement = this.memory.renderer.element.main;
		c.width = this.memory.renderer.element.psdViewer.getBoundingClientRect().width - 60 - 2;
		c.height = c.width * aspect;
		const ctx: CanvasRenderingContext2D = c.getContext('2d');

		// Buffer
		const cBuffer: HTMLCanvasElement = this.memory.renderer.element.buffer;
		cBuffer.width = this.memory.renderer.psd.width;
		cBuffer.height = this.memory.renderer.psd.height;
		const ctxBuffer: CanvasRenderingContext2D = cBuffer.getContext('2d');

		const root: LayerInfo[] = this.memory.layerInfos$.getValue();
		this.parseLayers(root, ctxBuffer);

		// Flip
		if (this.memory.isFlip$.getValue()) {
			ctx.translate(c.width, 0);
			ctx.scale(-1, 1);
		}

		// Render to the screen
		ctx.drawImage(cBuffer, 0, 0, c.width, c.height);

		// Grayscale
		if (this.memory.isGrayscale$.getValue()) {
			this.grayscale(ctx, c.width, c.height);
		}
	}

	private parseLayers($root: LayerInfo[], $ctx: CanvasRenderingContext2D): void {
		this.recursive($root, ($layer: LayerInfo, $layerInfos: LayerInfo[], $index: number) => {
			const psd: Layer = $layer.psd;

			if ($layer.hidden.current || !psd?.canvas) return;

			let canvas: HTMLCanvasElement = psd.canvas;
			let x: number = psd.left;
			let y: number = psd.top;
			let w: number = psd.right - psd.left;
			let h: number = psd.bottom - psd.top;

			$ctx.save();
			// Set opacity
			$ctx.globalAlpha = psd.opacity;

			// Blend mode
			let blendMode = '';
			if (psd.blendMode === 'overlay') {
				blendMode = 'overlay';
			} else if (psd.blendMode === 'screen') {
				blendMode = 'screen';
			} else if (psd.blendMode === 'multiply') {
				blendMode = 'multiply';
			} else if (psd.blendMode === 'linear dodge') {
				blendMode = 'lighter';
			} else if (psd.blendMode === 'soft light') {
				blendMode = 'soft-light';
			} else if (psd.blendMode === 'hard light') {
				blendMode = 'hard-light';
			} else if (psd.blendMode === 'color burn') {
				blendMode = 'color-burn';
			} else if (psd.blendMode === 'saturation') {
				blendMode = 'saturation';
			} else if (psd.blendMode === 'hue') {
				blendMode = 'hue';
			} else if (psd.blendMode === 'color') {
				blendMode = 'color';
			} else if (psd.blendMode === 'color dodge') {
				blendMode = 'color-dodge';
			} else {
				blendMode = 'source-over';
			}
			$ctx.globalCompositeOperation = blendMode;

			if ($layer.psd.clipping) {
				for (let i = $index; i < $layerInfos.length; i++) {
					if ($layerInfos[i].psd.clipping) continue;

					const source: Layer = $layer.psd;
					const target: Layer = $layerInfos[i].psd;

					const maskCanvas: HTMLCanvasElement = document.createElement('canvas');
					maskCanvas.width = this.memory.renderer.psd.width;
					maskCanvas.height = this.memory.renderer.psd.height;
					const maskCtxBuffer: CanvasRenderingContext2D = maskCanvas.getContext('2d');

					maskCtxBuffer.globalCompositeOperation = 'source-over';
					const sourceW: number = source.right - source.left;
					const sourceH: number = source.bottom - source.top;
					maskCtxBuffer.drawImage(source.canvas, source.left, source.top, sourceW, sourceH);

					maskCtxBuffer.globalCompositeOperation = 'destination-in';
					const targetW: number = target.right - target.left;
					const targetH: number = target.bottom - target.top;

					// If the target has no canvas, it is folder,
					// which means folder clipping
					if (!!target.canvas) {
						maskCtxBuffer.drawImage(target.canvas, target.left, target.top, targetW, targetH);
					} else {
						console.log($layer.name);
						const subRoot: LayerInfo[] = $layerInfos[i].children;
						const subC: HTMLCanvasElement = this.parseSubLayers(subRoot);

						maskCtxBuffer.drawImage(subC, 0, 0, maskCanvas.width, maskCanvas.height);

						console.log('---');
					}

					canvas = maskCanvas;
					x = 0;
					y = 0;
					w = maskCanvas.width;
					h = maskCanvas.height;
					break;
				}
			}

			$ctx.drawImage(canvas, x, y, w, h);
			$ctx.restore();
		});
	}

	private parseSubLayers($subRoot: LayerInfo[]): HTMLCanvasElement {
		const c: HTMLCanvasElement = document.createElement('canvas');
		c.width = this.memory.renderer.psd.width;
		c.height = this.memory.renderer.psd.height;
		const ctx: CanvasRenderingContext2D = c.getContext('2d');

		this.recursive($subRoot, ($layer: LayerInfo, $layerInfos: LayerInfo[], $index: number) => {
			if ($layer.hidden.current || $layer.psd.clipping) return;

			const psd: Layer = $layer.psd;

			if (!!psd.canvas) {
				const canvas: HTMLCanvasElement = psd.canvas;
				const x: number = psd.left;
				const y: number = psd.top;
				const w: number = psd.right - psd.left;
				const h: number = psd.bottom - psd.top;

				ctx.drawImage(canvas, x, y, w, h);
			} else {
				console.log($layer.name);
				const subRoot: LayerInfo[] = $layer.children;
				const subC: HTMLCanvasElement = this.parseSubLayers(subRoot);
				ctx.drawImage(subC, 0, 0, c.width, c.height);
			}
		});

		return c;
	}

	private grayscale($ctx: CanvasRenderingContext2D, $w: number, $h: number): void {
		const pixels: ImageData = $ctx.getImageData(0, 0, $w, $h);
		for (let y = 0; y < pixels.height; y++) {
			for (let x = 0; x < pixels.width; x++) {
				const i: number = y * 4 * pixels.width + x * 4;
				const rgb = Number((pixels.data[i] + pixels.data[i + 1] + pixels.data[i + 2]) / 3);
				pixels.data[i] = rgb;
				pixels.data[i + 1] = rgb;
				pixels.data[i + 2] = rgb;
			}
		}

		$ctx.putImageData(pixels, 0, 0, 0, 0, pixels.width, pixels.height);
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
			const state: number = $callback($root[i], $root, i);

			if (state === 0) return;

			if (!$root[i].children?.length) continue;
			this.recursive($root[i].children, $callback);
		}
	}
}
