import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Constants from '../constants/';
import { ImageDetailsItem } from './image-details.component';
import { BehaviorSubject, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ImageDetailsService {
  // the subject tha will dispatch the fetched detail data
  private readonly _imageDetails$ = new Subject<ImageDetailsItem>();
  // a boolean that represent the loading state of the fetching process and is used by the component interface
  private readonly _loadingDetails$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  /**
   * fetch an image detail from API with a give id and disaptch the result
   *
   * @param id the ID of the detail image to fetch
   */
  getImageDetails(id: string): void {
    //set loading observable to true o emit loading state
    this._loadingDetails$.next(true);

    //make the actual call to external API

    this.http
      .get(`${Constants.API_DETAILS_BASE_URL}${id}.json`)
      .subscribe((res: any) => {
        let imageDetails: ImageDetailsItem = {
          title: res[0].data.children[0].data.title,
          imageUrl: res[0].data.children[0].data.url,
        };
        this._imageDetails$.next(imageDetails);
        this._loadingDetails$.next(false);
      });
  }

  //some getters and setters of the private values of the service

  get loadingDetails$() {
    return this._loadingDetails$.asObservable();
  }

  get imageDetails$() {
    return this._imageDetails$.asObservable();
  }

  /**
   *
   * sets image details subject as undefined
   */
  unsetImageDetails() {
    this._imageDetails$.next(undefined);
  }
}
