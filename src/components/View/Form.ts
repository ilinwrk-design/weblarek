import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IFormState } from '../../types';
import { ensureElement } from '../../utils/utils';

/** Общая часть форм оформления заказа. */
export abstract class Form<T extends IFormState> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(
    container: HTMLFormElement,
    protected events: IEvents,
    private readonly inputEvent: string,
    private readonly submitEvent: string
  ) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
    this.errorsElement = ensureElement<HTMLElement>('.form__errors', container);

    this.container.addEventListener('input', (event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement) {
        this.events.emit(this.inputEvent, {
          field: target.name,
          value: target.value,
        });
      }
    });

    this.container.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit(this.submitEvent);
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}
