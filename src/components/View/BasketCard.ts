import { Card } from './Card';
import { IEvents } from '../base/Events';
import { IBasketCard } from '../../types';
import { ensureElement } from '../../utils/utils';

/** Карточка одной позиции в корзине. */
export class BasketCard extends Card<IBasketCard> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

    this.deleteButton.addEventListener('click', () => {
      const id = this.container.dataset.id;
      if (id) {
        this.events.emit('basket:item-remove', { id });
      }
    });
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
