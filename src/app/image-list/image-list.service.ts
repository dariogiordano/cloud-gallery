import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as Constants from '../constants/';
import { ImageListItem, SearchParameters } from './image-list.component';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { expand, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class ImageListService {
  private _scrollOffset: [number, number] = [0, 0];
  private _imageList$ = new BehaviorSubject<ImageListItem[]>([]);
  private _loadingList$ = new BehaviorSubject<boolean>(false);
  private _searchParameters$ = new BehaviorSubject<SearchParameters>({
    filterValue: '',
    allFound: false,
    isActive: false,
  });
  private _after?: string;

  private _intLoadingState = false;
  constructor(private http: HttpClient) {}

  /**
   *
   * @param isReset
   * @param limit
   * @param useCache
   * @param filter
   */
  getCloudImages(isReset: boolean, limit: number, useCache?: boolean): void {
    // _intLoadingState is a private variable that tells whether a fetching is active or not. if so, the method won't run another one
    // if the input param useCache is on and there are stored images already, then I know that the subject related to the list will dispatch them some how, so i return
    if (
      this._intLoadingState ||
      (useCache && this._imageList$.getValue().length > 0)
    ) {
      return;
    }
    if (isReset) {
      this._after = undefined;
      this._imageList$.next([]);
    }

    this._intLoadingState = true;

    //set loading observable to true o emit loading state
    this._loadingList$.next(true);
    //set querystring params based on input options

    //make the actual call to external API

    const fetchImages = () => {
      console.log(this._imageList$.getValue().length, limit);
      let params = new HttpParams()
        .set('t', 'all')
        .set('limit', 100)
        .set('after', this._after || '');
      return this.http.get(Constants.API_URL, { params }).pipe(
        tap((res: any) => {
          //set the new "after"

          this._after = res.data.after;
          let filteredlist: any[] = res.data.children.filter(
            (resItem: any) =>
              !!resItem.data.url &&
              !!resItem.data.thumbnail &&
              resItem.data.thumbnail.indexOf('.') > 0 &&
              !resItem.data.media
          );
          if (this._searchParameters$.getValue().isActive) {
            filteredlist = filteredlist.filter((item) => {
              return item.data.title.includes(
                this._searchParameters$.getValue().filterValue
              );
            });
          }

          const imagelist: ImageListItem[] = filteredlist.map(
            (resItem: any, i: number) => {
              let listItem: ImageListItem = {
                imageUrl: resItem.data.url,
                thumbUrl: resItem.data.thumbnail,
                title: resItem.data.title,
                id: resItem.data.id,
              };
              return listItem;
            }
          );

          this._imageList$.next([...this._imageList$.value, ...imagelist]);
          /*if () {
  this.getCloudImages(isReset, limit);
} else {
 
}*/
        })
      );
    };

    fetchImages()
      .pipe(
        expand(() => {
          if (this._imageList$.getValue().length < limit && this._after) {
            return fetchImages();
          } else {
            this._intLoadingState = false;
            this._loadingList$.next(false);
            return EMPTY;
          }
        })
      )
      .subscribe(() => {});
  }

  get loadingList$() {
    return this._loadingList$.asObservable();
  }

  get searchParameters$() {
    return this._searchParameters$.asObservable();
  }

  setSearchParameters(value: SearchParameters) {
    this._searchParameters$.next(value);
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
