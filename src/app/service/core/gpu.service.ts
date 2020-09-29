import { Injectable } from '@angular/core';
import { LayerInfo } from '../../model/layer-info.model';
import { MemoryService } from './memory.service';
import { Layer, LayerMaskData } from 'ag-psd';

@Injectable({
	providedIn: 'root'
})
export class GpuService {
	constructor(private memory: MemoryService) {}

	get rawPsdCanvas(): HTMLCanvasElement {
		// Main
		const c: HTMLCanvasElement = document.createElement('canvas');
		c.width = this.memory.renderer.psd.width;
		c.height = this.memory.renderer.psd.height;
		const ctx: CanvasRenderingContext2D = c.getContext('2d');

		// Buffer
		const cBuffer: HTMLCanvasElement = document.createElement('canvas');
		cBuffer.width = c.width;
		cBuffer.height = c.height;
		const ctxBuffer: CanvasRenderingContext2D = cBuffer.getContext('2d');

		const root: LayerInfo[] = this.memory.layerInfos$.getValue();
		this.parseLayers(root, ctxBuffer, c.width, c.height, 1);

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

		return c;
	}

	render(): void {
		const aspect: number = this.memory.renderer.psd.height / this.memory.renderer.psd.width;

		// Main renderer
		const c: HTMLCanvasElement = this.memory.renderer.element.main;
		c.width = this.memory.renderer.element.main.getBoundingClientRect().width;
		c.height = c.width * aspect;
		const ctx: CanvasRenderingContext2D = c.getContext('2d');

		// Buffer
		const cBuffer: HTMLCanvasElement = this.memory.renderer.element.buffer;
		cBuffer.width = c.width;
		cBuffer.height = c.height;
		const ctxBuffer: CanvasRenderingContext2D = cBuffer.getContext('2d');

		const root: LayerInfo[] = this.memory.layerInfos$.getValue();
		const scale: number =
			this.memory.renderer.element.main.getBoundingClientRect().width / this.memory.renderer.psd.width;
		this.parseLayers(root, ctxBuffer, c.width, c.height, scale);

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

	private parseLayers(
		$root: LayerInfo[],
		$ctx: CanvasRenderingContext2D,
		$width: number, // the size of a canvas
		$height: number, // the size of a canvas
		$scale: number // the current scale of a canvas
	): void {
		this.recursiveRender(
			$root,
			(
				$layer: LayerInfo,
				$layerInfos: LayerInfo[],
				$index: number,
				$folderCtx?: CanvasRenderingContext2D,
				$folderLayer?: LayerInfo
			) => {
				const psd: Layer = $layer.psd;

				if ($layer.hidden.current) return;

				// Folder
				if ($layer.children.length > 0) {
					const folderC: HTMLCanvasElement = document.createElement('canvas');
					folderC.width = $width;
					folderC.height = $height;
					const folderCtx: CanvasRenderingContext2D = folderC.getContext('2d');

					return { folderCtx: folderCtx, folderLayer: $layer };
				}

				if (!psd?.canvas) return;

				let canvas: HTMLCanvasElement = document.createElement('canvas');
				canvas.width = $width;
				canvas.height = $height;
				let x: number = psd.left;
				let y: number = psd.top;
				let w: number = psd.right - psd.left;
				let h: number = psd.bottom - psd.top;
				x *= $scale;
				y *= $scale;
				w *= $scale;
				h *= $scale;
				canvas.getContext('2d').drawImage(psd.canvas, x, y, w, h);

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

				// Clipping layer
				if (psd.clipping) {
					for (let i = $index; i < $layerInfos.length; i++) {
						if ($layerInfos[i].psd.clipping) continue;

						const source: Layer = psd;
						const target: Layer = $layerInfos[i].psd;

						const clipCanvas: HTMLCanvasElement = document.createElement('canvas');
						clipCanvas.width = canvas.width;
						clipCanvas.height = canvas.height;
						const clipCtxBuffer: CanvasRenderingContext2D = clipCanvas.getContext('2d');

						clipCtxBuffer.globalCompositeOperation = 'source-over';
						clipCtxBuffer.drawImage(canvas, 0, 0, clipCanvas.width, clipCanvas.height);

						clipCtxBuffer.globalCompositeOperation = 'destination-in';
						let targetW: number = target.right - target.left;
						let targetH: number = target.bottom - target.top;
						targetW *= $scale;
						targetH *= $scale;

						if (!target?.children && !!target?.canvas) {
							clipCtxBuffer.drawImage(target.canvas, target.left * $scale, target.top * $scale, targetW, targetH);
						} else {
							if ($layerInfos[i].hidden.current || !$layerInfos[i].folderCanvas) break;
							clipCtxBuffer.drawImage($layerInfos[i].folderCanvas, 0, 0, clipCanvas.width, clipCanvas.height);
						}

						canvas = clipCanvas;
						break;
					}
				}

				// Mask layer
				if (!!psd?.mask?.canvas) {
					const source: Layer = psd;
					const mask: LayerMaskData = $layer.psd.mask;

					// Maybe I should escape this case for now
					if (mask.positionRelativeToLayer) return;

					const maskCanvas: HTMLCanvasElement = document.createElement('canvas');
					maskCanvas.width = canvas.width;
					maskCanvas.height = canvas.height;
					const maskCtxBuffer: CanvasRenderingContext2D = maskCanvas.getContext('2d');

					maskCtxBuffer.globalCompositeOperation = 'source-over';
					maskCtxBuffer.drawImage(canvas, 0, 0, canvas.width, canvas.height);

					maskCtxBuffer.globalCompositeOperation = 'destination-in';
					let targetW: number = mask.right - mask.left;
					let targetH: number = mask.bottom - mask.top;
					targetW *= $scale;
					targetH *= $scale;

					const tmpCanvas: HTMLCanvasElement = document.createElement('canvas');
					tmpCanvas.width = targetW;
					tmpCanvas.height = targetH;
					const tmpCtx: CanvasRenderingContext2D = tmpCanvas.getContext('2d');
					tmpCtx.drawImage(mask.canvas, 0, 0, tmpCanvas.width, tmpCanvas.height);

					const imageData: ImageData = tmpCtx.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height);
					const data: Uint8ClampedArray = imageData.data;

					for (let i = 0; i < data.length; i += 4) {
						data[i + 3] = data[i];
					}

					tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
					tmpCtx.putImageData(imageData, 0, 0);

					maskCtxBuffer.drawImage(tmpCanvas, mask.left * $scale, mask.top * $scale, targetW, targetH);

					canvas = maskCanvas;
				}

				$ctx.drawImage(canvas, 0, 0);
				$ctx.restore();

				const isRootDirectory = !$folderCtx;
				if (!isRootDirectory) $folderCtx.drawImage(canvas, 0, 0);

				return { folderCtx: $folderCtx, folderLayer: $folderLayer };
			}
		);
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

	private recursiveRender(
		$root: LayerInfo[],
		$callback: Function,
		$folderCtx?: CanvasRenderingContext2D,
		$folderLayer?: LayerInfo
	): void {
		for (let i = $root.length - 1; i > -1; i--) {
			const payload: {
				folderCtx?: CanvasRenderingContext2D;
				folderLayer?: LayerInfo;
			} = $callback($root[i], $root, i, $folderCtx, $folderLayer);

			if ($root[i].children.length > 0 && !!payload?.folderCtx && !!payload?.folderLayer) {
				this.recursiveRender($root[i].children, $callback, payload.folderCtx, payload.folderLayer);
				payload.folderLayer.folderCanvas = payload.folderCtx.canvas;
				if (!!$folderCtx) $folderCtx.drawImage(payload.folderLayer.folderCanvas, 0, 0);
			}
		}
	}

	toggleVisibility($name: string, $uniqueId: string): void {
		const root: LayerInfo[] = this.memory.layerInfos$.getValue();
		this.recursiveCheck(root, ($layer: LayerInfo) => {
			if ($name === $layer.name && $uniqueId === $layer.uniqueId) {
				// Folder layer
				if ($layer.children.length > 0) {
					if ($layer.hidden.current) {
						const root: LayerInfo[] = $layer.children;
						this.recursiveCheck(root, ($subLayer: LayerInfo) => {
							$subLayer.hidden.current = $subLayer.hidden.prev;
						});
					} else {
						const root: LayerInfo[] = $layer.children;
						this.recursiveCheck(root, ($subLayer: LayerInfo) => {
							$subLayer.hidden.prev = $subLayer.hidden.current;
							$subLayer.hidden.current = !$layer.hidden.current;
						});
					}
				}

				$layer.hidden.current = !$layer.hidden.current;

				//console.log($layer);

				// To get rid of loop
				return 0;
			}
		});
	}

	private recursiveCheck(
		$root: LayerInfo[],
		$callback: Function,
		$folderCtx?: CanvasRenderingContext2D,
		$folderLayer?: LayerInfo
	): void {
		for (let i = $root.length - 1; i > -1; i--) {
			const payload: number = $callback($root[i], $root, i, $folderCtx, $folderLayer);

			if (payload === 0) return;

			if ($root[i].children.length > 0) this.recursiveCheck($root[i].children, $callback);
		}
	}
}
