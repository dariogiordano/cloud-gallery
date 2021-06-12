import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as Constants from '../constants/';
import { imageListItem } from './image-list.component';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ImageListService {
  private _scrollOffset: [number, number] = [0, 0];
  private readonly _imageList$ = new BehaviorSubject<imageListItem[]>([]);
  private readonly _loadingList$ = new BehaviorSubject<boolean>(false);
  private _after: string = '';
  private _intLoadingState = false;
  constructor(private http: HttpClient) {}

  /**
   *
   * @param isReset
   * @param limit
   * @param useCache
   * @param filter
   */
  getCloudImages(
    isReset: boolean,
    limit: number,
    useCache?: boolean,
    filter?: string
  ): void {
    // _intLoadingState is a private variable that tells whether a fetching is active or not. if so, the method won't run another one
    // if the input param useCache is on and there are stored images already, then I know that the subject related to the list will dispatch them some how, so i return

    if (
      this._intLoadingState ||
      (useCache && this._imageList$.getValue().length > 0)
    )
      return;

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
      const filteredlist: any[] = res.data.children.filter(
        (resItem: any) =>
          !!resItem.data.url &&
          !!resItem.data.thumbnail &&
          resItem.data.thumbnail.indexOf('.') > 0 &&
          !resItem.data.media
      );
      const imagelist: imageListItem[] = filteredlist.map(
        (resItem: any, i: number) => {
          let listItem: imageListItem = {
            imageUrl: resItem.data.url,
            thumbUrl: resItem.data.thumbnail,
            title: resItem.data.title,
            id: resItem.data.id,
          };
          return listItem;
        }
      );
      if (isReset) this._imageList$.next(imagelist);
      else {
        //TODO: aggungere il prev e il next al primo di imagelist e all'ultimo di  _imageList$
        this._imageList$.next([...this._imageList$.value, ...imagelist]);
      }
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

  get scrollOffset() {
    return this._scrollOffset;
  }

  set scrollOffset(value: [number, number]) {
    this._scrollOffset = value;
  }
}
