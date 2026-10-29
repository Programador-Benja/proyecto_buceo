import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Escuelas } from './escuelas';

describe('Escuelas', () => {
  let component: Escuelas;
  let fixture: ComponentFixture<Escuelas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Escuelas],
    }).compileComponents();

    fixture = TestBed.createComponent(Escuelas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
