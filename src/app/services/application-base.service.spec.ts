import { TestBed } from '@angular/core/testing';

import { ApplicationBaseService } from './application-base.service';

describe('ApplicationBaseService', () => {
  let service: ApplicationBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
