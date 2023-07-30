import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemDropdownsComponent } from './system-dropdowns.component';

describe('SystemDropdownsComponent', () => {
  let component: SystemDropdownsComponent;
  let fixture: ComponentFixture<SystemDropdownsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SystemDropdownsComponent]
    });
    fixture = TestBed.createComponent(SystemDropdownsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
