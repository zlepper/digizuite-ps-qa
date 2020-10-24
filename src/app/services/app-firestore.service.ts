import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Product } from '../store/product/product.interfaces';
import { Customer } from '../store/customer/customer.interfaces';

@Injectable({
  providedIn: 'root',
})
export class AppFirestoreService {

  public readonly productCollection: AngularFirestoreCollection<Product>;
  public readonly customerCollection: AngularFirestoreCollection<Customer>;

  constructor(private firestore: AngularFirestore) {
    this.productCollection = this.firestore.collection('products');
    this.customerCollection = this.firestore.collection('customers');
  }
}
