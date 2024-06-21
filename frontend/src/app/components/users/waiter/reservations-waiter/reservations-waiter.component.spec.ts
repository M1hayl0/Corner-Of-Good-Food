import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationsWaiterComponent } from './reservations-waiter.component';

describe('ReservationsWaiterComponent', () => {
  let component: ReservationsWaiterComponent;
  let fixture: ComponentFixture<ReservationsWaiterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReservationsWaiterComponent]
    });
    fixture = TestBed.createComponent(ReservationsWaiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
