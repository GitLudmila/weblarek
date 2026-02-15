import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";
import { IProduct } from "../../types";
import { categoryMap, CDN_URL } from "../../utils/constants";
import { IEvents } from "../base/Events";

type CategoryKey = keyof typeof categoryMap;

export class CardDetailed extends Card<IProduct> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected priceElement: HTMLElement;
  private inCart: boolean = false;
  protected buttonElement: HTMLButtonElement;

  readonly titleText: string;

  constructor(protected events: IEvents, container: HTMLElement, private idElement: string) {
    super(container);

    this.titleText = ensureElement<HTMLImageElement>('.card__title', this.container).textContent;
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.descriptionElement = ensureElement<HTMLImageElement>('.card__text', this.container);
    this.priceElement = ensureElement<HTMLImageElement>('.card__price', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.buttonElement.addEventListener('click', () => {
      if (this.inCart) {
        this.events.emit('product:remove', { id: this.idElement })
      } else {
        this.events.emit('product:add', { id: this.idElement });
      }
    })
  }

  set category(value: CategoryKey) {
    this.categoryElement.textContent = value;
    this.categoryElement.classList.add(categoryMap[value])
  }

  set image(value: string) {
    this.setImage(this.imageElement, CDN_URL + value, this.titleText);
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set inCartState(value: boolean) {
    this.inCart = value;

    if (this.buttonElement) {
      this.buttonElement.textContent = value ? 'Удалить из корзины': 'Купить';
    }
  }
}