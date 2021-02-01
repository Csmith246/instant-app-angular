import { Component, OnInit, ViewChild } from '@angular/core';
import WebMap from "@arcgis/core/WebMap";
import MapView from "@arcgis/core/views/MapView";

import Popup from "@arcgis/core/widgets/Popup";
import { RoutingService } from 'src/app/services/routing.service';
import { ApplicationBaseService } from 'src/app/services/application-base.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('shell') shell: any;
  @ViewChild('shellPanel') shellPanel: any;

  constructor(
    private routingService: RoutingService,
    private applicationBaseService: ApplicationBaseService
  ) { }

  ngOnInit() {
    const map = new WebMap({
      portalItem: { id: "bff105a735d245419c9b5fcacbb27229" }
    });

    const view = new MapView({
      container: "viewDiv",
      map,
      center: [-98.8, 31.3], //Longitude, Latitude
      zoom: 5,
      popup: new Popup({
        autoOpenEnabled: false,
        dockEnabled: true,
        dockOptions: {
          buttonEnabled: false
        },
        goToOverride: (overrideView, goToParams) => {
          const options = {
            duration: 300,
            animate: true,
            easing: "ease-in"
          };
          return overrideView.goTo(goToParams.target, options as any);
        }
      }),
    });

    this.routingService.mapInfo$.next({ map, view });
  }

  setWidthStyle() {
    const calciteShellPanelWidth = this.shellPanel?.nativeElement?.offsetWidth;
    const calciteShellWidth = this.shell?.nativeElement?.offsetWidth;
    const previewContainerWidth = calciteShellWidth - calciteShellPanelWidth;
    return {
      position: "absolute",
      left: `${calciteShellPanelWidth}px`,
      width: `${previewContainerWidth}px`
    }
  }
}
