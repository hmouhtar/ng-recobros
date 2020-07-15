import { TestBed } from '@angular/core/testing';
import { TaxonomyService, Taxonomy } from './taxonomy.service';
import { Observable, of } from 'rxjs';
const taxonomies: Taxonomy[] = [
  {
    slug: 'incidente',
    name: 'Incidente'
  },
  {
    slug: 'jurisdiccion',
    name: 'Jurisdicción'
  }
];
const terms = [
  { id: 1, slug: 'asistencia', name: 'Asistencia', taxonomy: 'incidente' },
  {
    id: 2,
    slug: 'gastos-asistencia',
    name: 'Gastos Asistencia',
    taxonomy: 'incidente',
    parent_term: 1
  },
  { id: 3, slug: 'auto', name: 'Auto', taxonomy: 'incidente' },
  {
    id: 4,
    slug: 'conductor-menor',
    name: 'Conductor Menor',
    taxonomy: 'incidente',
    parent_term: 3
  },
  {
    id: 5,
    slug: 'conductor-sin-carnet',
    name: 'Conductor Sin Carnet',
    taxonomy: 'incidente',
    parent_term: 3
  }
];
describe('TaxonomyService', () => {
  let service: TaxonomyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaxonomyService);
    spyOn(service, 'getTerms').and.returnValue(of(terms).toPromise());
    spyOn(service, 'getTaxonomies').and.returnValue(of(taxonomies).toPromise());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get the main terms from a taxonomy', () => {
    const mainTermsFromIncidente = [
      {
        id: 2,
        slug: 'gastos-asistencia',
        name: 'Gastos Asistencia',
        taxonomy: 'incidente',
        parent_term: 1
      },
      { id: 3, slug: 'auto', name: 'Auto', taxonomy: 'incidente' }
    ];

    service.getTermsFromTaxonomy('incidente').then((terms): void => {
      expect(terms).toEqual(mainTermsFromIncidente);
    });
  });

  it('should get the children of a term', () => {
    const term3Children = [
      {
        id: 4,
        slug: 'conductor-menor',
        name: 'Conductor Menor',
        taxonomy: 'incidente',
        parent_term: 3
      },
      {
        id: 5,
        slug: 'conductor-sin-carnet',
        name: 'Conductor Sin Carnet',
        taxonomy: 'incidente',
        parent_term: 3
      }
    ];

    service.getTermChildren(3).then((terms): void => {
      expect(terms).toEqual(term3Children);
    });
  });

  it('should get a term by ID', () => {
    const term3 = { id: 3, slug: 'auto', name: 'Auto', taxonomy: 'incidente' };
    service.getTermByID(3).then((term): void => {
      expect(term).toEqual(term3);
    });
  });

  it('should get a term by slug', () => {
    const termGastosAsistencia = {
      id: 2,
      slug: 'gastos-asistencia',
      name: 'Gastos Asistencia',
      taxonomy: 'incidente',
      parent_term: 1
    };

    service.getTermBySlug('gastos-asistencia').then((term): void => {
      expect(term).toEqual(termGastosAsistencia);
    });
  });

  it('should reject the promise if the term does not exist', async () => {
    await expectAsync(service.getTermByID(999)).toBeRejectedWith(
      new Error('Term does not exist.')
    );
    await expectAsync(service.getTermChildren(999)).toBeRejectedWith(
      new Error('Term does not exist.')
    );
    await expectAsync(
      service.getTermBySlug('non-existing-term')
    ).toBeRejectedWith(new Error('Term does not exist.'));
  });

  it('should reject the promise if the taxonomy does not exist', async () => {
    await expectAsync(
      service.getTermsFromTaxonomy('non-existing-taxonomy')
    ).toBeRejectedWith(new Error('Taxonomy does not exist.'));
  });
});
