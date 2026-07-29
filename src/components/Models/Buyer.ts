import type {
  IBuyer,
  TBuyerData,
  TBuyerErrors,
} from '../../types';

const EMPTY_BUYER_DATA: TBuyerData = {
  payment: '',
  email: '',
  phone: '',
  address: '',
};

/**
 * Модель покупателя.
 * Хранит введённые данные и проверяет заполненность каждого поля.
 */
export class Buyer {
  private data: TBuyerData = { ...EMPTY_BUYER_DATA };

  /**
   * Частично обновляет данные покупателя.
   * Поля, отсутствующие в параметре, сохраняют прежние значения.
   */
  setData(data: Partial<TBuyerData>): void {
    this.data = {
      ...this.data,
      ...data,
    };
  }

  /** Возвращает копию всех текущих данных покупателя. */
  getData(): TBuyerData {
    return { ...this.data };
  }

  /** Очищает все сохранённые данные покупателя. */
  clear(): void {
    this.data = { ...EMPTY_BUYER_DATA };
  }

  /**
   * Проверяет заполненность полей и возвращает объект найденных ошибок.
   * Отсутствие свойства в объекте означает, что поле прошло проверку.
   */
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

  /**
   * Возвращает заполненные данные в формате заказа.
   * Метод следует вызывать после успешной валидации.
   */
  getValidData(): IBuyer | null {
    if (Object.keys(this.validate()).length > 0 || !this.data.payment) {
      return null;
    }

    return {
      payment: this.data.payment,
      email: this.data.email,
      phone: this.data.phone,
      address: this.data.address,
    };
  }
}
