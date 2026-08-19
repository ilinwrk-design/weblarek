import type { TBuyerData, TBuyerErrors } from '../../types';
import type { IEvents } from '../base/Events';

const EMPTY_BUYER_DATA: TBuyerData = {
  payment: '',
  email: '',
  phone: '',
  address: '',
};

/** Модель для хранения данных покупателя. */
export class Buyer {
  private data: TBuyerData = { ...EMPTY_BUYER_DATA };
  private events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  /** Сохраняет переданные данные покупателя. */
  setData(data: Partial<TBuyerData>): void {
    this.data = {
      ...this.data,
      ...data,
    };

    this.events.emit('buyer:changed');
  }

  /** Возвращает данные покупателя. */
  getData(): TBuyerData {
    return { ...this.data };
  }

  /** Очищает данные покупателя. */
  clear(): void {
    this.data = { ...EMPTY_BUYER_DATA };
    this.events.emit('buyer:changed');
  }

  /** Проверяет заполнение полей. */
  validate(): TBuyerErrors {
    const errors: TBuyerErrors = {};

    if (!this.data.payment) {
      errors.payment = 'Не выбран способ оплаты';
    }

    if (!this.data.address.trim()) {
      errors.address = 'Укажите адрес доставки';
    }

    if (!this.data.email.trim()) {
      errors.email = 'Укажите email';
    }

    if (!this.data.phone.trim()) {
      errors.phone = 'Укажите телефон';
    }

    return errors;
  }

}
