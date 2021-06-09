import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as Constants from '../constants/';
import { imageListItem } from './image-list.component';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ImageListService {
  private readonly _imageList$ = new BehaviorSubject<
    imageListItem[] | undefined
  >(undefined);
  constructor(private http: HttpClient) {
    this.getCloudImages();
  }

  getCloudImages(filter?: string, next?: string): void {
    let params = new HttpParams().set('limit', Constants.RECORDS_LIMIT);
    if (filter) params.set('f', filter);
    if (next) params.set('next', next);

    this.http.get(Constants.API_URL, { params }).subscribe((res: any) => {
      console.log(res.data.children);
      let imagelist: imageListItem[] = res.data.children
        .filter((resItem: any) => !!resItem.data.url && !resItem.data.media)
        .map((resItem: any) => {
          let listItem: imageListItem = {
            imageUrl: resItem.data.url,
            thumbUrl: resItem.data.thumbnail,
            title: resItem.data.title,
          };
          return listItem;
        });
      this._imageList$.next(imagelist);
    });
  }
  get imageList$() {
    return this._imageList$.asObservable();
  }
}
