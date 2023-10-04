import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugFormComponent } from './debug-form.component';

describe('DebugFormComponent', () => {
  let component: DebugFormComponent;
  let fixture: ComponentFixture<DebugFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DebugFormComponent]
    });
    fixture = TestBed.createComponent(DebugFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
