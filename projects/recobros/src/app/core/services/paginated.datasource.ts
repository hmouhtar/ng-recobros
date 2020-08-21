import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { switchMap, startWith, share, tap, pluck } from 'rxjs/operators';
import { SortDirection } from '@angular/material/sort';
import { Dictionary } from 'lodash';

export interface Sort<T> {
  property: keyof T;
  order: SortDirection;
}

type GenericKeys<T> = {
  [k in keyof T]?: any;
};
export interface PageRequest<T> {
  page: number;
  size: number;
  sort?: Sort<T>;
}

export type PageRequestWithSearch<T> = PageRequest<T> & GenericKeys<T>;

export interface Page<T> {
  content: T[];
  totalElements: number;
  size: number;
  number: number;
}

export interface SimpleDataSource<T> extends DataSource<T> {
  connect(): Observable<T[]>;
  disconnect(): void;
}

export type PaginatedEndpoint<T> = (
  req: PageRequestWithSearch<T>
) => Observable<Page<T>>;

export class PaginatedDataSource<T> implements SimpleDataSource<T> {
  private search = new Subject();
  private pageNumber = new Subject<number>();
  private sort = new Subject<Sort<T>>();
  public page$: Observable<Page<T>>;

  constructor(endpoint: PaginatedEndpoint<T>, initialSort: Sort<T>, size = 20) {
    this.page$ = this.search.pipe(
      startWith(''),
      switchMap((search) =>
        this.sort.pipe(
          startWith(initialSort),
          switchMap((sort) =>
            this.pageNumber.pipe(
              startWith(0),
              switchMap((page) =>
                endpoint({
                  page: page,
                  sort: sort,
                  size: size,
                  ...(search as any)
                })
              )
            )
          ),
          share()
        )
      )
    );
  }

  searchBy(searchParams): void {
    console.log('Params:', searchParams);
    this.search.next(searchParams);
  }

  sortBy(sort: Sort<T>): void {
    this.sort.next(sort);
  }

  fetch(page: number): void {
    this.pageNumber.next(page);
  }

  connect(): Observable<T[]> {
    return this.page$.pipe(pluck('content'));
  }

  disconnect(): void {}
}
