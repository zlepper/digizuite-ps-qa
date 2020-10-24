import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AngularFirestore} from '@angular/fire/firestore';
import {BehaviorSubject} from 'rxjs';
import {Customer} from '../../../store/customer/customer.interfaces';

@Component({
  selector: 'app-add-new-customer-dialog',
  templateUrl: './add-new-customer-dialog.component.html',
  styleUrls: ['./add-new-customer-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNewCustomerDialogComponent implements OnInit {
  public form = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  public error$ = new BehaviorSubject<string>('');

  public loading = new BehaviorSubject<boolean>(false);

  constructor(private dialogRef: MatDialogRef<AddNewCustomerDialogComponent>, private firestore: AngularFirestore) {}

  ngOnInit(): void {}

  add(): void {
    if (this.form.invalid) {
      return;
    }

    const data: Customer = this.form.value;

    const customers = this.firestore.collection<Customer>('customers');

    this.loading.next(true);

    customers
      .add(data)
      .then(doc => {
        console.log('created document');
        this.dialogRef.close(doc);
      })
      .catch(err => {
        console.error(err);
        this.error$.next(err);
      })
      .finally(() => {
        this.loading.next(false);
      });
  }
}
