import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderContactInfoComponent } from './order-contact-info.component';

describe('OrderContactInfoComponent', () => {
  let component: OrderContactInfoComponent;
  let fixture: ComponentFixture<OrderContactInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderContactInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderContactInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
