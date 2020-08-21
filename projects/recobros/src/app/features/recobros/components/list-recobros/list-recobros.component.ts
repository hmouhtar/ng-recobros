import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Recobro } from 'projects/recobros/src/app/shared/models/recobro';
import { RecobrosService } from 'projects/recobros/src/app/core/services/recobros.service';
import { MatSort } from '@angular/material/sort';
import { RolesService } from 'projects/recobros/src/app/core/services/roles.service';
import {
  PaginatedDataSource,
  Sort
} from 'projects/recobros/src/app/core/services/paginated.datasource';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { FieldService } from 'projects/recobros/src/app/core/services/field.service';
import { Field } from 'projects/recobros/src/app/shared/models/field';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'alvea-list-recobros',
  templateUrl: './list-recobros.component.html',
  styleUrls: ['./list-recobros.component.scss']
})
export class ListRecobrosComponent implements OnInit {
  dataSource: PaginatedDataSource<Recobro>;
  initialSort: Sort<Recobro> = { property: 'sinisterNumber', order: 'asc' };
  loadingAction = false;
  canCreateRecobro: boolean;
  displayedColumns: string[] = [
    //'username',
    'sinisterNumber',
    'codSinister',
    'initDate',
    'recoverySituation',
    'recoveryRoute',
    'situationManagement',
    'situationDate',
    'company',
    'edit'
  ];
  searchFilterFields: Field<Recobro>[] = [];
  // @ViewChild('searchBySinisterNumberInput')
  // searchBySinisterNumberInput: ElementRef;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private recobrosService: RecobrosService,
    private rolesService: RolesService,
    private fieldService: FieldService
  ) {}

  ngOnInit(): void {
    this.rolesService
      .currentUserCan('CREATE_RECOVERY')
      .then((res) => (this.canCreateRecobro = res));

    this.setTableDataSource();
    this.getFilterFields();
    this.fieldService.getRecobroSearchFilterFields().then((fields) => {
      this.searchFilterFields = fields;
      console.log(fields);
    });
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() =>
      this.dataSource.sortBy({
        property: this.sort.active as keyof Recobro,
        order: this.sort.direction
      })
    );

    // fromEvent(this.searchBySinisterNumberInput.nativeElement, 'keyup')
    //   .pipe(
    //     debounceTime(150),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.dataSource.searchBy(
    //         'sinisterNumber',
    //         this.searchBySinisterNumberInput.nativeElement.value
    //       );
    //     })
    //   )
    //   .subscribe();
  }

  filterResults(form: NgForm): void {
    console.log(form.value);
    this.dataSource.searchBy(form.value);
  }

  setTableDataSource() {
    this.dataSource = new PaginatedDataSource<Recobro>(
      (request) => this.recobrosService.getRecobrosPage(request),
      this.initialSort
    );
  }

  getFilterFields() {}
}
