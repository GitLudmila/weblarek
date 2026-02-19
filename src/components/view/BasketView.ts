import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface IBasket {
    items: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasket> {
    private totalPriceBasket: HTMLElement;
    private btnBasket: HTMLButtonElement;
    private basketList: HTMLElement;

    constructor (protected events: IEvents, container: HTMLElement) {
        super(container);

        this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
        this.btnBasket = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this.totalPriceBasket = ensureElement<HTMLElement>('.basket__price', this.container);

        this.btnBasket.addEventListener('click', () => {
            this.events.emit('order:checkout');
        })
    }

    disableButton() {
        this.btnBasket.setAttribute('disabled', 'disabled');
    }

    enableButton() {
        this.btnBasket.removeAttribute('disabled');
    }

    get countElements(): number {
        return this.basketList.children.length;
    }

    set total(value: number) {
        this.totalPriceBasket.textContent = `${value} синапсов`;
    }
}