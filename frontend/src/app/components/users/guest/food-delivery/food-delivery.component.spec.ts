import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodDeliveryComponent } from './food-delivery.component';

describe('FoodDeliveryComponent', () => {
  let component: FoodDeliveryComponent;
  let fixture: ComponentFixture<FoodDeliveryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FoodDeliveryComponent]
    });
    fixture = TestBed.createComponent(FoodDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
