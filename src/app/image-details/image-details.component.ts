import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, RouterEvent } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { concatMap, filter } from 'rxjs/operators';
import { ImageListItem } from '../image-list/image-list.component';
import { ImageListService } from '../image-list/image-list.service';
import { ImageDetailsService } from './image-details.service';

export interface ImageDetailsItem {
  imageUrl: string;
  title: string;
}

@Component({
  selector: 'app-image-details',
  templateUrl: './image-details.component.html',
  styleUrls: ['./image-details.component.scss'],
})
export class ImageDetailsComponent implements OnInit, OnDestroy {
  loadingDetails$ = new Observable<boolean>();
  imageDetails$ = new Observable<ImageDetailsItem>();
  prevId?: string;
  nextId?: string;
  id?: string;
  listSubscription?: Subscription;
  imageList: ImageListItem[] = [];
  constructor(
    private _route: ActivatedRoute,
    private _service: ImageDetailsService,
    private _listService: ImageListService
  ) {}

  ngOnInit(): void {
    this.loadingDetails$ = this._service.loadingDetails$;
    this.imageDetails$ = this._service.imageDetails$;
    this.listSubscription = this._listService.imageList$
      .pipe(
        concatMap((res: any) => {
          this.imageList = res as ImageListItem[];
          return this._route.pathFromRoot[1].url;
        })
      )
      .subscribe((url) => {
        this._service.unsetImageDetails();
        this.id = url[1].path;
        let index = this.imageList.findIndex((item) => item.id === this.id);
        if (this.imageList.length > 0 && index >= 0) {
          this.prevId = index > 0 ? this.imageList[index - 1].id : undefined;
          this.nextId =
            index < this.imageList.length - 1
              ? this.imageList[index + 1].id
              : undefined;
        }
        if (this.id) this._service.getImageDetails(this.id);
      });
  }

  ngOnDestroy(): void {
    this.listSubscription?.unsubscribe();
  }

  onImgError(event: any) {
    event.target.src = '../../assets/sad404.svg';
  }
}
