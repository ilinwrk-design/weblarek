import { Form } from './Form';
import { IEvents } from '../base/Events';
import { IContactsForm } from '../../types';
import { ensureElement } from '../../utils/utils';

/** Второй шаг оформления заказа: email и телефон. */
export class ContactsForm extends Form<IContactsForm> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events, 'contacts:input', 'contacts:submit');

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}
