import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitersAdminComponent } from './waiters-admin.component';

describe('WaitersAdminComponent', () => {
  let component: WaitersAdminComponent;
  let fixture: ComponentFixture<WaitersAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WaitersAdminComponent]
    });
    fixture = TestBed.createComponent(WaitersAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
