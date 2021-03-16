import type { IStore, IFiles } from '@seek-psd/engine2d';
import type { IUserStore, IPsdSet } from '../../store';
import type { ILayerInfo } from '../../entities/layerInfo';
import type { IPsdData } from '../../entities/psdData';
import type { IPsd, IPsdMeta } from '../../entities/psd';
import type { Layer } from 'ag-psd';
import { LayerInfo } from '../../entities/layerInfo';
import { Psd } from '../../entities/psd';
import { EVENT_TYPE } from '@seek-psd/engine2d';
import { Plugin } from '@seek-psd/engine2d';
import { generateUuid } from '@seek-psd/utils';

export const SHAPE_PSD = 'shapePsd';

export class ShapePsd extends Plugin<IUserStore> {
  constructor() {
    // enable notifier
    super({
      pluginType: EVENT_TYPE.DRAG,
    });
  }

  call($store: IStore, $userStore: IUserStore): void {
    super.call($store, $userStore);

    if ($store.flags.drag.isDrop) {
      this._shapePsd();
      this._clearCaches();
    }
  }

  private _shapePsd(): void {
    const psdSets: IPsdSet[] = this.userStore.psdSets;

    if (psdSets.length === 0) return;

    for (let i = 0; i < psdSets.length; i++) {
      const layerInfos: ILayerInfo[] = [];
      const psdSet: IPsdSet = psdSets[i];
      const psdData: IPsdData = psdSet.psdData;
      const uniqueId: string = generateUuid();
      const width: number = psdData.width;
      const height: number = psdData.height;
      console.log(psdData);

      const childLayers: Layer[] = psdData.children as Layer[];

      for (let j = childLayers.length - 1; j > -1; j--) {
        const layerInfo = new LayerInfo(childLayers[j], {
          current: childLayers[j].hidden,
          prev: !childLayers[j].hidden,
          parent: false,
        });

        layerInfos.push(layerInfo);
        this._getChildren(childLayers[j], layerInfo);
      }

      const psdMeta: IPsdMeta = {
        fileName: psdSet.fileName,
        uniqueId,
        rawWidth: width,
        rawHeight: height,
        rawElement: psdData.canvas,
        layerInfos,
      };
      const psd: IPsd = new Psd(psdMeta);

      // update psds in the userStore
      this.userStore.psds.push(psd);
    }
  }

  private _getChildren($childLayer: Layer, $layerInfo: ILayerInfo): void {
    if (!$childLayer.children) return;

    for (let i = $childLayer.children.length - 1; i > -1; i--) {
      const layerInfo = new LayerInfo($childLayer.children[i], {
        current: $childLayer.children[i].hidden,
        prev: !$childLayer.children[i].hidden,
        parent: $layerInfo.isLayerHidden.current,
      });

      $layerInfo.children.push(layerInfo);

      this._getChildren($childLayer.children[i], layerInfo);
    }
  }

  private _clearCaches(): void {
    this.userStore.psdSets = [];
  }
}
