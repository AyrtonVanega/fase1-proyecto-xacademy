import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportResultModal } from './import-result-modal';

describe('ImportResultModal', () => {
  let component: ImportResultModal;
  let fixture: ComponentFixture<ImportResultModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportResultModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportResultModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
