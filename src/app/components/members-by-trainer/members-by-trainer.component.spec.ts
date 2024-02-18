import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersByTrainerComponent } from './members-by-trainer.component';

describe('MembersByTrainerComponent', () => {
  let component: MembersByTrainerComponent;
  let fixture: ComponentFixture<MembersByTrainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembersByTrainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MembersByTrainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
