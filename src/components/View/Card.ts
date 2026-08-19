import { Component } from '../base/Component';
import { ICard } from '../../types';
import { ensureElement } from '../../utils/utils';

/**
 * Общая часть всех представлений карточки товара.
 * Класс не хранит данные товара: значения сразу отображаются в DOM.
 */
export abstract class Card<T extends ICard = ICard> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>('.card__title', container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', container);
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
  }
}
