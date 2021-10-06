import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailpayComponent } from './emailpay.component';

describe('EmailpayComponent', () => {
  let component: EmailpayComponent;
  let fixture: ComponentFixture<EmailpayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailpayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailpayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
