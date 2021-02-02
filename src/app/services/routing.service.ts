import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import Graphic from "@arcgis/core/Graphic";
import RouteTask from "@arcgis/core/tasks/RouteTask";
import RouteParameters from "@arcgis/core/tasks/support/RouteParameters";
import FeatureSet from "@arcgis/core/tasks/support/FeatureSet";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";
import esriConfig from "@arcgis/core/config";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { ApplicationBaseService } from './application-base.service';

export type directionSteps = "startPoint" | "endPoint" | "calculating-route" | "finished";

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  mapInfo$: Subject<{ view: __esri.MapView, map: __esri.WebMap }> = new Subject();
  directionsStep$ = new BehaviorSubject<directionSteps>("startPoint");
  featuresAlongRoute: __esri.Graphic[] = [];
  selectedUnit$ = new BehaviorSubject<string>("miles");
  bufferValue$ = new BehaviorSubject<string>("1");

  _route!: __esri.Polyline | null;
  _oldBuffLineGraphic: __esri.Graphic | null = null;

  private _view!: __esri.MapView;
  private _map!: __esri.WebMap;

  private _routeTask: __esri.RouteTask = new RouteTask({
    url: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World"
  });

  private _routingLayer: __esri.GraphicsLayer = new GraphicsLayer();

  constructor(private applicationBaseService: ApplicationBaseService) {

    this.mapInfo$.subscribe(({ view, map }) => {

      // Make Class refs for Map Info
      this._view = view;
      this._map = map;

      // Add routingLayer to map
      map.add(this._routingLayer);
      
      view.when(() => {
        esriConfig.apiKey = applicationBaseService.config.getValue().apiKey;
        view.on("click", this._processClick.bind(this));
      })
    });
  }

  resetDirectionSteps(){
    this.directionsStep$.next("startPoint");
    this._routingLayer.graphics.removeAll();
    this._view.popup.close();
    this._route = null;
  }

  recalculateBuffer(){
    this.directionsStep$.next("calculating-route");
    this._bufferRoute();
  }

  private _processClick(event: any) {
    if(this.directionsStep$.value === "finished"){
      return;
    }

    if (this._routingLayer.graphics.length === 0) {
      this._addGraphic("origin", event.mapPoint);
      this.directionsStep$.next("endPoint");
    } else if (this._routingLayer.graphics.length === 1) {
      this._addGraphic("destination", event.mapPoint);
      this.directionsStep$.next("calculating-route");
      this._getRoute();

    } else {
      this._routingLayer.graphics.removeAll();
      this._addGraphic("origin", event.mapPoint);
      this.directionsStep$.next("endPoint");
    }
  }

  private _addGraphic(type: string, point: any) {
    const graphic = new Graphic({
      symbol: {
        type: "simple-marker",
        color: (type === "origin") ? "white" : "black",
        size: "8px"
      } as any,
      geometry: point
    });
    this._routingLayer.add(graphic);
  }

  private _getRoute() {
    const routeParams = new RouteParameters({
      stops: new FeatureSet({
        features: this._routingLayer.graphics.toArray()
      }),

      returnDirections: false
    });

    this._routeTask.solve(routeParams)
      .then((data: any) => {
        data.routeResults.forEach((result: any) => {
          result.route.symbol = {
            type: "simple-line",
            color: [5, 150, 255],
            width: 3
          };
          this._routingLayer.add(result.route);
          this._route = result.route.geometry;

          this._bufferRoute();
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  private _bufferRoute() {
    const webMerPolyLine: __esri.Polyline = webMercatorUtils.geographicToWebMercator(this._route as any) as __esri.Polyline;
    console.log("bufferValue", +this.bufferValue$.getValue());
    console.log("bufferUnit", this.selectedUnit$.getValue());
    const buffLine: __esri.Polygon = geometryEngine.buffer(webMerPolyLine, +this.bufferValue$.getValue(), this.selectedUnit$.getValue() as any) as __esri.Polygon;
    const buffLineGraphic: any = {
      geometry: buffLine,
      symbol: {
        type: "simple-fill", color: [65, 228, 45, 0.25]
      }
    }

    if(this._oldBuffLineGraphic != null){
      // Buffer is the last graphic added
      this._routingLayer.graphics.removeAt(this._routingLayer.graphics.length - 1);
    }
    this._routingLayer.add(buffLineGraphic);
    this._oldBuffLineGraphic = buffLineGraphic;

    this._plaquesSpatialQuery(buffLine, webMerPolyLine);
  }

  private _plaquesSpatialQuery(buffLine: __esri.Polygon, polyLine: __esri.Polyline) {
    const plaquesLayer: __esri.FeatureLayer = this._map.layers.getItemAt(1) as any;
    const q = plaquesLayer.createQuery();
    q.geometry = buffLine;
    plaquesLayer.queryFeatures(q).then((res) => {

      this._sortFeaturesAlongLine(polyLine, res.features);

      console.log(res.features);

      this.featuresAlongRoute = res.features;

      this._view.popup.open({
        features: res.features,
        updateLocationEnabled: true
      });
      this._view.popup.dockEnabled = true;
      this.directionsStep$.next("finished");
    });
  }

  private _sortFeaturesAlongLine(line: __esri.Polyline, graphics: __esri.Graphic[]) {
    const startPoint: __esri.Point = line.getPoint(0, 0);
    const lastPathNum = line.paths.length - 1;
    const endPoint: __esri.Point = line.getPoint(lastPathNum, line.paths[lastPathNum].length - 1);
    const latitudeChg: number = Math.abs(endPoint.y - startPoint.y);
    const longitudeChg: number = Math.abs(endPoint.x - startPoint.x);

    // pick the greater change to sort by
    const sortVariable: "x" | "y" = latitudeChg < longitudeChg ? "x" : "y";

    graphics.sort((a: __esri.Graphic, b: __esri.Graphic) => {
      const start_to_a_distance = Math.abs((a.geometry as __esri.Point)[sortVariable] - startPoint[sortVariable])
      const start_to_b_distance = Math.abs((b.geometry as __esri.Point)[sortVariable] - startPoint[sortVariable])
      return start_to_a_distance - start_to_b_distance;
    });
  }
}
