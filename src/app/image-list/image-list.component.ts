import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ImageListService } from './image-list.service';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { ViewportScroller } from '@angular/common';
export interface ImageListItem {
  thumbUrl: string;
  imageUrl: string;
  title: string;
  id: string;
}
export interface SearchParameters {
  filterValue: string;
  isActive: boolean;
  allFound: boolean;
}

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss'],
  host: {
    '(window:resize)': 'onWindowResize($event)',
  },
})
export class ImageListComponent implements OnInit, OnDestroy {
  searchParameters: SearchParameters = {
    isActive: false,
    allFound: false,
    filterValue: '',
  };
  columnNumber: number = 0;
  largestColumnNumber: number = 0;
  hasScrolled = false;
  list$ = new Observable<ImageListItem[]>();
  loadingList$ = new Observable<boolean>();
  resizeTimeout: any;
  searchParametersSubscription?: Subscription;
  constructor(
    private _service: ImageListService,
    private _ruler: ViewportRuler,
    private _viewportScroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.searchParametersSubscription =
      this._service.searchParameters$.subscribe((res: SearchParameters) => {
        this.searchParameters = res;
      });
    this.list$ = this._service.imageList$;
    this.loadingList$ = this._service.loadingList$;

    this.changeColumnNumber(
      Math.floor(this._ruler.getViewportSize().width / 150)
    );

    this.largestColumnNumber = this.columnNumber;
    this._service.getCloudImages(
      !this.hasScrolled,
      this.columnNumber * 7,
      true
    );
  }

  ngAfterViewInit() {
    if (this._service.scrollOffset[1] > 0) {
      setTimeout(() => {
        this._viewportScroller.scrollToPosition(this._service.scrollOffset);
      });
    }
  }

  ngOnDestroy() {
    this.searchParametersSubscription?.unsubscribe();
    this._service.scrollOffset = this._viewportScroller.getScrollPosition();
  }

  search() {
    this.hasScrolled = false;
    this.searchParameters.isActive = true;
    this.searchParameters.allFound = false;
    this._service.setSearchParameters(this.searchParameters);
    this._service.getCloudImages(true, this.columnNumber * 7, false);
  }

  clearSearch() {
    this.hasScrolled = false;
    this.searchParameters = {
      allFound: false,
      isActive: false,
      filterValue: '',
    };
    this._service.setSearchParameters(this.searchParameters);
    this._service.getCloudImages(true, this.columnNumber * 7, false);
  }

  onImgError(event: any) {
    event.target.src = '../../assets/sad404.svg';
  }

  changeColumnNumber(num: number) {
    this.columnNumber = num;
  }

  onWindowResize(event: any) {
    this._service.setLoadingList(true);
    this.changeColumnNumber(Math.floor(event.target.innerWidth / 150));
    if (
      this.columnNumber > this.largestColumnNumber &&
      !this.hasScrolled &&
      !this.searchParameters.allFound
    ) {
      this.largestColumnNumber = this.columnNumber;

      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(
        () => this._service.getCloudImages(true, this.columnNumber * 7, false),
        500
      );
    } else this._service.setLoadingList(false);
  }

  onScroll() {
    this.hasScrolled = true;
    this._service.getCloudImages(
      !this.hasScrolled,
      this.columnNumber * 7,
      false
    );
  }
}
