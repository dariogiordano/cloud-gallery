import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as Constants from '../constants/';
import { imageDetailsItem } from './image-details.component';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ImageDetailsService {
  private readonly _imageDetails$ = new Subject<imageDetailsItem>();
  private readonly _loadingDetails$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  /**
   * @param id
   */
  getImageDetails(id: string): void {
    //set loading observable to true o emit loading state
    this._loadingDetails$.next(true);

    //make the actual call to external API

    this.http
      .get(`${Constants.API_DETAILS_BASE_URL}${id}.json`)
      .subscribe((res: any) => {
        let imageDetails: imageDetailsItem = {
          title: res[0].data.children[0].data.title,
          imageUrl: res[0].data.children[0].data.url,
        };

        this._imageDetails$.next(imageDetails);

        this._loadingDetails$.next(false);
      });
  }

  get loadingDetails$() {
    return this._loadingDetails$.asObservable();
  }

  get imageDetails$() {
    return this._imageDetails$.asObservable();
  }

  unsetImageDetails() {
    this._imageDetails$.next(undefined);
  }
}
