import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePersonajeComponent } from './detalle-personaje';

describe('DetallePersonajeComponent', () => {
  let component: DetallePersonajeComponent;
  let fixture: ComponentFixture<DetallePersonajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallePersonajeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetallePersonajeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
