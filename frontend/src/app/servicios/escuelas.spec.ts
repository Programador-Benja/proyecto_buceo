import { TestBed } from '@angular/core/testing';
import { Escuelas } from './escuelas';

describe('Escuelas', () => {
  let service: Escuelas;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Escuelas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
