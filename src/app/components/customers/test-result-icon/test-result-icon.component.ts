import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TestResult } from '../../../store/test/test.interfaces';

@Component({
  selector: 'app-test-result-icon',
  templateUrl: './test-result-icon.component.html',
  styleUrls: ['./test-result-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestResultIconComponent {

  @Input()
  public result: TestResult;

  public TestResult = TestResult;

}
