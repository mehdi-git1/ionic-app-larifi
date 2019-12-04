import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularityComponent } from './regularity.component';

describe('RegularityComponent', () => {
  let component: RegularityComponent;
  let fixture: ComponentFixture<RegularityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegularityComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegularityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
