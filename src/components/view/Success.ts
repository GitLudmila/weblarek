import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface ISuccess {
  total: number;
}

export class Success extends Component<ISuccess> {
  private totalPrice: HTMLElement;
  private successButton: HTMLButtonElement;

  constructor (private events: IEvents, container: HTMLElement) {
    super(container);

    this.totalPrice = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.successButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    this.successButton.addEventListener('click', () => {
      this.events.emit('modal:close');
    })
  }

  set total(value: number) {
    this.totalPrice.textContent = `Списано ${value} синапсов`;
  }
}