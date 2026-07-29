import type { IProduct } from '../../types';

/**
 * Модель корзины.
 * Хранит выбранные товары и предоставляет операции для работы с ними.
 */
export class Basket {
  private items: IProduct[] = [];

  /** Возвращает копию массива товаров корзины. */
  getItems(): IProduct[] {
    return [...this.items];
  }

  /**
   * Добавляет товар в корзину.
   * Товар без цены и товар, который уже находится в корзине, не добавляются.
   */
  addItem(item: IProduct): void {
    if (item.price === null || this.hasItem(item.id)) {
      return;
    }

    this.items.push(item);
  }

  /** Удаляет переданный товар из корзины. */
  removeItem(item: IProduct): void {
    this.items = this.items.filter((basketItem) => basketItem.id !== item.id);
  }

  /** Удаляет все товары из корзины. */
  clear(): void {
    this.items = [];
  }

  /** Возвращает общую стоимость товаров в корзине. */
  getTotal(): number {
    return this.items.reduce(
      (total, item) => total + (item.price ?? 0),
      0
    );
  }

  /** Возвращает количество товаров в корзине. */
  getCount(): number {
    return this.items.length;
  }

  /** Проверяет наличие товара в корзине по его идентификатору. */
  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
