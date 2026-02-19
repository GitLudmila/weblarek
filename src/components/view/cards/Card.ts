import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IProduct } from "../../../types";

type TCard = Pick<IProduct, 'title' | 'price'>;

export class Card<T> extends Component<T & TCard> {
  protected cardTitle: HTMLElement;
  protected cardPrice: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.cardTitle = ensureElement<HTMLElement>('.card__title', this.container);
    this.cardPrice = ensureElement<HTMLElement>('.card__price', this.container);
  }

  set title(value: string) {
    this.cardTitle.textContent = value;
  }

  set price(value: number | null) {
    this.cardPrice.textContent = value ? `${value} синапсов`: 'Бесценно';
  }
}