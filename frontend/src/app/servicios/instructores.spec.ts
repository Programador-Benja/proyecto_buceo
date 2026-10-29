import { TestBed } from '@angular/core/testing';
import { Instructores } from './instructores';

describe('Instructores', () => {
  let service: Instructores;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Instructores);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
