import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected contentElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(protected events: IEvents, protected container: HTMLElement) {
    super(container);
    this.contentElement = ensureElement<HTMLElement>(".modal__content", this.container);
    this.closeButton = ensureElement<HTMLButtonElement>(".modal__close", this.container);

    this.closeButton.addEventListener("click", () => {
      this.close();
    });
    this.container.addEventListener("click", () => {
      this.close();
    });
    this.contentElement.addEventListener("click", (event) =>
      event.stopPropagation(),
    );
  }

  set content(data: HTMLElement) {
    this.contentElement.replaceChildren(data);
  }
  
  open() {
    this.container.classList.add('modal_active');
  }

  close() {
    this.container.classList.remove('modal_active');
  }
}