import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { CfgModule } from '@un33k/ngx-cfg';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, CfgModule.forRoot(environment)],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
