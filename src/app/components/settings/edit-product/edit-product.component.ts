import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductDisplayService } from '../../../services/product-display.service';
import { Product, ProductUseCase } from '../../../store/product/product.interfaces';
import { BehaviorSubject, combineLatest, Observable, of, Subscription } from 'rxjs';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppFirestoreService } from '../../../services/app-firestore.service';
import { select, Store } from '@ngrx/store';
import { updatedUsedProductVersions } from '../../../store/customer/customer.actions';
import { getAllCustomers } from '../../../store/customer/customer.selectors';
import { map, shareReplay, startWith, switchMap, take } from 'rxjs/operators';
import { generateId, valueUpdates, Version } from '../../../helpers';

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
  public productForm: FormGroup;

  public productUseCasesForm: FormGroup;

  public loading = new BehaviorSubject<boolean>(false);
  public error = new BehaviorSubject<string | null>(null);
  public availableVersions$: Observable<Version[]>;
  public subs = new Subscription();
  public savingUseCases = new BehaviorSubject<boolean>(false);
  private usedVersions$: Observable<Set<string>>;
  private useCases$: Observable<ProductUseCase[]>;

  public toRemove = new Set<string>();

  constructor(
    private productDisplayService: ProductDisplayService,
    private fb: FormBuilder,
    private firestore: AppFirestoreService,
    private store: Store,
    private cd: ChangeDetectorRef,
  ) {}

  public get versionControls() {
    return (this.productForm.get('versions') as FormArray).controls;
  }

  public get useCaseControls() {
    return (this.productUseCasesForm.get('useCases') as FormArray).controls;
  }

  ngOnInit(): void {
    this.productDisplayService.init();

    this.product$ = this.productDisplayService.product$;

    this.useCases$ = this.productDisplayService.useCases$;

    this.subs.add(
      this.product$.subscribe(product => {
        const versions = (product.versions ?? []).map(version => {
          return this.fb.group({
            originalVersion: [version.version],
            version: [version.version, Validators.compose([Validators.required, Validators.pattern(/(\d+)\.(\d+)\.(\d+)/)])],
          });
        });

        this.productForm = this.fb.group({
          id: product.id,
          name: [product.name, Validators.required],
          versions: this.fb.array(versions),
        });

        this.cd.markForCheck();
      }),
    );

    this.subs.add(
      this.useCases$.subscribe(cases => {
        console.log(cases);
        this.productUseCasesForm = this.fb.group({
          useCases: this.fb.array(
            cases.map(c =>
              this.fb.group({
                id: [c.id],
                productId: [c.productId],
                name: [c.name, Validators.required],
                details: [c.details],
                fromVersion: [c.fromVersion],
                toVersion: [c.toVersion],
              }),
            ),
          ),
        });
        this.cd.markForCheck();
      }),
    );

    this.availableVersions$ = this.product$.pipe(
      map(product => product.versions.map(v => v.version)),
      map(versions => versions.map(v => new Version(v)).sort((a, b) => a.compare(b))),
      shareReplay({
        refCount: true,
      }),
    );

    const customers$ = this.store.pipe(select(getAllCustomers));

    this.usedVersions$ = combineLatest([this.product$, customers$]).pipe(
      map(([product, customers]) => {
        const usedVersions = new Set<string>();

        for (const customer of customers) {
          for (const environment of customer.environments ?? []) {
            for (const customerProduct of environment.products ?? []) {
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
      version: ['', Validators.compose([Validators.required, Validators.pattern(/(\d+)\.(\d+)\.(\d+)/)])],
    });

    const versions = this.productForm.get('versions') as FormArray;
    versions.push(version);
    versions.markAsDirty();
  }

  public save() {
    const product: EditedProduct = this.productForm.value;

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
    const versions = this.productForm.get('versions') as FormArray;
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

  addUseCase() {
    this.product$.pipe(take(1)).subscribe(product => {
      const uc = this.fb.group({
        id: [generateId()],
        productId: [product.id],
        name: ['', Validators.required],
        details: [''],
        fromVersion: [null],
        toVersion: [null],
      });

      const useCases = this.productUseCasesForm.get('useCases') as FormArray;
      useCases.push(uc);
      useCases.markAsDirty();
    });
  }

  public removeUseCase(index: number) {
    const useCases = this.productUseCasesForm.get('useCases') as FormArray;
    const useCase = useCases.get([index])!;

    useCases.markAsDirty();

    const id = useCase.value.id;

    this.toRemove.add(id);
  }

  public reAddUseCase(id: string) {
    this.toRemove.delete(id);
  }

  public getLowerVersions(useCaseIndex: number): Observable<Version[]> {
    const value$ = valueUpdates<string>(this.productUseCasesForm.get(['useCases', useCaseIndex, 'toVersion'])!);

    return combineLatest([value$, this.availableVersions$]).pipe(
      map(([maxVersion, availableVersions]) => {
        if (!maxVersion) {
          return availableVersions;
        }

        const selected = new Version(maxVersion);

        return availableVersions.filter(v => v.compare(selected) <= 0);
      }),
    );
  }

  public getUpperVersions(useCaseIndex: number): Observable<Version[]> {
    const value$ = valueUpdates<string>(this.productUseCasesForm.get(['useCases', useCaseIndex, 'fromVersion'])!);

    return combineLatest([value$, this.availableVersions$]).pipe(
      map(([minVersion, availableVersions]) => {
        if (!minVersion) {
          return availableVersions;
        }

        const selected = new Version(minVersion);

        return availableVersions.filter(v => v.compare(selected) >= 0);
      }),
    );
  }

  async saveProductUseCases() {
    const useCaseControls = this.productUseCasesForm.get('useCases') as FormArray;

    const promises = [];
    for (const control of useCaseControls.controls) {
      if (control.dirty) {
        const useCase: ProductUseCase = control.value;

        const p = this.firestore.productUseCaseCollection.doc(useCase.id).set(useCase);
        promises.push(p);
      }
    }

    for (const id of this.toRemove) {
      const p = this.firestore.productUseCaseCollection.doc(id).delete();
      promises.push(p);
    }

    try {
      this.savingUseCases.next(true);
      await Promise.all(promises);
      this.toRemove.clear();
    } catch (e) {
      console.error(e);
    } finally {
      this.savingUseCases.next(false);
    }
  }
}
