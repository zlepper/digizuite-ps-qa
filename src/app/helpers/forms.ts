import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';

export function valueUpdates<T>(control: AbstractControl): Observable<T> {
  return control.valueChanges.pipe(startWith(control.value as T));
}
