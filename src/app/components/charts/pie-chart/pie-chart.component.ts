import { Component, OnInit, ChangeDetectionStrategy, Input, HostBinding } from '@angular/core';
import { ChartData } from '../models';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PieChartComponent implements OnInit {
  @Input()
  public data: ChartData[];

  @Input()
  public size = 200;

  @HostBinding('style.height.px')
  public get height() {
    return this.size;
  }

  @HostBinding('style.width.px')
  public get width() {
    return this.size;
  }

  public get pieChartData() {
    return this.data.map(d => d.count);
  }

  public get pieChartLabels() {
    return this.data.map(d => d.name);
  }

  public get pieChartColors() {
    return [
      {
        backgroundColor: this.data.map(d => d.color),
      },
    ];
  }

  constructor() {}

  ngOnInit(): void {}
}
