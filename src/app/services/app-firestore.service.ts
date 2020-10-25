import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Product, ProductUseCase } from '../store/product/product.interfaces';
import { Customer } from '../store/customer/customer.interfaces';
import { Test } from '../store/test/test.interfaces';

@Injectable({
  providedIn: 'root',
})
export class AppFirestoreService {

  public readonly productCollection: AngularFirestoreCollection<Product>;
  public readonly customerCollection: AngularFirestoreCollection<Customer>;
  public readonly productUseCaseCollection: AngularFirestoreCollection<ProductUseCase>;
  public readonly testCollection: AngularFirestoreCollection<Test>;

  constructor(private firestore: AngularFirestore) {
    this.productCollection = this.firestore.collection('products');
    this.customerCollection = this.firestore.collection('customers');
    this.productUseCaseCollection = this.firestore.collection('productUseCases');
    this.testCollection = this.firestore.collection('test');
  }
}
