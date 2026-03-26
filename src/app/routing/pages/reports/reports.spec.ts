import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { Reports } from './reports';
import { ReportsFacadeService } from './services/reports-facade.service';

describe('Reports', () => {
  let component: Reports;
  let fixture: ComponentFixture<Reports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reports],
      providers: [
        {
          provide: ReportsFacadeService,
          useValue: {
            loading: signal(false),
            reportData: signal({ fwbData: [], totalRecords: 0 }),
            applyFilters: jasmine.createSpy('applyFilters'),
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
