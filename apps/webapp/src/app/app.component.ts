import { Component } from '@angular/core';
import { CfgService } from '@un33k/ngx-cfg';

@Component({
  selector: 'web-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = '@un33k/ngx-cfg';
  options = {};
  constructor(public cfgService: CfgService) {
    this.title = this.cfgService.options.appName;
  }
}
