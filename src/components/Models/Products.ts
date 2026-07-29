import type { IProduct } from '../../types';

/**
 * Модель каталога товаров.
 * Хранит полученный каталог и товар, выбранный для подробного просмотра.
 */
export class Products {
  private items: IProduct[] = [];
  private selectedItem: IProduct | null = null;

  /** Сохраняет новый массив товаров в модели. */
  setItems(items: IProduct[]): void {
    this.items = [...items];
  }

  /** Возвращает копию массива товаров каталога. */
  getItems(): IProduct[] {
    return [...this.items];
  }

  /** Возвращает товар по идентификатору или undefined, если товар не найден. */
  getItemById(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  /** Сохраняет товар, выбранный для подробного отображения. */
  setSelectedItem(item: IProduct): void {
    this.selectedItem = item;
  }

  /** Возвращает выбранный товар или null, если товар ещё не выбран. */
  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }
}
