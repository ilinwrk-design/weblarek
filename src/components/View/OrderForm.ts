import { Form } from './Form';
import { IEvents } from '../base/Events';
import { IOrderForm, TPayment } from '../../types';
import { ensureElement } from '../../utils/utils';

/** Первый шаг оформления заказа: оплата и адрес. */
export class OrderForm extends Form<IOrderForm> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events, 'order:input', 'order:submit');

    this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
    this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);

    this.cardButton.addEventListener('click', () => {
      this.events.emit('order:payment-change', { payment: 'card' as TPayment });
    });

    this.cashButton.addEventListener('click', () => {
      this.events.emit('order:payment-change', { payment: 'cash' as TPayment });
    });
  }

  set payment(value: TPayment | '') {
    this.cardButton.classList.toggle('button_alt-active', value === 'card');
    this.cashButton.classList.toggle('button_alt-active', value === 'cash');
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}
