import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationsGuestComponent } from './reservations-guest.component';

describe('ReservationsGuestComponent', () => {
  let component: ReservationsGuestComponent;
  let fixture: ComponentFixture<ReservationsGuestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReservationsGuestComponent]
    });
    fixture = TestBed.createComponent(ReservationsGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
