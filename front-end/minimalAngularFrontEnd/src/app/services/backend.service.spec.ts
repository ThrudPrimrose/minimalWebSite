import { TestBed } from '@angular/core/testing';

import { BackendService } from './backend.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

describe('BackendService', () => {
  let service: BackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
