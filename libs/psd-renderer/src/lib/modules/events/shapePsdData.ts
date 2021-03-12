import type { IStore, IFiles } from '@seek-psd/engine2d';
import type { IUserStore, IPsdSet } from '../../store';
import type { ILayerInfo } from '../../entities/layerInfo';
import type { IPsdData } from '../../entities/psdData';
import { LayerInfo } from '../../entities/layerInfo';
import { EVENT_TYPE } from '@seek-psd/engine2d';
import { Plugin } from '@seek-psd/engine2d';
import { Psd, Layer } from 'ag-psd';
import { generateUuid } from '@seek-psd/utils';

export class ShapePsdData extends Plugin<IUserStore> {
  constructor() {
    // enable notifier
    super({
      pluginType: EVENT_TYPE.DRAG,
      isNotifierEnabled: true,
    });
  }

  call($store: IStore, $userStore: IUserStore): void {
    super.call($store, $userStore);

    if ($store.flags.drag.isDrop) {
      this._shapePsdData();
      this._clearCaches();
    }
  }

  private _shapePsdData(): void {
    const layerInfos: ILayerInfo[] = [];
    const psdSets: IPsdSet[] = this.userStore.psdSets;

    if (psdSets.length === 0) return;

    for (let i = 0; i < psdSets.length; i++) {
      const psdSet: IPsdSet = psdSets[i];
      const psdData: IPsdData = psdSet.psdData;

      if (psdData?.children) {
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
      } else {
        const layerInfo = new LayerInfo(psdSets[i].psdData as Layer);

        layerInfos.push(layerInfo);
      }
    }

    // update layerInfos in the store
    this.userStore.layerInfos = layerInfos;
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
    this.store.values.drag.data = null;
    this.store.values.drag.files = [];
    this.userStore.psdSets = [];
  }
}
