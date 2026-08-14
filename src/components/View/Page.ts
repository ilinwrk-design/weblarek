import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IPage } from '../../types';
import { ensureElement } from '../../utils/utils';

/**
 * Представление основной страницы: каталог товаров и счётчик корзины.
 */
export class Page extends Component<IPage> {
  protected basketCounter: HTMLElement;
  protected catalog: HTMLElement;
  protected basketButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter', container);
    this.catalog = ensureElement<HTMLElement>('.gallery', container);
    this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);

    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  set counter(value: number) {
    this.basketCounter.textContent = String(value);
  }

  set gallery(items: HTMLElement[]) {
    this.catalog.replaceChildren(...items);
  }
}
