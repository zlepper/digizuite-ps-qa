import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { ChartData } from '../models';

@Component({
  selector: 'app-block-chart',
  templateUrl: './block-chart.component.html',
  styleUrls: ['./block-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockChartComponent {
  @Input()
  public data: ChartData[];

  public trackDatum(index: number, datum: ChartData) {
    return datum.name;
  }
}
