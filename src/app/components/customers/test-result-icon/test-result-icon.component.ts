import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TestResult } from '../../../store/test/test.interfaces';

@Component({
  selector: 'app-test-result-icon',
  templateUrl: './test-result-icon.component.html',
  styleUrls: ['./test-result-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestResultIconComponent {
  @Input()
  public result: TestResult;

  public TestResult = TestResult;

  public get iconColor(): 'primary' | 'warn' | '' {
    switch (this.result) {
      default:
        return '';
      case TestResult.passed:
        return 'primary';
      case TestResult.failed:
        return 'warn';
    }
  }
}
