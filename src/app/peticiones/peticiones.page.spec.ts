import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeticionesPage } from './peticiones.page';

describe('PeticionesPage', () => {
  let component: PeticionesPage;
  let fixture: ComponentFixture<PeticionesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PeticionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
