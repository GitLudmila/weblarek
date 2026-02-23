import { TPayment, IBuyer, BuyerValidationErrors } from "../../types/index.ts";
import { IEvents } from "../base/Events.ts";

/**
 * Модель покупателя
*/
export class Buyer implements IBuyer {
  private _payment: TPayment | '' = '';
  private _address = '';
  private _phone = '';
  private _email = '';

  constructor(protected events: IEvents) {}

  /**
   * Сохраняет одно или несколько полей, не затрагивая остальные
   */
  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this._payment = data.payment;
    if (data.address !== undefined) this._address = data.address;
    if (data.phone !== undefined) this._phone = data.phone;
    if (data.email !== undefined) this._email = data.email;
    this.events.emit('buyer:changed', this.getData());
  }

  /**
   * Возвращает все данные покупателя
   */
  getData(): IBuyer {
    return {
      payment: this._payment,
      address: this._address,
      phone: this._phone,
      email: this._email,
    };
  }

  /**
   * Очищает все данные покупателя (устанавливает в пустые значения)
   */
  clearData(): void {
    this._payment = '';
    this._address = '';
    this._phone = '';
    this._email = '';
    this.events.emit('buyer:changed', this.getData());
  }

  /**
   * Валидирует данные покупателя
   */
  validateData(): BuyerValidationErrors {
    const errors: BuyerValidationErrors = {} as BuyerValidationErrors;
    // Валидация оплаты
    if (this._payment === '') {
      errors.payment = 'Не выбран вид оплаты';
    }
    // Валидация адреса
    if (!this._address?.trim()) {
      errors.address = 'Адрес не может быть пустым';
    }
    // Валидация номера телефона
    if (!this._phone?.trim()) {
      errors.phone = 'Телефон не может быть пустым';
    }
    // Валидация почтового ящика
    if (!this._email?.trim()) {
      errors.email = 'Email не может быть пустым';
    }

    return errors;
  }
}