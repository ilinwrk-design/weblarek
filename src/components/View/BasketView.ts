import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IBasketView } from '../../types';
import { ensureElement } from '../../utils/utils';

/** Представление корзины. */
export class BasketView extends Component<IBasketView> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected orderButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.listElement = ensureElement<HTMLElement>('.basket__list', container);
    this.totalElement = ensureElement<HTMLElement>('.basket__price', container);
    this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', container);

    this.orderButton.addEventListener('click', () => {
      this.events.emit('order:open');
    });
  }

  set items(items: HTMLElement[]) {
    this.listElement.replaceChildren(...items);
  }

  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }

  set valid(value: boolean) {
    this.orderButton.disabled = !value;
  }
}
