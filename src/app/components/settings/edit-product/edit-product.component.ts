import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ProductDisplayService } from '../../../services/product-display.service';
import { Product } from '../../../store/product/product.interfaces';
import { BehaviorSubject, combineLatest, Observable, of, Subscription } from 'rxjs';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppFirestoreService } from '../../../services/app-firestore.service';
import { select, Store } from '@ngrx/store';
import { updatedUsedProductVersions } from '../../../store/customer/customer.actions';
import { getAllCustomers } from '../../../store/customer/customer.selectors';
import { map, shareReplay, startWith, switchMap } from 'rxjs/operators';

interface EditedProduct {
  id: string;
  name: string;
  versions: {
    originalVersion: string | null;
    version: string;
  }[];
}

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProductDisplayService],
})
export class EditProductComponent implements OnInit {
  public product$: Observable<Product>;
  public form: FormGroup;

  public loading = new BehaviorSubject<boolean>(false);
  public error = new BehaviorSubject<string | null>(null);
  private usedVersions$: Observable<Set<string>>;

  public get versions() {
    return (this.form?.get('versions') as FormArray).controls;
  }

  constructor(
    private productDisplayService: ProductDisplayService,
    private fb: FormBuilder,
    private firestore: AppFirestoreService,
    private store: Store,
  ) {}

  public subs = new Subscription();

  ngOnInit(): void {
    this.productDisplayService.init();

    this.product$ = this.productDisplayService.product$;

    this.subs.add(
      this.product$.subscribe(product => {
        const versions = (product.versions ?? []).map(version => {
          return this.fb.group({
            originalVersion: [version.version],
            version: [version.version, Validators.required],
          });
        });

        this.form = this.fb.group({
          id: product.id,
          name: [product.name, Validators.required],
          versions: this.fb.array(versions),
        });
      }),
    );

    const customers$ = this.store.pipe(select(getAllCustomers));

    this.usedVersions$ = combineLatest([this.product$, customers$]).pipe(
      map(([product, customers]) => {
        const usedVersions = new Set<string>();

        for (const customer of customers) {
          for (const environment of customer.environments ?? []) {
            for (const customerProduct of environment.product ?? []) {
              if (customerProduct.productId === product.id) {
                usedVersions.add(customerProduct.version);
              }
            }
          }
        }

        return usedVersions;
      }),
      shareReplay({
        refCount: true,
      }),
    );
  }

  public isUsedVersion(version: string): Observable<boolean> {
    return this.usedVersions$.pipe(map(versions => versions.has(version)));
  }

  public addNewVersion() {
    const version = this.fb.group({
      originalVersion: [null],
      version: ['', Validators.required],
    });

    const versions = this.form.get('versions') as FormArray;
    versions.push(version);
    versions.markAsDirty();
  }

  public save() {
    const product: EditedProduct = this.form.value;

    const changedVersions = product.versions
      .filter(v => v.originalVersion !== v.version && v.originalVersion)
      .map(v => ({
        from: v.originalVersion!,
        to: v.version,
      }));

    const versions = product.versions.map(v => ({ version: v.version }));

    const updatedProduct: Product = {
      id: product.id,
      name: product.name,
      versions,
    };

    console.log(updatedProduct);

    this.loading.next(true);

    this.firestore.productCollection
      .doc(product.id)
      .set(updatedProduct)
      .then(() => {
        console.log('saved');
        if (changedVersions.length) {
          this.store.dispatch(
            updatedUsedProductVersions({
              productId: product.id,
              changedVersions,
            }),
          );
        }
      })
      .catch(err => {
        console.error(err);
        this.error.next(err);
      })
      .finally(() => {
        this.loading.next(false);
      });
  }

  removeVersion(versionIndex: number) {
    const versions = this.form.get('versions') as FormArray;
    versions.removeAt(versionIndex);
    versions.markAsDirty();
  }

  canRemoveVersion(versionControl: AbstractControl) {
    const originalVersionControl = versionControl.get('originalVersion');
    return originalVersionControl!.valueChanges.pipe(
      startWith(originalVersionControl!.value as string),
      switchMap(originalVersion => {
        if (!originalVersion) {
          return of(true);
        }

        return this.isUsedVersion(originalVersion).pipe(map(isUsed => !isUsed));
      }),
    );
  }
}
