import { TPayment, IBuyer, BuyerValidationErrors } from "../../types/index.ts";
import { IEvents } from "../base/Events.ts";

/**
 * Модель покупателя
*/
export class Buyer implements IBuyer {
  payment: TPayment | '' = '';
  address = '';
  phone = '';
  email = '';

  constructor(protected events: IEvents) {}

  /**
   * Сохраняет одно или несколько полей, не затрагивая остальные
   */
  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.address !== undefined) this.address = data.address;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.email !== undefined) this.email = data.email;
    this.events.emit('buyer:changed', this.getData());
  }

  /**
   * Возвращает все данные покупателя
   */
  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  /**
   * Очищает все данные покупателя (устанавливает в пустые значения)
   */
  clearData(): void {
    this.payment = '';
    this.address = '';
    this.phone = '';
    this.email = '';
    this.events.emit('buyer:changed', this.getData());
  }

  /**
   * Валидирует данные покупателя
   */
  validateDataFirstStep(): BuyerValidationErrors {
    const errors: BuyerValidationErrors = {} as BuyerValidationErrors;
    // Валидация оплаты
    if (this.payment === '') {
      errors.payment = 'Не выбран вид оплаты';
    }
    // Валидация адреса
    if (!this.address?.trim()) {
      errors.address = 'Адрес не может быть пустым';
    }

    return errors;
  }

  validateDataSecondStep(): BuyerValidationErrors {
    const errors: BuyerValidationErrors = {} as BuyerValidationErrors;
    // Валидация номера телефона
    if (!this.phone?.trim()) {
      errors.phone = 'Телефон не может быть пустым';
    }

    // Валидация почтового ящика
    if (!this.email?.trim()) {
      errors.email = 'Email не может быть пустым';
    }

    return errors;
  }
}