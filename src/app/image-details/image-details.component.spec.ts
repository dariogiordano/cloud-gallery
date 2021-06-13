import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PageLoaderComponent } from '../page-loader/page-loader.component';

import { ImageDetailsComponent } from './image-details.component';
import { ImageDetailsService } from './image-details.service';
describe('ImageDetailsComponent', () => {
  let component: ImageDetailsComponent;
  let fixture: ComponentFixture<ImageDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImageDetailsComponent, PageLoaderComponent],

      imports: [HttpClientTestingModule, MatProgressSpinnerModule],
      providers: [
        { provider: ImageDetailsService, useValue: {} },
        {
          provide: ActivatedRoute,
          useValue: {
            pathFromRoot: [{ url: of('test') }, { url: of('test') }],
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
