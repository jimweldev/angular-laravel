import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailLogsComponent } from './mail-logs.component';

describe('MailLogsComponent', () => {
  let component: MailLogsComponent;
  let fixture: ComponentFixture<MailLogsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MailLogsComponent]
    });
    fixture = TestBed.createComponent(MailLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
