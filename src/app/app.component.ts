import { Component, OnInit } from '@angular/core';
import EsriMap from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Home from "@arcgis/core/widgets/Home";
import { ApplicationConfig } from 'ApplicationBase/interfaces';
import { ApplicationBaseService } from './services/application-base.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'instant-app-angular';

  constructor(
    public applicationBaseService: ApplicationBaseService
  ){}

  ngOnInit() {
    /////////////// Map and MapView Creation ////////////////////////////
    const map = new EsriMap({
      basemap: "streets"
    });
    const view = new MapView({
      container: "viewDiv",
      center: [-98.8, 31.3], //Longitude, Latitude
      zoom: 5,
      map
    });

    /////////////// Calcite Component Created Programmatically //////////////// https://github.com/Esri/calcite-components
    const calciteBtn = document.createElement("calcite-button");
    calciteBtn.innerText = "Calcite Button";

    view.ui.add(calciteBtn, "top-right");

    /////////////// ApplicationBase Config Example //////////////////////////// https://github.com/Esri/application-base-js
    this.applicationBaseService.config.subscribe((config: ApplicationConfig)=>{
      if(config){
        const { home, homePosition } = config;
        if(home) view.ui.add(new Home(), homePosition);
      }
    })
  }
}
