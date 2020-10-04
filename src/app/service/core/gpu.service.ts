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
		this.renderLayers(root, ctxBuffer, c.width, c.height, 1);

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
		this.renderLayers(root, ctxBuffer, c.width, c.height, scale);

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

	private renderLayers(
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
				$folderLayer?: LayerInfo,
				$maskForFolderLayerC?: HTMLCanvasElement
			) => {
				if ($layer.hidden.current || $layer.hidden.parent) return;

				const psd: Layer = $layer.psd;

				// Folder
				if ($layer.children.length > 0) {
					const folderC: HTMLCanvasElement = document.createElement('canvas');
					folderC.width = $width;
					folderC.height = $height;
					const folderCtx: CanvasRenderingContext2D = folderC.getContext('2d');

					// Clipping folder layer
					let maskForFolderLayerC: HTMLCanvasElement = null;
					if (psd.clipping) {
						for (let i = $index; i < $layerInfos.length; i++) {
							if ($layerInfos[i].psd.clipping) continue;

							const target: Layer = $layerInfos[i].psd;

							if (!target?.children && !!target?.canvas) {
								maskForFolderLayerC = document.createElement('canvas');
								maskForFolderLayerC.width = $width;
								maskForFolderLayerC.height = $height;
								let x: number = target.left;
								let y: number = target.top;
								let w: number = target.right - target.left;
								let h: number = target.bottom - target.top;
								x *= $scale;
								y *= $scale;
								w *= $scale;
								h *= $scale;
								const maskForFolderLayerCtx: CanvasRenderingContext2D = maskForFolderLayerC.getContext('2d');
								maskForFolderLayerCtx.drawImage(target.canvas, x, y, w, h);

								if (!!$maskForFolderLayerC) {
									maskForFolderLayerCtx.globalCompositeOperation = 'destination-in';
									maskForFolderLayerCtx.drawImage($maskForFolderLayerC, 0, 0);
								}
							} else {
								if ($layerInfos[i].hidden.current || !$layerInfos[i].folderCanvas) break;

								maskForFolderLayerC = $layerInfos[i].folderCanvas;
							}

							break;
						}
					} else if (!!$maskForFolderLayerC) {
						maskForFolderLayerC = $maskForFolderLayerC;
					}

					return { folderCtx: folderCtx, folderLayer: $layer, maskForFolderLayerC: maskForFolderLayerC };
				}

				if (!psd?.canvas) return;

				// Blend mode
				let blendMode: string = this._getBlendMode(psd.blendMode);
				if (!blendMode) return;

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

				if (!!$maskForFolderLayerC) {
					const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
					ctx.globalCompositeOperation = 'destination-in';
					ctx.drawImage($maskForFolderLayerC, 0, 0);
				}

				const isRootDirectory = !$folderCtx;
				if (!isRootDirectory) {
					$folderCtx.save();
					$folderCtx.globalAlpha = psd.opacity;
					$folderCtx.globalCompositeOperation = blendMode;
					$folderCtx.drawImage(canvas, 0, 0);
					$folderCtx.restore();
				}

				$ctx.save();
				$ctx.globalAlpha = psd.opacity;

				// Overwrite blendMode with parent blendMode
				if (!!$folderLayer && $folderLayer.psd.blendMode !== 'normal') {
					blendMode = this._getBlendMode($folderLayer.psd.blendMode);
				}
				$ctx.globalCompositeOperation = blendMode;

				$ctx.drawImage(canvas, 0, 0);
				$ctx.restore();

				return { folderCtx: $folderCtx, folderLayer: $folderLayer, maskForFolderLayerC: $maskForFolderLayerC };
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
		$folderLayer?: LayerInfo,
		$maskForFolderLayerC?: HTMLCanvasElement
	): void {
		for (let i = $root.length - 1; i > -1; i--) {
			const payload: {
				folderCtx?: CanvasRenderingContext2D;
				folderLayer?: LayerInfo;
				maskForFolderLayerC?: HTMLCanvasElement;
			} = $callback($root[i], $root, i, $folderCtx, $folderLayer, $maskForFolderLayerC);

			if ($root[i].children.length > 0 && !!payload?.folderCtx && !!payload?.folderLayer) {
				this.recursiveRender(
					$root[i].children,
					$callback,
					payload.folderCtx,
					payload.folderLayer,
					payload.maskForFolderLayerC
				);

				payload.folderLayer.folderCanvas = payload.folderCtx.canvas;

				if (!$folderCtx) continue;

				const psd: Layer = payload.folderLayer.psd;

				// Blend mode
				const blendMode = this._getBlendMode(psd.blendMode);
				if (!blendMode) continue;
				$folderCtx.globalCompositeOperation = blendMode;

				if (!!$maskForFolderLayerC) {
					const tmpC: HTMLCanvasElement = document.createElement('canvas');
					tmpC.width = $folderCtx.canvas.width;
					tmpC.height = $folderCtx.canvas.height;
					const tmpCtx: CanvasRenderingContext2D = tmpC.getContext('2d');
					tmpCtx.drawImage(payload.folderLayer.folderCanvas, 0, 0);
					tmpCtx.globalCompositeOperation = 'destination-in';
					tmpCtx.drawImage($maskForFolderLayerC, 0, 0);

					$folderCtx.drawImage(tmpC, 0, 0);
				} else {
					$folderCtx.drawImage(payload.folderLayer.folderCanvas, 0, 0);
				}
			}
		}
	}

	private _getBlendMode($blendMode: string): string {
		if ($blendMode === 'overlay') {
			return 'overlay';
		} else if ($blendMode === 'screen') {
			return 'screen';
		} else if ($blendMode === 'multiply') {
			return 'multiply';
		} else if ($blendMode === 'linear dodge') {
			return 'lighter';
		} else if ($blendMode == 'soft light') {
			return 'soft-light';
		} else if ($blendMode == 'hard light') {
			return 'hard-light';
		} else if ($blendMode == 'color burn') {
			return 'color-burn';
		} else if ($blendMode == 'saturation') {
			return 'saturation';
		} else if ($blendMode == 'hue') {
			return 'hue';
		} else if ($blendMode == 'color') {
			return 'color';
		} else if ($blendMode == 'color dodge') {
			return 'color-dodge';
		} else if ($blendMode == 'normal') {
			return 'source-over';
		} else {
			return null;
		}
	}

	toggleVisibility($name: string, $uniqueId: string): void {
		const root: LayerInfo[] = this.memory.layerInfos$.getValue();
		this.recursiveCheck(root, ($layer: LayerInfo) => {
			if ($name !== $layer.name || $uniqueId !== $layer.uniqueId) return;

			// Folder layer
			if ($layer.children.length > 0) {
				const root: LayerInfo[] = $layer.children;
				this.recursiveCheck(root, ($subLayer: LayerInfo) => {
					$subLayer.hidden.parent = !$layer.hidden.current;
				});
			}

			$layer.hidden.current = !$layer.hidden.current;

			//console.log($layer);

			// To get rid of loop
			return 0;
		});
	}

	toggleLayerDetail($name: string, $uniqueId: string): void {
		const root: LayerInfo[] = this.memory.layerInfos$.getValue();
		this.recursiveCheck(root, ($layer: LayerInfo) => {
			if ($name === $layer.name && $uniqueId === $layer.uniqueId) {
				const psd: Layer = $layer.psd;
				let targetC: HTMLCanvasElement;
				let targetMaskC: HTMLCanvasElement;

				if (!!psd?.canvas || $layer.folderCanvas) {
					targetC = !!psd?.canvas ? psd.canvas : $layer.folderCanvas;

					const c: HTMLCanvasElement = this.memory.renderer.element.layerDetail;
					c.width = c.getBoundingClientRect().width;
					c.height = c.getBoundingClientRect().height;
					const ctx: CanvasRenderingContext2D = c.getContext('2d');

					const aspect: number = targetC.height / targetC.width;
					const isLarger: boolean = targetC.height > targetC.width;

					const fixedW: number = isLarger ? c.height / aspect : c.width;
					const fixedH: number = isLarger ? c.height : c.width * aspect;

					ctx.translate(c.width / 2, c.height / 2);
					ctx.drawImage(targetC, -fixedW / 2, -fixedH / 2, fixedW, fixedH);

					if (!!psd?.mask && !!psd.mask?.canvas) {
						targetMaskC = psd.mask.canvas;

						const maskC: HTMLCanvasElement = this.memory.renderer.element.layerDetailMask;
						maskC.width = maskC.getBoundingClientRect().width;
						maskC.height = maskC.getBoundingClientRect().height;
						const maskCtx: CanvasRenderingContext2D = maskC.getContext('2d');

						const aspect: number = targetMaskC.height / targetMaskC.width;
						const isLarger: boolean = targetMaskC.height > targetMaskC.width;

						const fixedW: number = isLarger ? maskC.height / aspect : maskC.width;
						const fixedH: number = isLarger ? maskC.height : maskC.width * aspect;

						maskCtx.translate(maskC.width / 2, maskC.height / 2);
						maskCtx.drawImage(targetMaskC, -fixedW / 2, -fixedH / 2, fixedW, fixedH);
					}
				} else {
					// Initialize the canvas to clean up previous rendered result if none
					const c: HTMLCanvasElement = this.memory.renderer.element.layerDetail;
					c.width = 1;
					c.height = 1;
					const maskC: HTMLCanvasElement = this.memory.renderer.element.layerDetailMask;
					maskC.width = 1;
					maskC.height = 1;
				}

				// Blend mode
				let blendMode = '';

				if (psd.blendMode === 'overlay') {
					blendMode = 'オーバーレイ';
				} else if (psd.blendMode === 'screen') {
					blendMode = 'スクリーン';
				} else if (psd.blendMode === 'multiply') {
					blendMode = '乗算';
				} else if (psd.blendMode === 'linear dodge') {
					blendMode = '加算';
				} else if (psd.blendMode === 'soft light') {
					blendMode = 'ソフトライト';
				} else if (psd.blendMode === 'hard light') {
					blendMode = 'ハードライト';
				} else if (psd.blendMode === 'color burn') {
					blendMode = '焼き込みカラー';
				} else if (psd.blendMode === 'saturation') {
					blendMode = '彩度';
				} else if (psd.blendMode === 'hue') {
					blendMode = '色相';
				} else if (psd.blendMode === 'color') {
					blendMode = 'カラー';
				} else if (psd.blendMode === 'color dodge') {
					blendMode = '覆い焼きカラー';
				} else if (psd.blendMode === 'normal') {
					blendMode = '通常';
				} else {
					blendMode = '未対応レイヤー';
				}

				this.memory.updateLayerDetailBlendMode(blendMode, $name, $uniqueId, targetC, targetMaskC);

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
