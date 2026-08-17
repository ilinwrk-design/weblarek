import type { IProduct } from '../../types';
import type { IEvents } from '../base/Events';

/** Модель для хранения товаров каталога. */
export class Products {
  private items: IProduct[] = [];
  private selectedItem: IProduct | null = null;
  private events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  /** Сохраняет товары каталога. */
  setItems(items: IProduct[]): void {
    this.items = [...items];
    this.events.emit('products:changed');
  }

  /** Возвращает товары каталога. */
  getItems(): IProduct[] {
    return [...this.items];
  }

  /** Ищет товар по id. */
  getItemById(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  /** Сохраняет выбранный товар. */
  setSelectedItem(item: IProduct): void {
    this.selectedItem = item;
    this.events.emit('product:selected');
  }

  /** Возвращает выбранный товар. */
  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }
}
