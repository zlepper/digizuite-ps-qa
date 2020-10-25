import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TestResult } from '../../../store/test/test.interfaces';

const checkmarkPath = 'M4 12 L10 18 L22 4';
const waitingPath = 'M4 12 L12 12 L20 12';

@Component({
  selector: 'app-test-result-icon',
  templateUrl: './test-result-icon.component.html',
  styleUrls: ['./test-result-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestResultIconComponent {
  @Input()
  public result: TestResult;

  public get checkmarkPath(): string {
    switch (this.result) {
      default:
        return waitingPath;
      case TestResult.passed:
        return checkmarkPath;
      case TestResult.failed:
        return 'M4 20 L12 12 L4 4';
    }
  }


  public get secondaryPath(): string {
    switch (this.result) {
      default:
        return waitingPath;
      case TestResult.passed:
        return checkmarkPath;
      case TestResult.failed:
        return 'M20 20 L12 12 L20 4';
    }
  }

  public get svgColor(): string {
    switch (this.result) {
      default:
        return 'rgba(0, 0, 0, 0.55)';
      case TestResult.passed:
        return 'limegreen';
      case TestResult.failed:
        return 'red';
    }
  }
}
