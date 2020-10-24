import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CustomerDisplayService } from '../../../services/customer-display.service';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { Customer } from '../../../store/customer/customer.interfaces';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../../store/product/product.interfaces';
import { select, Store } from '@ngrx/store';
import { getAllProducts } from '../../../store/product/product.selectors';
import { map, startWith } from 'rxjs/operators';
import { AppFirestoreService } from '../../../services/app-firestore.service';
import { generateId } from '../../../helpers';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CustomerDisplayService],
})
export class EditCustomerComponent implements OnInit, OnDestroy {
  public loading$: Observable<boolean>;
  public customer$: Observable<Customer>;

  public allProducts$: Observable<Product[]>;
  public form: FormGroup;
  public saving$ = new BehaviorSubject<boolean>(false);
  public error = new BehaviorSubject<string | null>(null);
  private subs = new Subscription();

  constructor(
    private customerDisplayService: CustomerDisplayService,
    private fb: FormBuilder,
    private store: Store,
    private firestore: AppFirestoreService,
  ) {
  }

  public get environments() {
    return (this.form?.get('environments') as FormArray)?.controls;
  }

  ngOnInit(): void {
    this.customerDisplayService.init();

    this.loading$ = this.customerDisplayService.loading$;
    this.customer$ = this.customerDisplayService.customer$;

    this.subs.add(
      this.customer$.subscribe(customer => {
        const environments = (customer.environments ?? []).map(environment => {
          console.log(environment.products);
          const products = (environment.products ?? []).map(product => {
            return this.fb.group({
              productId: [product.productId, Validators.required],
              version: [product.version, Validators.required],
            });
          });

          return this.fb.group({
            name: [environment.name, Validators.required],
            id: [environment.id],
            products: this.fb.array(products),
          });
        });

        this.form = this.fb.group({
          id: customer.id,
          name: [customer.name, Validators.required],
          environments: this.fb.array(environments),
        });
      }),
    );

    this.allProducts$ = this.store.pipe(select(getAllProducts));
  }

  public getProductVersions(environmentIndex: number, productIndex: number): Observable<string[]> {
    const productForm = this.form.get(['environments', environmentIndex, 'products', productIndex])!;

    const valueUpdates: Observable<{ productId: string | null }> = productForm.valueChanges.pipe(
      startWith(productForm.value as { productId: string | null }),
    );

    return combineLatest([valueUpdates, this.allProducts$]).pipe(
      map(([selectedProduct, products]) => {
        const product = products.find(p => p.id === selectedProduct.productId);
        if (!product) {
          return [];
        }

        return product.versions.map(v => v.version);
      }),
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  addNewEnvironment() {
    const envForm = this.fb.group({
      name: ['', Validators.required],
      id: [generateId()],
      products: this.fb.array([]),
    });

    const environments = this.form.get('environments') as FormArray;
    environments.push(envForm);
    environments.markAsDirty();
  }

  removeEnvironment(index: number) {
    (this.form.get('environments') as FormArray).removeAt(index);
  }

  getProducts(environmentIndex: number) {
    return (this.environments[environmentIndex].get('products') as FormArray).controls;
  }

  addProduct(environmentIndex: number) {
    const products = this.form.get(['environments', environmentIndex, 'products']) as FormArray;

    const product = this.fb.group({
      productId: [null, Validators.required],
      version: ['', Validators.required],
    });

    products.push(product);
    products.markAsDirty();
  }

  removeProduct(environmentIndex: number, productIndex: number) {
    const products = this.form.get(['environments', environmentIndex, 'products']) as FormArray;
    products.removeAt(productIndex);
    products.markAsDirty();
  }

  public save() {
    const customer: Customer = this.form.value;

    console.log({ customer });

    this.saving$.next(true);

    this.firestore.customerCollection
      .doc(customer.id)
      .set(customer)
      .then(() => {
        console.log('saved');
      })
      .catch(err => {
        console.error(err);
        this.error.next(err);
      })
      .finally(() => {
        this.saving$.next(false);
      });
  }
}
