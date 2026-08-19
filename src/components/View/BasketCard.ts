import { Card } from './Card';
import { IBasketCard, ICardActions } from '../../types';
import { ensureElement } from '../../utils/utils';

/** Карточка одной позиции в корзине. */
export class BasketCard extends Card<IBasketCard> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions: ICardActions) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

    this.deleteButton.addEventListener('click', actions.onClick);
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
