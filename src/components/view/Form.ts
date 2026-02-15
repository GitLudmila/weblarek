import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface IForm {
  error: string;
}

export class Form extends Component<IForm> {
  private errorForm: HTMLElement;
  private btnSubmit: HTMLButtonElement;

  constructor (private events: IEvents, container: HTMLElement) {
    super(container);
        
    this.errorForm = ensureElement<HTMLElement>('.form__errors', this.container);
    this.btnSubmit = ensureElement<HTMLButtonElement>('.button', this.container);

    this.btnSubmit.addEventListener('click', () => {
      this.events.emit('order:submit');
    })
  }

  set error(value: string) {
    this.errorForm.textContent = value;
  }
}