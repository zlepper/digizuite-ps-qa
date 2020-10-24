import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Product } from '../../../../store/product/product.interfaces';
import { Store } from '@ngrx/store';
import { AppFirestoreService } from '../../../../services/app-firestore.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent implements OnInit {
  @Input()
  public product: Product;

  public deleting = new BehaviorSubject<boolean>(false);

  constructor(private firestore: AppFirestoreService) {}

  ngOnInit(): void {}

  deleteProduct() {
    this.deleting.next(true);

    this.firestore.productCollection
      .doc(this.product.id)
      .delete()
      .then(() => {
        console.log('product deleted');
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        this.deleting.next(false);
      });
  }
}
