import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-table-loading',
  templateUrl: './table-loading.component.html',
  styleUrls: ['./table-loading.component.scss']
})
export class TableLoadingComponent implements OnInit {
  @Input() isLoading: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
