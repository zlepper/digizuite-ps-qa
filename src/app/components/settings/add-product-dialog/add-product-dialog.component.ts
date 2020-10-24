import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Product } from '../../../store/product/product.interfaces';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-add-product-dialog',
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['./add-product-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProductDialogComponent implements OnInit {
  public form: FormGroup;

  public loading = new BehaviorSubject<boolean>(false);
  public error = new BehaviorSubject<string | null>(null);

  constructor(private dialogRef: MatDialogRef<AddProductDialogComponent>, private fb: FormBuilder, private firestore: AngularFirestore) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
    });
  }

  addProduct() {
    const product: Product = this.form.value;

    const productCollection = this.firestore.collection<Product>('products');

    productCollection
      .add(product)
      .then(doc => {
        this.dialogRef.close(doc);
      })
      .catch(err => {
        console.error(err);
        this.error.next(err);
      })
      .finally(() => {
        this.loading.next(false);
      });
  }
}
