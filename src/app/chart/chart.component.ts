import { Component, AfterViewInit, OnInit, Input } from '@angular/core';
import { SciChartSurface } from 'scichart';
import { chartBuilder } from 'scichart/Builder/chartBuilder';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { FastLineRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries';
import { XyScatterRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/XyScatterRenderableSeries';
import { NumberRange } from 'scichart/Core/NumberRange';
import { ESeriesType } from 'scichart/types/SeriesType';
import { EllipsePointMarker } from 'scichart/Charting/Visuals/PointMarkers/EllipsePointMarker';
import { timer } from 'rxjs';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements AfterViewInit {
  @Input() index: number = 0;
  count: number = 0;

  ngAfterViewInit(): void {
    this.initSciChart_();
  }

  async initSciChart_() {
    // instance must be passed to other types that exist on the same surface.
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(
      `scichart-root-${this.index}`
    );

    const xAxis = new NumericAxis(wasmContext); // X축 선언
    const yAxis = new NumericAxis(wasmContext); // Y축 선언

    xAxis.isVisible = false;
    yAxis.isVisible = false;

    sciChartSurface.xAxes.add(xAxis); //chart에 x축 넣기
    sciChartSurface.yAxes.add(yAxis); //chart에 y축 넣기

    const scatterSeries = new XyScatterRenderableSeries(wasmContext, {
      pointMarker: new EllipsePointMarker(wasmContext, {
        width: 7,
        height: 7,
        fill: 'White',
        stroke: 'SteelBlue',
      }),
    }); //scatter series를 추가하기
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
      stroke: '#4083B7',
      strokeThickness: 2,
    }); //line series를 추가하기
    sciChartSurface.renderableSeries.add(lineSeries, scatterSeries); // line series와 scatter series를 chart에 추가하기

    const scatterData = new XyDataSeries(wasmContext, {
      dataSeriesName: 'Cos(x)',
    }); // scatter data를 만들기
    const lineData = new XyDataSeries(wasmContext, {
      dataSeriesName: 'Sin(x)',
    }); // line data를 만들기
    //XyDataSeries 생성자에 xValue, yValue를 넣을 수도 있다. bigger dataset을 위해 appendRange를 사용할 수도 있다.

    for (let i = 0; i < 1000; i++) {
      lineData.append(i, Math.sin(i * 0.1)); // 정적 데이터를 line data에 넣기
      // scatterData.append(i, Math.cos(i * 0.1)); // 정적 데이터를 scatter data에 넣기
    }

    // scatterSeries.dataSeries = scatterData; //scatter data를 scatter series에 넣기
    lineSeries.dataSeries = lineData; // line data를 line series에 넣기

    let phase = 0.0;

    // 1. 데이터를 갱신하는 경우
    // const updateDataFunc = () => {
    //   // 데이터가 많을 땐, updateRange()가 더 좋은 성능을 낸다.
    //   for (let i = 0; i < 1000; i++) {
    //     lineData.update(i, Math.sin(i * 0.1 + phase)); // lineData를 갱신한다.
    //     // scatterData.update(i, Math.cos(i * 0.1 + phase)); // scatterData를 갱신한다.
    //   }
    //   phase += 0.01;

    //   //40Hz로 진동한다.
    //   setTimeout(updateDataFunc, 1);
    // };

    //2. Realtime chart를 옆으로 움직이게 하는 방법
    const updateDataFunc = () => {
      // const i = lineData.count(); //lineData의 데이터 총 개수
      // lineData.removeAt(0);
      // lineData.append(this.count, Math.sin(this.count * 0.1));
      if (this.count === 1000) {
        this.count = 0;
      }

      // lineData.insert(this.count, this.count, Math.sin(this.count * 0.1));
      lineData.update(this.count, Math.sin(this.count * 0.1));
      for (let i = this.count + 1; i < this.count + 26; i++) {
        if (i >= 1000) {
          lineData.update(i - 1000, NaN);
        } else {
          lineData.update(i, NaN);
        }
      }
      this.count++;

      timer(8).pipe().subscribe(updateDataFunc);
    };

    updateDataFunc();
  }
}
