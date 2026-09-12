import { TestBed } from '@angular/core/testing';
// Importamos el nombre correcto de nuestra clase
import { FirestoreService } from './firestore';

describe('FirestoreService', () => {
  let service: FirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
