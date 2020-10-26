import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { ChartData } from '../models';

@Component({
  selector: 'app-number-chart',
  templateUrl: './number-chart.component.html',
  styleUrls: ['./number-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumberChartComponent {

  @Input()
  public data: ChartData[];

  public trackDatum(index: number, datum: ChartData) {
    return datum.name;
  }
}
