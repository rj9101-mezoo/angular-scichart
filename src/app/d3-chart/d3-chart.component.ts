import {
  Component,
  ElementRef,
  Input,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import * as d3 from 'd3';
import { scaleLinear } from 'd3';

@Component({
  selector: 'app-d3-chart',
  templateUrl: './d3-chart.component.html',
  styleUrls: ['./d3-chart.component.css'],
})
export class D3ChartComponent implements OnInit, AfterViewInit {
  xScale: any;
  yScale: any;
  drawLine: any;
  svg: any;
  xMinMax: any;
  yMinMax: any;
  g: any;
  width = 200;
  height = 150;
  count = 1000;

  @Input() index = 0;

  constructor(private el: ElementRef) {}
  ngAfterViewInit(): void {
    //1. data
    const data: { x: number; y: number }[] = [];
    for (let i = 0; i < this.count; i++) {
      data.push({ x: i, y: Math.sin(i * 0.1) });
    }

    this.buildChart(data);
  }

  ngOnInit(): void {}

  buildChart(data: any) {
    //2. svg 생성
    this.svg = d3
      .select(`#chart-${this.index}`)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    this.g = this.svg.append('g');

    //3. x, y축의 range, domain 설정
    this.configChart(data);

    //4. draw chart
    this.drawChart(data);

    //5. update data
    this.updateChart(data);
  }

  configChart(data: any) {
    const yValue = (d: { x: number; y: number }) => d.y;
    const xValue = (d: { x: number; y: number }) => d.x;

    this.xMinMax = d3.extent(data, xValue);
    this.yMinMax = d3.extent(data, yValue);

    this.xScale = d3.scaleLinear().domain(this.xMinMax).range([0, this.width]);
    this.yScale = d3.scaleLinear().domain(this.yMinMax).range([this.height, 0]);

    this.drawLine = d3
      .line<{ x: number; y: number }>()
      .x((d: any) => this.xScale(d.x))
      .y((d: any) => this.yScale(d.y));
  }

  drawChart(data: any) {
    this.g
      .append('path')
      .attr('d', this.drawLine(data))
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('stroke-width', 2);
  }

  updateChart(data: any) {
    ++this.count;

    data.shift();
    data.push({ x: this.count, y: Math.sin(this.count * 0.1) });

    this.configChart(data);
    this.svg.transition();
    this.svg.select('path').attr('d', this.drawLine(data));

    setTimeout(() => this.updateChart(data), 8);
  }
}
