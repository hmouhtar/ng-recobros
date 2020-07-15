import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Taxonomy {
  slug: string; // Identifier, unique.
  name: string;
}

export interface Term {
  id: number; // Identifier, unique.
  slug: string; // No term under the same taxonomy can have a repeated slug. This field will be used as a cleaner way of
  // searching for terms by name, avoiding the need to have previous knowledge of the ID.
  name: string;
  taxonomy: string; // The taxonomy's slug this term belongs to.
  parent_term?: number;
}
interface TaxonomyServiceInt {
  getTaxonomies(): Taxonomy[];
  getTerms(): Term[];
  getTermsFromTaxonomy(taxonomySlug: string): Promise<Term[]>;
  getTermChildren(termID: number): Promise<Term[]>;
  getTermByID(termID: number): Promise<Term>;
  getTermBySlug(termSlug: string, taxonomySlug: string): Promise<Term>;
}
@Injectable({
  providedIn: 'root'
})
export class TaxonomyService implements TaxonomyServiceInt {
  getTaxonomies(): Promise<Taxonomy[]> {}
  getTerms(): Promise<Term[]> {}
  getTermsFromTaxonomy(taxonomySlug: string): Promise<Term[]> {}
  getTermChildren(termID: number): Promise<Term[]> {}
  getTermByID(termID: number): Promise<Term> {}
  getTermBySlug(termSlug: string): Promise<Term> {}

  constructor(private http: HttpClient) {}
}
