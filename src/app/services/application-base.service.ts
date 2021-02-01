import { Injectable } from '@angular/core';
// import ApplicationBase from '@esri/application-base-js';
// import { ApplicationConfig, ApplicationBaseResults } from '@esri/application-base-js/interfaces';
import Portal from "@arcgis/core/portal/Portal";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplicationBaseService {

  // config: ApplicationConfig;
  // results: ApplicationBaseResults;
  // portal: Portal;

  constructor() {
    // new ApplicationBase({
    //   config: environment.application,
    //   settings: environment.applicationBase as any
    // }).load()
    //   .then((base: ApplicationBase) => {
    //     const { config, results, portal } = base;
    //     this.config = config;
    //     this.results = results;
    //     this.portal = portal;
    //   });
  }
}
