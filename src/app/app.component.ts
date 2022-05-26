import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  array: number[] = [];

  ngOnInit(): void {
    for (let i = 0; i < 64; i++) {
      this.array.push(i);
    }
  }

  title = 'angular-scichart-demo';
}
