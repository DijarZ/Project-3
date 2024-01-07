import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopingcartComponent } from './shopingcart.component';

describe('ShopingcartComponent', () => {
  let component: ShopingcartComponent;
  let fixture: ComponentFixture<ShopingcartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShopingcartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShopingcartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
