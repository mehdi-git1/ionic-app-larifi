import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JalonsComponent } from './jalons.component';

describe('JalonsComponent', () => {
  let component: JalonsComponent;
  let fixture: ComponentFixture<JalonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JalonsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JalonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
