/*
  Copyright 2017 Esri

  Licensed under the Apache License, Version 2.0 (the "License");

  you may not use this file except in compliance with the License.

  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software

  distributed under the License is distributed on an "AS IS" BASIS,

  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

  See the License for the specific language governing permissions and

  limitations under the License.​
*/
import { reject, resolve } from "@arcgis/core/core/promiseUtils";
import { whenFalseOnce } from "@arcgis/core/core/watchUtils";

import MapView from "@arcgis/core/views/MapView";
import SceneView from "@arcgis/core/views/SceneView";

import PortalItem from "@arcgis/core/portal/PortalItem";

import {
  CreateMapFromItemOptions,
  ApplicationConfig,
  ApplicationProxy
} from "../interfaces";

import {
  parseViewpoint,
  parseViewComponents,
  parseExtent,
  parseMarker,
  parseCenter,
  parseLevel
} from "./urlUtils";

//--------------------------------------------------------------------------
//
//  Public Methods
//
//--------------------------------------------------------------------------

export function getConfigViewProperties(config: ApplicationConfig): any {
  const { center, components, extent, level, viewpoint } = config;
  const ui = components
    ? { ui: { components: parseViewComponents(components) } }
    : null;
  const cameraProps = viewpoint ? { camera: parseViewpoint(viewpoint) } : null;
  const centerProps = center ? { center: parseCenter(center) } : null;
  const zoomProps = level ? { zoom: parseLevel(level) } : null;
  const extentProps = extent ? { extent: parseExtent(extent) } : null;

  return {
    ...ui,
    ...cameraProps,
    ...centerProps,
    ...zoomProps,
    ...extentProps
  };
}

export async function createView(properties: any): Promise<__esri.MapView | __esri.SceneView> {
  const { map } = properties;

  if (!map) {
    return reject(`properties does not contain a "map"`);
  }

  const isWebMap = map.declaredClass === "__esri.WebMap";
  const isWebScene = map.declaredClass === "__esri.WebScene";

  if (!isWebMap && !isWebScene) {
    return reject(`map is not a "WebMap" or "WebScene"`);
  }

  return isWebMap ? new MapView(properties) : new SceneView(properties);

}

export function createMapFromItem(
  options: CreateMapFromItemOptions
): Promise<__esri.WebMap | __esri.WebScene> {
  const { item } = options;
  const isWebMap = item.type === "Web Map";
  const isWebScene = item.type === "Web Scene";

  if (!isWebMap && !isWebScene) {
    return reject();
  }

  return isWebMap
    ? createWebMapFromItem(options)
    : (createWebSceneFromItem(options) as Promise<__esri.WebMap | __esri.WebScene>);
}

export async function createWebMapFromItem(
  options: CreateMapFromItemOptions
): Promise<__esri.WebMap> {
  const { item, appProxies } = options;
  const WebMap = await import("@arcgis/core/WebMap");
  const wm = new WebMap.default({
    portalItem: item
  });
  await wm.load();
  await wm.basemap.load();
  return _updateProxiedLayers(wm, appProxies) as __esri.WebMap;
}

export async function createWebSceneFromItem(
  options: CreateMapFromItemOptions
): Promise<__esri.WebScene> {
  const { item, appProxies } = options;
  const WebScene = await import("@arcgis/core/WebScene");
  const ws = new WebScene.default({
    portalItem: item
  });
  await ws.load();
  await ws.basemap.load();
  return _updateProxiedLayers(ws, appProxies) as __esri.WebScene;
}

export function getItemTitle(item: PortalItem): string {
  if (item && item.title) {
    return item.title;
  }
}

export async function goToMarker(
  marker: string,
  view: __esri.MapView | __esri.SceneView
): Promise<any> {
  if (!marker || !view) {
    return resolve();
  }
  const graphic = await parseMarker(marker);
  await view.when();

  view.graphics.add(graphic as __esri.Graphic);
  view.goTo(graphic);

  return graphic;
}

export async function findQuery(
  query: string,
  view: __esri.MapView | __esri.SceneView
): Promise<any> {
  // ?find=redlands, ca
  if (!query || !view) {
    return resolve();
  }

  const Search = await import("@arcgis/core/widgets/Search");

  const search = new Search.default({
    view
  });
  const result = await search.search(query);
  whenFalseOnce(view, "popup.visible", () => {
    search.destroy();
  });
  return result;
}

//--------------------------------------------------------------------------
//
//  Private Methods
//
//--------------------------------------------------------------------------

function _updateProxiedLayers(
  webItem: __esri.WebMap | __esri.WebScene,
  appProxies?: ApplicationProxy[]
): __esri.WebMap | __esri.WebScene {
  if (!appProxies) {
    return webItem;
  }

  appProxies.forEach(proxy => {
    webItem.allLayers.forEach((layer: any) => {
      if (layer.url === proxy.sourceUrl) {
        layer.url = proxy.proxyUrl;
      }
    });
  });
  return webItem;
}
