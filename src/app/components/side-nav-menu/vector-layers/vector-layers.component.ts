import { Component, OnInit } from '@angular/core';
import { RxCoreService } from 'src/app/services/rxcore.service';
import { RXCore } from 'src/rxcore';
import { IVectorLayer } from 'src/rxcore/models/IVectorLayer';
import { IPDFLayer } from 'src/rxcore/models/IPDFLayer';



@Component({
  selector: 'rx-vector-layers',
  templateUrl: './vector-layers.component.html',
  styleUrls: ['./vector-layers.component.scss']
})
export class VectorLayersComponent implements OnInit {
  tabActiveIndex: number = 0;
  vectorLayersAll: boolean = true;
  vectorLayers: Array<IVectorLayer> = [];
  pdfLayers: Array<IPDFLayer> = [];
  guiState: any;

  constructor(private readonly rxCoreService: RxCoreService) {}

  ngOnInit(): void {


    function compare(a :IPDFLayer,b: IPDFLayer) {
      const ida = a.group.name;
      const idb = b.group.name;
    
      let comparison = 0;
      if (ida > idb) {
        comparison = 1;
      } else if (ida < idb) {
        comparison = -1;
      }
      return comparison;
    }


    this.rxCoreService.guiVectorLayers$.subscribe((layers) => {

      this.vectorLayers = layers;

    });

    this.rxCoreService.guiPDFLayers$.subscribe((layers) => {

      this.pdfLayers = [];

      /*for (var pl = 0; pl < layers.length; pl ++ ) {
        //var layername = pdflayers[pl].group.name;
        //var layeid = pdflayers[pl].groupid;
        //var state = pdflayers[pl].group.visible();
        //var pdflayer = {id : pdflayers[pl].groupid, name : pdflayers[pl].group.name, state :  pdflayers[pl].group.visible()};

        //this.pdfLayers.push({id : layers[pl].id, name : layers[pl].group.name, state :  layers[pl].group.visible});
      }*/

      this.pdfLayers = layers;

      this.pdfLayers.sort(compare);

    });


    this.rxCoreService.guiState$.subscribe((state) => {
      this.guiState = state;
      //this.canChangeSign = state.numpages && state.isPDF && RXCore.getCanChangeSign();

    });


  }

  onVectorLayersAllSelect(onoff: boolean): void {
    this.vectorLayersAll = onoff;
    RXCore.vectorLayersAll(onoff);
  }

  onPDFLayerClick(onoff:boolean):void{
    this.vectorLayersAll = onoff;

  } 

  onVectorLayerClick(layer: any): void {
    //RXCore.changeVectorLayer(layer?.index);

    if (this.guiState.isPDF){
      RXCore.changePDFLayer(layer.id, !layer.group.visible);
    }else{
      RXCore.changeVectorLayer(layer?.index);
    }

    /*if($scope.filetype == "file_pdf"){
      RxCore.changePDFLayer(item.id, item.visible);
  }else{
    
  
    (item.state == 1) ? item.state = 0 : item.state = 1;
  }*/


  /*export interface IVectorLayer {
    index: number;
    name: string;
    state: boolean;
    color: string;
  }*/


  }
}
