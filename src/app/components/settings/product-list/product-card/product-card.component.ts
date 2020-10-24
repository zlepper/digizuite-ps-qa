import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Product } from '../../../../store/product/product.interfaces';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent implements OnInit {
  @Input()
  public product: Product;

  constructor(private store: Store) {
  }

  ngOnInit(): void {
  }

}
