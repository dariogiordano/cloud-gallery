import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageListService } from './image-list.service';
export interface imageListItem {
  thumbUrl: string;
  imageUrl: string;
  title: string;
}

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss'],
})
export class ImageListComponent implements OnInit {
  list$ = new Observable<imageListItem[] | undefined>();
  constructor(private service: ImageListService) {}

  ngOnInit(): void {
    this.list$ = this.service.imageList$;
  }
}
