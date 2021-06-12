import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { ImageDetailsService } from './image-details.service';

export interface imageDetailsItem {
  imageUrl: string;
  title: string;
}

@Component({
  selector: 'app-image-details',
  templateUrl: './image-details.component.html',
  styleUrls: ['./image-details.component.scss'],
})
export class ImageDetailsComponent implements OnInit {
  loadingDetails$ = new Observable<boolean>();
  imageDetails$ = new Observable<imageDetailsItem>();
  constructor(
    private _route: ActivatedRoute,
    private _service: ImageDetailsService
  ) {}

  ngOnInit(): void {
    this.loadingDetails$ = this._service.loadingDetails$;
    this.imageDetails$ = this._service.imageDetails$;
    this._route.pathFromRoot[1].url.subscribe((val) => {
      this._service.getImageDetails(val[1].path);
    });
  }

  onImgError(event: any) {
    event.target.src = '../../assets/sad404.svg';
  }
}
