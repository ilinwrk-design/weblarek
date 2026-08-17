import type { IProduct } from '../../types';
import type { IEvents } from '../base/Events';

/** Модель для хранения товаров в корзине. */
export class Basket {
  private items: IProduct[] = [];
  private events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  /** Возвращает товары корзины. */
  getItems(): IProduct[] {
    return [...this.items];
  }

  /** Добавляет товар в корзину. */
  addItem(item: IProduct): void {
    if (item.price === null || this.hasItem(item.id)) {
      return;
    }

    this.items.push(item);
    this.events.emit('basket:changed');
  }

  /** Удаляет товар из корзины. */
  removeItem(item: IProduct): void {
    if (!this.hasItem(item.id)) {
      return;
    }

    this.items = this.items.filter((basketItem) => basketItem.id !== item.id);
    this.events.emit('basket:changed');
  }

  /** Очищает корзину. */
  clear(): void {
    if (this.items.length === 0) {
      return;
    }

    this.items = [];
    this.events.emit('basket:changed');
  }

  /** Считает общую стоимость товаров. */
  getTotal(): number {
    return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
  }

  /** Возвращает количество товаров. */
  getCount(): number {
    return this.items.length;
  }

  /** Проверяет, есть ли товар в корзине. */
  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
