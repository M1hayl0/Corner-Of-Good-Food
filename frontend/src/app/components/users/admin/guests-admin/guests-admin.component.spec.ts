import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestsAdminComponent } from './guests-admin.component';

describe('GuestsAdminComponent', () => {
  let component: GuestsAdminComponent;
  let fixture: ComponentFixture<GuestsAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuestsAdminComponent]
    });
    fixture = TestBed.createComponent(GuestsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
