import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-app-loading',
  templateUrl: './app-loading.component.html',
  styleUrls: ['./app-loading.component.scss']
})
export class AppLoadingComponent implements OnInit {
  @Input() isInitalLoading: boolean = false;
  @Input() isSuccess: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
