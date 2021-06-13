import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as Constants from '../constants/';
import { ImageListItem, SearchParameters } from './image-list.component';
import { BehaviorSubject, EMPTY } from 'rxjs';
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
   *
   * @param isReset boolean: tell the method if this is a new search (true) or a nth call made by pagination (false)
   * @param limit number: maximum amount of items required by the component in order to have a good UX
   * @param useCache boolean: if true and there is any item already fetched and stored in list, then exit the function
   */
  getCloudImages(isReset: boolean, limit: number, useCache?: boolean): void {
    // _intLoadingState is a private variable that tells whether a fetching is active or not. if so, the method won't run another one
    // if the input param useCache is on and there are stored images already, then I know that the subject related to the list will dispatch them some how, so i return
    if (
      this._intLoadingState ||
      this._searchParameters$.getValue().allFound ||
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

    //return the actual call to external API. As side effect in the tap operator a new value of the fetched list is filtered and then added to the previous values.
    //this is a recursive call, made till the number of items is equal or bigger than the input "limit" param or until there are no more values fetched from the api
    const fetchImages = () => {
      let params = new HttpParams()
        .set('t', 'all')
        .set('limit', 100)
        .set('after', this._after || '');
      return this.http.get(Constants.API_URL, { params }).pipe(
        tap((res: any) => {
          //set the new "after" which is the string to give to api that tells the item to start from when fetching a new batch of the list
          //if there is no after, it means the the api has reached the end of the list of items that match thefetching criteria.
          this._after = res.data.after;
          // allfound in searchParameters means that all the images with the given criteria has been fetched
          const allFound = this._after === null;
          //emit a new searchParameters in order for the list component to know whether to fetch more images with infinite scroll or not or not.
          this._searchParameters$.next({
            ...this._searchParameters$.getValue(),
            allFound,
          });
          // some filtering based on nature of items in the raw list fetched
          let filteredlist: any[] = res.data.children.filter(
            (resItem: any) =>
              !!resItem.data.url &&
              !!resItem.data.thumbnail &&
              resItem.data.thumbnail.indexOf('.') > 0 &&
              !resItem.data.media
          );

          //  filtering based on filter string contained in the title
          if (this._searchParameters$.getValue().isActive) {
            filteredlist = filteredlist.filter((item) => {
              return item.data.title.includes(
                this._searchParameters$.getValue().filterValue
              );
            });
          }
          // map the raw list to our simplified model
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
          // set a new value of our list subject
          this._imageList$.next([...this._imageList$.value, ...imagelist]);
        })
      );
    };

    //this is the the actual conditional recursive process
    fetchImages()
      .pipe(
        expand(() => {
          if (this._imageList$.getValue().length < limit && this._after) {
            //make another round of fetching
            return fetchImages();
          } else {
            // set "all done"
            this._intLoadingState = false;
            this._loadingList$.next(false);
            return EMPTY;
          }
        })
      )
      .subscribe(() => {});
  }

  //some getters and setters of the private values of the service

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
