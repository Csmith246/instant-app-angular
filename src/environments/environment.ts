// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // https://github.com/Esri/application-base-js#constructor-options
  application: {
    "home": true,
    "homePosition": "top-left",
    "layerList": false,
    "layerListPosition": "bottom-right",
    "webmap": "default",
    "webscene": "",
    "portalUrl": "https://arcgis.com",
    "theme": "light",
    "share": false,
    "sharePosition": "top-right",
    "oauthappid": "arcgisWebApps",
    "proxyUrl": "",
    "units": "",
    "googleAnalytics": false,
    "googleAnalyticsKey": null,
    "customUrlLayer": {
      "id": null,
      "fields": []
    },
    "customURLParamName": null,
    "customUrlParam": null,
    "helperServices": {
      "geometry": {
        "url": null
      },
      "printTask": {
        "url": null
      },
      "elevationSync": {
        "url": null
      },
      "geocode": [
        {
          "url": null
        }
      ]
    }
  },

  // https://github.com/Esri/application-base-js#applicationbaseconfig
  applicationBase: {
    "localStorage": {
      "fetch": true
    },
    "group": {
      "default": "",
      "fetchInfo": false,
      "fetchItems": false,
      "itemParams": {
        "sortField": "modified",
        "sortOrder": "desc",
        "num": 9,
        "start": 0
      }
    },
    "portal": {
      "fetch": true
    },
    "urlParams": [
      "appid",
      "basemapUrl",
      "basemapReferenceUrl",
      "center",
      "components",
      "embed",
      "extent",
      "find",
      "group",
      "level",
      "marker",
      "oauthappid",
      "portalUrl",
      "viewpoint",
      "webmap",
      "webscene",
      "homeEnabled",
      "zoomControlsEnabled",
      "basemapToggleEnabled",
      "layerListEnabled",
      "searchEnabled",
      "screenshotEnabled",
      "enablePopupOption",
      "enableLegendOption",
      "infoPanelEnabled",
      "muteOpacity",
      "muteGrayScale",
      "filterMode",
      "locale"
    ],
    "webMap": {
      "default": "ddf28dc057b8400dbfa148ef403f7c57",
      "fetch": false
    },
    "webScene": {
      "default": "e8f078ba0c1546b6a6e0727f877742a5",
      "fetch": false
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
