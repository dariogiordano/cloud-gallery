import { Component, ElementRef, Injectable, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MaterialElevationDirective } from './material-elevation.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@Component({
  template: `
    <h2 appMaterialElevation [defaultElevation]="0" [raisedElevation]="4">
      something to be raised
    </h2>
    <h2 class="not-raised">something not to be raised</h2>
  `,
})
class TestComponent {}

describe('MaterialElevationDirective', () => {
  let raisedElements: any[] = [];
  let notRaisedElements: any[] = [];
  beforeEach(() => {
    const fixture = TestBed.configureTestingModule({
      declarations: [MaterialElevationDirective, TestComponent],
      imports: [BrowserAnimationsModule],
    }).createComponent(TestComponent);

    fixture.detectChanges();

    raisedElements = fixture.debugElement.queryAll(
      By.directive(MaterialElevationDirective)
    );
    notRaisedElements = fixture.debugElement.queryAll(By.css('.not-raised'));
  });

  it('should element have mat elevation class', () => {
    expect(raisedElements[0].classes['mat-elevation-z0']).toBeTrue();
    expect(notRaisedElements[0].classes['mat-elevation-z0']).toBeFalsy();
  });
});
