import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPanelProductsComponent } from './dashboard-panel-products.component';

describe('DashboardPanelProductsComponent', () => {
  let component: DashboardPanelProductsComponent;
  let fixture: ComponentFixture<DashboardPanelProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardPanelProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardPanelProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
