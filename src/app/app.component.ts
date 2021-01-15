import { Component, OnInit } from '@angular/core';
import EsriMap from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'instant-app-angular';

  ngOnInit(){
    const map = new EsriMap({
      basemap: "streets"
    });
    const view = new MapView({ container: "viewDiv", map });
  }
}
