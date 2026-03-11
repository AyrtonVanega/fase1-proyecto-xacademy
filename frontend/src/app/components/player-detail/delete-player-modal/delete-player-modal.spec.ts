import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePlayerModal } from './delete-player-modal';

describe('DeletePlayerModal', () => {
  let component: DeletePlayerModal;
  let fixture: ComponentFixture<DeletePlayerModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletePlayerModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletePlayerModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
