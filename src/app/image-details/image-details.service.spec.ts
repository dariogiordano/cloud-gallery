import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ImageDetailsService } from './image-details.service';

describe('ImageDetailsService', () => {
  let service: ImageDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [],
    });
    service = TestBed.inject(ImageDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
