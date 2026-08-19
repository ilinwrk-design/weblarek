import { Card } from './Card';
import { ICatalogCard, ICardActions } from '../../types';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

/** Карточка товара в каталоге. */
export class CatalogCard extends Card<ICatalogCard> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement, actions: ICardActions) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);

    this.container.addEventListener('click', actions.onClick);
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    this.categoryElement.classList.remove(...Object.values(categoryMap));
    const modifier = categoryMap[value as keyof typeof categoryMap] ?? categoryMap['другое'];
    this.categoryElement.classList.add(modifier);
  }

  set image(value: string) {
    this.setImage(this.imageElement, value);
  }

  set alt(value: string) {
    this.imageElement.alt = value;
  }
}
