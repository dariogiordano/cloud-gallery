import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, Subscription } from 'rxjs';
import { ImageListService } from './image-list.service';
import { ViewportRuler } from '@angular/cdk/scrolling';
export interface imageListItem {
  thumbUrl: string;
  imageUrl: string;
  title: string;
  next: string;
}

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss'],
  host: {
    '(window:resize)': 'onWindowResize($event)',
  },
})
export class ImageListComponent implements OnInit {
  private _rulerSubscription: Subscription | undefined = undefined;
  columnNumber: number = 0;
  hasScrolled = false;
  list$ = new Observable<imageListItem[]>();
  loadingList$ = new Observable<boolean>();
  resizeTimeout: any;
  constructor(
    private _service: ImageListService,
    private _ruler: ViewportRuler
  ) {}

  ngOnInit(): void {
    this.list$ = this._service.imageList$;
    this.loadingList$ = this._service.loadingList$;
    this.changeColumnNumber(
      Math.floor(this._ruler.getViewportSize().width / 150)
    );
    this._service.getCloudImages(!this.hasScrolled, this.columnNumber * 8);
  }

  changeColumnNumber(num: number) {
    this.columnNumber = num;
  }

  onWindowResize(event: any) {
    const previousColumnNumber = this.columnNumber;

    this.changeColumnNumber(Math.floor(event.target.innerWidth / 150));
    if (this.columnNumber !== previousColumnNumber && !this.hasScrolled) {
      this._service.setLoadingList(true);
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(
        () => this._service.getCloudImages(true, this.columnNumber * 8),
        500
      );
    }
  }

  onScroll() {
    this.hasScrolled = true;
    this._service.getCloudImages(!this.hasScrolled, this.columnNumber * 8);
  }
}
