import { Card } from './Card';
import { IBasketCard } from '../../types';
import { ensureElement } from '../../utils/utils';

/** Карточка одной позиции в корзине. */
export class BasketCard extends Card<IBasketCard> {
  protected indexElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }

  /** Создаёт копию карточки с актуальными данными и обработчиком удаления. */
  renderItem(data: IBasketCard, onClick: () => void): HTMLElement {
    super.render(data);

    const item = this.container.cloneNode(true) as HTMLElement;
    const deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', item);

    deleteButton.addEventListener('click', onClick);

    return item;
  }
}
