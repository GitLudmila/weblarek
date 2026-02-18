import { Card } from "./Card";
import { ensureElement } from "../../../utils/utils";
import { ICardActions, TCardCatalog } from "../../../types";
import { categoryMap, CDN_URL } from "../../../utils/constants";

type CategoryKey = keyof typeof categoryMap;

export class CardCatalog extends Card<TCardCatalog> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  readonly titleText: string;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.titleText = ensureElement<HTMLImageElement>('.card__title', this.container).textContent;
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    
    if(actions?.onClick) {
      this.container.addEventListener('click', actions.onClick);
    }
  }

  set category(value: CategoryKey) {
    this.categoryElement.textContent = value;
    this.categoryElement.classList.add(categoryMap[value])
  }

  set image(value: string) {
    this.setImage(this.imageElement, CDN_URL + value, this.titleText);
  }  
}