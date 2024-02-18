import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTrainerComponent } from './my-trainer.component';

describe('MyTrainerComponent', () => {
  let component: MyTrainerComponent;
  let fixture: ComponentFixture<MyTrainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyTrainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyTrainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
