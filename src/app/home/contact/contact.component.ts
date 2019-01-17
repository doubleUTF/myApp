import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import {MetaService} from '../../meta-service.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css', '../shared_comp.css']
})
export class ContactComponent implements OnInit, OnDestroy {

  lat: number=37.557826;
  lng:number=-122.265209;
  zoom:number=14;

  markerLat:number=37.553282;
  markerLng:number=-122.256321;
  label:'A';

  constructor(
    private _title:Title,
    private _meta: Meta,
    private metaService:MetaService
  ) { }

  ngOnInit() {
    this._title.setTitle('Contact page');
    this._meta.updateTag({name:'description',content:'Contact information including office hours and location.'})
    this.metaService.createCanonicalURL();
  }
  
  ngOnDestroy(){
    this.metaService.deleteCanonicalURL()
  }
}
