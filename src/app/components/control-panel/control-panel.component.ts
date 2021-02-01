import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { RoutingService } from 'src/app/services/routing.service';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit, AfterViewInit {

  selectedUnitLabel: string = "Feet";

  constructor(
    public routingService: RoutingService
  ) { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(){    
    const calciteSelect: HTMLCalciteSelectElement = document.getElementById("unitSelect") as any;
    calciteSelect.addEventListener("calciteSelectChange", (e:any)=>{
      this.routingService.selectedUnit$.next(e.target.selectedOption.value);
      this.selectedUnitLabel = e.target.selectedOption.innerHTML;
    });

    const bufferValInput: HTMLCalciteInputElement = document.getElementById("bufferInputValue") as any;
    bufferValInput.addEventListener("change", (e:any)=>{
      console.log("change:", e.target.value)
      this.routingService.bufferValue$.next(e.target.value);
    });
  }

}
