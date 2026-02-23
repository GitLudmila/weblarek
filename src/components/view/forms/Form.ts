import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

export abstract class Form<T> extends Component<T> {
  protected errorForm: HTMLElement;
  protected btnSubmit: HTMLButtonElement;

  constructor (protected events: IEvents, container: HTMLElement) {
    super(container);
        
    this.errorForm = ensureElement<HTMLElement>('.form__errors', this.container);
    this.btnSubmit = ensureElement<HTMLButtonElement>('button[type = "submit"]', this.container);
  }

  set error(value: string) {
    this.errorForm.textContent = value;
  }

  inputHandler = (evt: Event)=> {
    const target = evt.target;
    if (target instanceof HTMLInputElement) {
      this.events.emit('form:change', {[target.name]: (target.value)});
    }
  }

  disableNextButton() {
    this.btnSubmit.setAttribute('disabled', 'disabled');
  }

  enableNextButton() {
    this.btnSubmit.removeAttribute('disabled');
  }
}