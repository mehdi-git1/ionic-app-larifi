import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManifexComponent } from './manifex.component';

describe('ManifexComponent', () => {
  let component: ManifexComponent;
  let fixture: ComponentFixture<ManifexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManifexComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManifexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
