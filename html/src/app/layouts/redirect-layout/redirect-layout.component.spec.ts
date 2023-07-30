import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectLayoutComponent } from './redirect-layout.component';

describe('RedirectLayoutComponent', () => {
  let component: RedirectLayoutComponent;
  let fixture: ComponentFixture<RedirectLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RedirectLayoutComponent]
    });
    fixture = TestBed.createComponent(RedirectLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
