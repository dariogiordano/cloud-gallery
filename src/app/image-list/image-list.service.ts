import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as Constants from '../constants/';
import { imageListItem } from './image-list.component';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ImageListService {
  private readonly _imageList$ = new BehaviorSubject<imageListItem[]>([]);
  private readonly _loadingList$ = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) {}

  getCloudImages(
    isReset: boolean,
    limit: number,
    filter?: string,
    next?: string
  ): void {
    this._loadingList$.next(true);

    let params = new HttpParams().set('t', 'all').set('limit', limit);
    if (filter) params.set('f', filter);
    if (next) params.set('next', next);

    this.http.get(Constants.API_URL, { params }).subscribe((res: any) => {
      let imagelist: imageListItem[] = res.data.children
        .filter(
          (resItem: any) =>
            !!resItem.data.url &&
            !!resItem.data.thumbnail &&
            resItem.data.thumbnail.indexOf('.') > 0 &&
            !resItem.data.media
        )
        .map((resItem: any) => {
          let listItem: imageListItem = {
            imageUrl: resItem.data.url,
            thumbUrl: resItem.data.thumbnail,
            title: resItem.data.title,
          };
          return listItem;
        });
      if (isReset) this._imageList$.next(imagelist);
      else this._imageList$.next([...this._imageList$.value, ...imagelist]);
      this._loadingList$.next(false);
    });
  }
  get loadingList$() {
    return this._loadingList$.asObservable();
  }
  setLoadingList(val: boolean) {
    this._loadingList$.next(val);
  }
  get imageList$() {
    return this._imageList$.asObservable();
  }
}
