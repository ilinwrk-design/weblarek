import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IModal } from '../../types';
import { ensureElement } from '../../utils/utils';

/** Универсальное модальное окно без дочерних View-классов. */
export class Modal extends Component<IModal> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
    this.contentElement = ensureElement<HTMLElement>('.modal__content', container);

    this.closeButton.addEventListener('click', () => {
      this.events.emit('modal:close');
    });

    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) {
        this.events.emit('modal:close');
      }
    });
  }

  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }

  open(): void {
    this.container.classList.add('modal_active');
  }

  close(): void {
    this.container.classList.remove('modal_active');
    this.contentElement.replaceChildren();
  }

  render(data: IModal): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}
