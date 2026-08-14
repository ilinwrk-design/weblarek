import { Card } from './Card';
import { IEvents } from '../base/Events';
import { ICatalogCard } from '../../types';
import { CDN_URL, categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

/** Карточка товара в каталоге. */
export class CatalogCard extends Card<ICatalogCard> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);

    this.container.addEventListener('click', () => {
      const id = this.container.dataset.id;
      if (id) {
        this.events.emit('card:select', { id });
      }
    });
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    this.categoryElement.classList.remove(...Object.values(categoryMap));
    const modifier = categoryMap[value as keyof typeof categoryMap] ?? categoryMap['другое'];
    this.categoryElement.classList.add(modifier);
  }

  set image(value: string) {
    this.setImage(this.imageElement, `${CDN_URL}${value}`, this.titleElement.textContent ?? '');
  }
}
