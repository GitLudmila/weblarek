import { Card } from "./Card";
import { TCardBasket } from "../../../types";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";

export class CardBasket extends Card<TCardBasket> {
    private indexItemElement: HTMLElement;
    private btnDeleteElement: HTMLButtonElement;

    constructor(private events: IEvents, container: HTMLElement, private idElement?: string) {
        super(container);

        this.indexItemElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.btnDeleteElement = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this.btnDeleteElement.addEventListener('click', () => {
            this.events.emit('basket:delete', { id: this.idElement} );
        })

    }

    set index (value: number) {
        this.indexItemElement.textContent = String(value);
    }
}