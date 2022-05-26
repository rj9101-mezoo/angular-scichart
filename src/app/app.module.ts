import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ChartComponent } from './chart/chart.component';
import { D3ChartComponent } from './d3-chart/d3-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    D3ChartComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
