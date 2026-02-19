import { Card } from "./Card";
import { IProduct, ICardActions } from "../../../types";
import { ensureElement } from "../../../utils/utils";

type TCardBasket = Pick<IProduct, 'title' | 'price'> & {index: number};

export class CardBasket extends Card<TCardBasket> {
    private indexItemElement: HTMLElement;
    private btnDeleteElement: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.indexItemElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.btnDeleteElement = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        if (actions?.onClick) {
            this.btnDeleteElement.addEventListener('click', actions.onClick);
        }
    }

    set index (value: number) {
        this.indexItemElement.textContent = String(value);
    }
}