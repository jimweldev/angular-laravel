import { Component, OnInit, Injectable, Inject } from '@angular/core';
import { APP_CONFIG } from '@/app.config';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})

@Injectable()
export class AdminComponent implements OnInit {
  constructor(@Inject(APP_CONFIG) private appConfig: any,
    private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle(`Admin | ${this.appConfig.APP_NAME}`);
  }
}
