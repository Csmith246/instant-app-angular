import { Injectable } from '@angular/core';
import ApplicationBase from '../../assets/ApplicationBase/ApplicationBase';
import { ApplicationConfig, ApplicationBaseResults } from '../../assets/ApplicationBase/interfaces';
import Portal from "@arcgis/core/portal/Portal";
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationBaseService {

  config = new BehaviorSubject<ApplicationConfig>(null);
  results = new BehaviorSubject<ApplicationBaseResults>(null);
  portal = new BehaviorSubject<Portal>(null);

  constructor() {
    new ApplicationBase({
      config: environment.application,
      settings: environment.applicationBase as any
    }).load()
      .then((base: ApplicationBase) => {
        const { config, results, portal } = base;
        this.config.next(config);
        this.results.next(results);
        this.portal.next(portal);
      });
  }
}
