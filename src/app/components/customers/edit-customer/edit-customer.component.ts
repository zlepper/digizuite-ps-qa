import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CustomerDisplayService } from '../../../services/customer-display.service';
import { Observable, Subscription } from 'rxjs';
import { Customer } from '../../../store/customer/customer.interfaces';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  private subs = new Subscription();

  public form: FormGroup;

  public get environments() {
    return (this.form?.get('environments') as FormArray)?.controls;
  }

  constructor(private customerDisplayService: CustomerDisplayService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.customerDisplayService.init();

    this.loading$ = this.customerDisplayService.loading$;
    this.customer$ = this.customerDisplayService.customer$;

    this.subs.add(
      this.customer$.subscribe(customer => {
        const environments = (customer.environments ?? []).map(environment => {
          const products = (environment.product ?? []).map(product => {
            return this.fb.group({
              productId: [product.productId, Validators.required],
              version: [product.version, Validators.required],
            });
          });

          return this.fb.group({
            name: [environment.name, Validators.required],
            products: this.fb.array(products),
          });
        });

        this.form = this.fb.group({
          name: [customer.name, Validators.required],
          environments: this.fb.array(environments),
        });
      }),
    );
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  addNewEnvironment() {
    const envForm = this.fb.group({
      name: ['', Validators.required],
      products: this.fb.array([]),
    });

    (this.form.get('environments') as FormArray).push(envForm);
  }

  removeEnvironment(index: number) {
    (this.form.get('environments') as FormArray).removeAt(index);
  }

  getProducts(environmentIndex: number) {
    return (this.environments[environmentIndex].get('products') as FormArray).controls;
  }
}
