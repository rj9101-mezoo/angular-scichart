// import { Component, OnInit } from '@angular/core';
// import { SciChartSurface } from 'scichart';
// import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
// import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
// import { EllipsePointMarker } from 'scichart/Charting/Visuals/PointMarkers/EllipsePointMarker';
// import { FastLineRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries';
// import { GlowEffect } from 'scichart/Charting/Visuals/RenderableSeries/GlowEffect';
// import { XyScatterRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/XyScatterRenderableSeries';
// import { NumberRange } from 'scichart/Core/NumberRange';
// import { EAutoRange } from 'scichart/types/AutoRange';
// import { ENumericFormat } from 'scichart/types/NumericFormat';
// import { vitalSignsEcgData } from './data';

// @Component({
//   selector: 'app-medical-chart',
//   templateUrl: './medical-chart.component.html',
//   styleUrls: ['./medical-chart.component.css'],
// })
// export class MedicalChartComponent implements OnInit {
//   divElementId = 'chart';
//   COLOR_GREEN = '#00FF00';
//   COLOR_YELLOW = '#FFFF00';
//   COLOR_GREY = '#F5FFFA';
//   COLOR_BLUE = '#1E90FF';
//   STEP = 10;
//   TIMER_TIMEOUT_MS = 20;
//   STROKE_THICKNESS = 4;
//   POINTS_LOOP = 5200;
//   GAP_POINTS = 200;
//   DATA_LENGTH = vitalSignsEcgData.xValues.length;

//   timerId: NodeJS.Timeout | undefined;

//   xValues = vitalSignsEcgData.xValues;
//   ecgHeartRateValues = vitalSignsEcgData.ecgHeartRateValues;
//   bloodPressureValues = vitalSignsEcgData.bloodPressureValues;
//   bloodVolumeValues = vitalSignsEcgData.bloodVolumeValues;
//   bloodOxygenationValues = vitalSignsEcgData.bloodOxygenationValues;

//   currentPoint = 0;
//   scs: SciChartSurface | undefined;
//   autoStartTimerId: NodeJS.Timeout | undefined;

//   infoEcg: number | undefined;
//   infoBloodPressure1: number | undefined;
//   infoBloodPressure2: number | undefined;
//   infoBloodVolume: number | undefined;
//   infoBloodOxygenation: number | undefined;

//   constructor() {
//     const delta1 =
//       this.ecgHeartRateValues[this.DATA_LENGTH - 1] -
//       this.ecgHeartRateValues[0] / (this.DATA_LENGTH - 1);
//     const delta2 =
//       (this.bloodPressureValues[this.DATA_LENGTH - 1] -
//         this.bloodPressureValues[0]) /
//       (this.DATA_LENGTH - 1);
//     const delta3 =
//       (this.bloodVolumeValues[this.DATA_LENGTH - 1] -
//         this.bloodVolumeValues[0]) /
//       (this.DATA_LENGTH - 1);
//     const delta4 =
//       (this.bloodOxygenationValues[this.DATA_LENGTH - 1] -
//         this.bloodOxygenationValues[0]) /
//       (this.DATA_LENGTH - 1);
//     this.xValues.forEach((_el, index) => {
//       this.ecgHeartRateValues[index] =
//         (this.ecgHeartRateValues[index] - delta1 * index - 0.7) / 0.3 + 3;
//       this.bloodPressureValues[index] =
//         (this.bloodPressureValues[index] - delta2 * index - 0.4) / 0.3 + 1.9;
//       this.bloodVolumeValues[index] =
//         (this.bloodVolumeValues[index] - delta3 * index - 0.15) / 0.3 + 1.1;
//       this.bloodOxygenationValues[index] =
//         (this.bloodOxygenationValues[index] - delta4 * index) / 0.2;
//     });
//   }

//   ngOnInit(): void {}

//   getValuesFromData(xIndex: number) {
//     const xArr: number[] = [];
//     const xPlusGapArr: number[] = [];
//     const ecgHeartRateArr: number[] = [];
//     const bloodPressureArr: number[] = [];
//     const bloodVolumeArr: number[] = [];
//     const bloodOxygenationArr: number[] = [];
//     for (let i = 0; i < this.STEP; i++) {
//       const dataIndex = (xIndex + i) % this.DATA_LENGTH;
//       const x = (xIndex + i) % this.POINTS_LOOP;
//       const xPlusGap = (xIndex + i + this.GAP_POINTS) % this.POINTS_LOOP;
//       xArr.push(x);
//       xPlusGapArr.push(xPlusGap);
//       ecgHeartRateArr.push(this.ecgHeartRateValues[dataIndex]);
//       bloodPressureArr.push(this.bloodPressureValues[dataIndex]);
//       bloodVolumeArr.push(this.bloodVolumeValues[dataIndex]);
//       bloodOxygenationArr.push(this.bloodOxygenationValues[dataIndex]);
//     }
//     return {
//       xArr,
//       xPlusGapArr,
//       ecgHeartRateArr,
//       bloodPressureArr,
//       bloodVolumeArr,
//       bloodOxygenationArr,
//     };
//   }

//   async drawExample() {
//     const { sciChartSurface, wasmContext } = await SciChartSurface.createSingle(
//       this.divElementId,
//       {
//         widthAspect: 600,
//         heightAspect: 600,
//       }
//     );

//     const xAxis = new NumericAxis(wasmContext, {
//       autoRange: EAutoRange.Once,
//       isVisible: false,
//     });
//     sciChartSurface.xAxes.add(xAxis);

//     const yAxis = new NumericAxis(wasmContext, {
//       autoRange: EAutoRange.Never,
//       visibleRange: new NumberRange(0, 4),
//       isVisible: false,
//     });
//     yAxis.labelProvider.numericFormat = ENumericFormat.Decimal;
//     sciChartSurface.yAxes.add(yAxis);

//     // Create and fill initial data series
//     const dataSeries1 = new XyDataSeries(wasmContext);
//     const dataSeries2 = new XyDataSeries(wasmContext);
//     const dataSeries3 = new XyDataSeries(wasmContext);
//     const dataSeries4 = new XyDataSeries(wasmContext);
//     for (let i = 0; i < this.POINTS_LOOP; i++) {
//       dataSeries1.append(i, NaN);
//       dataSeries2.append(i, NaN);
//       dataSeries3.append(i, NaN);
//       dataSeries4.append(i, NaN);
//     }

//     const effect = new GlowEffect(wasmContext);

//     sciChartSurface.renderableSeries.add(
//       new FastLineRenderableSeries(wasmContext, {
//         strokeThickness: this.STROKE_THICKNESS,
//         stroke: this.COLOR_GREEN,
//         dataSeries: dataSeries1,
//         effect,
//       })
//     );

//     sciChartSurface.renderableSeries.add(
//       new FastLineRenderableSeries(wasmContext, {
//         strokeThickness: this.STROKE_THICKNESS,
//         stroke: this.COLOR_YELLOW,
//         dataSeries: dataSeries2,
//         effect,
//       })
//     );

//     sciChartSurface.renderableSeries.add(
//       new FastLineRenderableSeries(wasmContext, {
//         strokeThickness: this.STROKE_THICKNESS,
//         stroke: this.COLOR_GREY,
//         dataSeries: dataSeries3,
//         effect,
//       })
//     );

//     sciChartSurface.renderableSeries.add(
//       new FastLineRenderableSeries(wasmContext, {
//         strokeThickness: this.STROKE_THICKNESS,
//         stroke: this.COLOR_BLUE,
//         dataSeries: dataSeries4,
//         effect,
//       })
//     );

//     // Display leading dot
//     const leadingDotDataSeries = new XyDataSeries(wasmContext);
//     sciChartSurface.renderableSeries.add(
//       new XyScatterRenderableSeries(wasmContext, {
//         pointMarker: new EllipsePointMarker(wasmContext, {
//           width: 5,
//           height: 5,
//           strokeThickness: 2,
//           fill: 'white',
//           stroke: 'white',
//         }),
//         dataSeries: leadingDotDataSeries,
//         effect,
//       })
//     );

//     const runUpdateDataOnTimeout = () => {
//       const {
//         xArr,
//         xPlusGapArr,
//         ecgHeartRateArr,
//         bloodPressureArr,
//         bloodVolumeArr,
//         bloodOxygenationArr,
//       } = this.getValuesFromData(this.currentPoint);
//       this.currentPoint += this.STEP;
//       if (leadingDotDataSeries.count() > 0) {
//         leadingDotDataSeries.removeRange(0, leadingDotDataSeries.count() - 1);
//       }
//       leadingDotDataSeries.append(
//         xArr[this.STEP - 1],
//         ecgHeartRateArr[this.STEP - 1]
//       );
//       leadingDotDataSeries.append(
//         xArr[this.STEP - 1],
//         bloodPressureArr[this.STEP - 1]
//       );
//       leadingDotDataSeries.append(
//         xArr[this.STEP - 1],
//         bloodVolumeArr[this.STEP - 1]
//       );
//       leadingDotDataSeries.append(
//         xArr[this.STEP - 1],
//         bloodOxygenationArr[this.STEP - 1]
//       );
//       for (let i = 0; i < this.STEP; i++) {
//         dataSeries1.update(xArr[i], ecgHeartRateArr[i]);
//         dataSeries1.update(xPlusGapArr[i], NaN);
//         dataSeries2.update(xArr[i], bloodPressureArr[i]);
//         dataSeries2.update(xPlusGapArr[i], NaN);
//         dataSeries3.update(xArr[i], bloodVolumeArr[i]);
//         dataSeries3.update(xPlusGapArr[i], NaN);
//         dataSeries4.update(xArr[i], bloodOxygenationArr[i]);
//         dataSeries4.update(xPlusGapArr[i], NaN);
//       }
//       // Update Info panel
//       if (this.currentPoint % 1000 === 0) {
//         const ecg = ecgHeartRateArr[this.STEP - 1];
//         this.infoEcg = Math.floor(ecg * 20);
//         const bloodPressure = bloodPressureArr[this.STEP - 1];
//         this.infoBloodPressure1 = (Math.floor(bloodPressure * 46));
//         this.infoBloodPressure2 = (Math.floor(bloodPressure * 31));
//         const bloodVolume = bloodVolumeArr[this.STEP - 1] + 3;
//         this.infoBloodVolume = (bloodVolume + 8.6);
//         const bloodOxygenation = bloodOxygenationArr[this.STEP - 1];
//         this.infoBloodOxygenation = (Math.floor(bloodOxygenation * 10 + 93));
//       }
//       this.timerId = setTimeout(runUpdateDataOnTimeout, this.TIMER_TIMEOUT_MS);
//     };

//     const handleStop = () => {
//       clearTimeout(this.timerId);
//       this.timerId = undefined;
//     };

//     const handleStart = () => {
//       if (this.timerId) {
//         handleStop();
//       }
//       runUpdateDataOnTimeout();
//     };

//     return {
//       sciChartSurface,
//       wasmContext,
//       controls: { handleStart, handleStop },
//     };
//   }
// }
