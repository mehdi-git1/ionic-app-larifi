import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularityPage } from './regularity.page';

describe('RegularityComponent', () => {
  let component: RegularityPage;
  let fixture: ComponentFixture<RegularityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegularityPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegularityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
