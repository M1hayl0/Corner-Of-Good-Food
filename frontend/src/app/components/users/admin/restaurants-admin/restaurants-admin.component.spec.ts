import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantsAdminComponent } from './restaurants-admin.component';

describe('RestaurantsAdminComponent', () => {
  let component: RestaurantsAdminComponent;
  let fixture: ComponentFixture<RestaurantsAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RestaurantsAdminComponent]
    });
    fixture = TestBed.createComponent(RestaurantsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
