import { Form } from "./Form.ts";
import { ensureElement } from "../../../utils/utils.ts";
import { IEvents } from "../../base/Events.ts";
import { paymentMethods } from "../../../utils/constants.ts";
import { BuyerValidationErrors } from "../../../types/index.ts";

type TOrder = {errors: BuyerValidationErrors;} & { buttonActive: string, address: string };

export class Order extends Form<TOrder> {
  private paymentButtonsContainer: HTMLElement;
  private addressElement: HTMLInputElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);

    this.paymentButtonsContainer = ensureElement<HTMLElement>('.order__buttons', this.container);
    this.addressElement = ensureElement<HTMLInputElement>('.form__input[name = "address"]', this.container);

    this.btnSubmit.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.events.emit('order:proceed');
    });

    this.container.addEventListener('input', this.inputHandler);

    this.paymentButtonsContainer.addEventListener('click', (evt) => {
      const selectedButton = (evt.target as HTMLElement).closest('button');
      if (!selectedButton) return;
      
      this.events.emit('form:change', {payment: paymentMethods[selectedButton.name]});
    })
  }

  set buttonActive(paymentType: string) {
    const buttonName = Object.keys(paymentMethods).find(key => paymentMethods[key] === paymentType);
        
    Array.from(this.paymentButtonsContainer.children).forEach(button => {
      button.classList.remove('button_alt-active');
      if ((button as HTMLButtonElement).name === buttonName) {
        button.classList.add('button_alt-active');
      }
    });
  }

  set address(value: string) {
    this.addressElement.value = value;
  }
}