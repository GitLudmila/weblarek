import { Form } from "./Form.ts";
import {IEvents} from "../../base/Events.ts";
import { BuyerValidationErrors } from "../../../types/index.ts";
import {ensureElement} from "../../../utils/utils.ts";

type TContacts = {errors: BuyerValidationErrors;} & { phone: string, email: string };

export class Contacts extends Form<TContacts> {
  private phoneElement: HTMLInputElement;
  private emailElement: HTMLInputElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);

    this.phoneElement = ensureElement<HTMLInputElement>('.form__input[name = "phone"]', this.container);
    this.emailElement = ensureElement<HTMLInputElement>('.form__input[name = "email"', this.container);

    this.container.addEventListener('input', this.inputHandler);

    this.btnSubmit.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.events.emit('order:pay');
    });
  }

  set phone(value: string) {
    this.phoneElement.value = value;
  }

  set email(value: string) {
    this.emailElement.value = value;
  }
}