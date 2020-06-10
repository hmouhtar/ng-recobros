import { Component, OnInit } from '@angular/core';
import { RecobrosService } from 'projects/recobros/src/app/core/services/recobros.service';
import { Recobro } from 'projects/recobros/src/app/shared/models/recobro';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'alvea-edit-recobro',
  templateUrl: './edit-recobro.component.html',
  styleUrls: ['./edit-recobro.component.scss'],
})
export class EditRecobroComponent implements OnInit {
  constructor(
    private recobrosService: RecobrosService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.recobrosService
      .getRecobro(
        this.route.snapshot.paramMap.get('sinisterNumber') || '',
        this.route.snapshot.paramMap.get('codSinister') || ''
      )
      .then((recobro) => {
        console.log(recobro);
      });
  }
}
