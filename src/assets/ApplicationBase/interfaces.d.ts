import Portal from "@arcgis/core/portal/Portal";
import PortalItem from "@arcgis/core/portal/PortalItem";
import PortalQueryResult from "@arcgis/core/portal/PortalQueryResult";
import PortalQueryParams from "@arcgis/core/portal/PortalQueryParams";

import WebMap from "@arcgis/core/WebMap";
import WebScene from "@arcgis/core/WebScene";

export type Direction = "ltr" | "rtl";

export interface ApplicationBaseItemPromises {
  webMap?: Promise<any>;
  webScene?: Promise<any>;
  groupInfo?: Promise<any>;
  groupItems?: Promise<any>;
}

export interface ApplicationConfigs {
  application?: ApplicationConfig;
  config: ApplicationConfig;
  local?: ApplicationConfig;
  url?: ApplicationConfig;
}

export interface ApplicationConfig {
  appid?: string;
  center?: string;
  components?: string;
  embed?: boolean;
  extent?: string;
  find?: string;
  group?: string | string[];
  helperServices?: any;
  level?: string;
  marker?: string;
  oauthappid?: string;
  portalUrl?: string;
  proxyUrl?: string;
  title?: string;
  viewpoint?: string;
  webmap?: string | string[];
  webscene?: string | string[];
  [propName: string]: any;
}

export interface ApplicationBaseSettings {
  environment: {
    isEsri?: boolean;
    webTierSecurity?: boolean;
  };
  localStorage?: {
    fetch?: boolean;
  };
  group?: {
    default?: string;
    itemParams?: PortalQueryParams;
    fetchItems?: boolean;
    fetchInfo?: boolean;
    fetchMultiple?: boolean;
  };
  portal?: {
    fetch?: boolean;
  };
  urlParams?: string[];
  webMap?: {
    default?: string;
    fetch?: boolean;
    fetchMultiple?: boolean;
  };
  webScene?: {
    default?: string;
    fetch?: boolean;
    fetchMultiple?: boolean;
  }
}

export interface ApplicationBaseResult {
  error?: Error;
  value: any;
  promise: Promise<any>;
}

export interface ApplicationBasePortalItemResult extends ApplicationBaseResult {
  value: PortalItem;
  promise: Promise<PortalItem>;
}

export interface ApplicationBasePortalQueryResult extends ApplicationBaseResult {
  value: PortalQueryResult;
  promise: Promise<PortalQueryResult>;
}

export interface ApplicationBaseResults {
  applicationItem?: ApplicationBasePortalItemResult;
  applicationData?: ApplicationBaseResult;
  groupInfos?: ApplicationBasePortalQueryResult;
  groupItems?: ApplicationBasePortalQueryResult;
  localStorage?: ApplicationConfig;
  portal?: Portal;
  urlParams?: ApplicationConfig;
  webMapItems?: ApplicationBasePortalItemResult[];
  webSceneItems?: ApplicationBasePortalItemResult[];
}

export interface ApplicationProxy {
  sourceUrl: string;
  proxyUrl: string;
  proxyId: string;
}

export interface ApplicationBaseConstructorOptions {
  config: ApplicationConfig | string;
  settings: ApplicationBaseSettings | string;
}

export interface CreateMapFromItemOptions {
  item: PortalItem;
  appProxies?: ApplicationProxy[];
}

export interface esriWidgetProps extends __esri.WidgetProperties {
  config: any;
  view?: __esri.MapView;
  portal?: __esri.Portal;
  propertyName?: string;
}