import { Card } from "./Card";
import { ensureElement } from "../../../utils/utils";
import { TCardCatalog } from "../../../types";
import { categoryMap, CDN_URL } from "../../../utils/constants";
import { IEvents } from "../../base/Events";

type CategoryKey = keyof typeof categoryMap;

export class CardCatalog extends Card<TCardCatalog> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  readonly titleText: string;
  readonly idElement: string;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.titleText = ensureElement<HTMLImageElement>('.card__title', this.container).textContent;
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.idElement = '';

    this.container.addEventListener('click', () => {
      this.events.emit('product:clicked', { cardIndex: this.idElement});
    });
  }

  set category(value: CategoryKey) {
    this.categoryElement.textContent = value;
    this.categoryElement.classList.add(categoryMap[value])
  }

  set image(value: string) {
    this.setImage(this.imageElement, CDN_URL + value, this.titleText);
  }  
}