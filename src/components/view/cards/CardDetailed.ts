import { Card } from "./Card";
import { ensureElement } from "../../../utils/utils";
import { IProduct } from "../../../types";
import { IEvents } from "../../base/Events";
import { categoryMap, CDN_URL } from "../../../utils/constants";

type CategoryKey = keyof typeof categoryMap;

export class CardDetailed extends Card<IProduct> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  readonly titleText: string;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.titleText = ensureElement<HTMLImageElement>('.card__title', this.container).textContent;
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.descriptionElement = ensureElement<HTMLImageElement>('.card__text', this.container);
    this.priceElement = ensureElement<HTMLImageElement>('.card__price', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.buttonElement.addEventListener('click', () => {
      this.events.emit('preview:toggle');
    })
  }

  disableButton() {
    this.buttonElement.setAttribute('disabled', 'disabled');
  }

  ableButton() {
    this.buttonElement.removeAttribute('disabled');
  }

  set buttonText(value: string) {
    this.buttonElement.textContent = value;
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
}