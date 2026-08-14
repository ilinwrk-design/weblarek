import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ICard } from '../../types';
import { ensureElement } from '../../utils/utils';

/**
 * Общая часть всех представлений карточки товара.
 * Класс не хранит данные товара: значения сразу отображаются в DOM.
 */
export abstract class Card<T extends ICard = ICard> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>('.card__title', container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', container);
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
  }
}
