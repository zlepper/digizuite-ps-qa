import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product } from '../../../store/product/product.interfaces';
import { getAllProducts } from '../../../store/product/product.selectors';
import { MatDialog } from '@angular/material/dialog';
import { AddProductDialogComponent } from '../add-product-dialog/add-product-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent implements OnInit {
  public products$: Observable<Product[]>;

  constructor(private store: Store, private dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.products$ = this.store.pipe(select(getAllProducts));
  }

  public startAddProduct() {
    this.dialog
      .open(AddProductDialogComponent)
      .afterClosed()
      .subscribe(result => {
        console.log(result);
      });
  }
}
