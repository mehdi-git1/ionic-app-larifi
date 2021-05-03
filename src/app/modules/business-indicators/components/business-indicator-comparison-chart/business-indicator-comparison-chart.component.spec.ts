import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BusinessIndicatorComparisonChartComponent } from './business-indicator-comparison-chart.component';

describe('BusinessIndicatorComparisonChartComponent', () => {
  let component: BusinessIndicatorComparisonChartComponent;
  let fixture: ComponentFixture<BusinessIndicatorComparisonChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessIndicatorComparisonChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessIndicatorComparisonChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
