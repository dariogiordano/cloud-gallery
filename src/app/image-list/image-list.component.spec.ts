import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { PageLoaderComponent } from '../page-loader/page-loader.component';

import { ImageListComponent } from './image-list.component';
import { ImageListService } from './image-list.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
describe('ImageListComponent', () => {
  let component: ImageListComponent;
  let fixture: ComponentFixture<ImageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImageListComponent, PageLoaderComponent],
      imports: [HttpClientTestingModule, MatProgressSpinnerModule],
      providers: [
        { provider: ImageListService, useValue: {} },
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
