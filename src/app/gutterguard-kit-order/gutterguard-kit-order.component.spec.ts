import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GutterguardKitOrderComponent } from './gutterguard-kit-order.component';

describe('GutterguardKitOrderComponent', () => {
  let component: GutterguardKitOrderComponent;
  let fixture: ComponentFixture<GutterguardKitOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GutterguardKitOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GutterguardKitOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
