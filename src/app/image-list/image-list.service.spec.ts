import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ImageListService } from './image-list.service';

describe('ImageListService', () => {
  let service: ImageListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [],
    });
    service = TestBed.inject(ImageListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
