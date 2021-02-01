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

  ngOnInit() {
    const map = new EsriMap({
      basemap: "streets"
    });
    const view = new MapView({
      container: "viewDiv",
      center: [-98.8, 31.3], //Longitude, Latitude
      zoom: 5,
      map
    });

    const calciteBtn = document.createElement("calcite-button");
    calciteBtn.innerText = "Calcite Button";

    view.ui.add(calciteBtn, "top-right");
  }
}
