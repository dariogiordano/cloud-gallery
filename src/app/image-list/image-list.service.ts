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
  private _after: string = '';
  private _intLoadingState = false;
  constructor(private http: HttpClient) {}

  /**
   *
   * @param isReset
   * @param limit
   * @param filter
   */
  getCloudImages(isReset: boolean, limit: number, filter?: string): void {
    if (this._intLoadingState) return;
    this._intLoadingState = true;
    //set loading observable to true o emit loading state
    this._loadingList$.next(true);
    //set querystring params based on input options
    let params = new HttpParams()
      .set('t', 'all')
      .set('limit', limit)
      .set('after', this._after)
      .set('f', filter || '');

    //make the actual call to external API

    this.http.get(Constants.API_URL, { params }).subscribe((res: any) => {
      //set the new "after"
      this._after = res.data.after;
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
            next: resItem.data.next,
          };
          return listItem;
        });
      if (isReset) this._imageList$.next(imagelist);
      else this._imageList$.next([...this._imageList$.value, ...imagelist]);
      this._intLoadingState = false;
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
