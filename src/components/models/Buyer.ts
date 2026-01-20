import { TPayment, IBuyer } from "../../types/index.ts";

/**
 * Модель покупателя
*/
export class Buyer implements IBuyer {
  payment: TPayment | '' = '';
  address = '';
  phone = '';
  email = '';

  /**
   * Сохраняет одно или несколько полей, не затрагивая остальные
   */
  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.address !== undefined) this.address = data.address;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.email !== undefined) this.email = data.email;
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
  }

  /**
   * Валидирует данные покупателя
   */
  validateData(): Record<keyof IBuyer, string> {
    const errors: Record<keyof IBuyer, string> = {} as Record<keyof IBuyer, string>;
    // Валидация оплаты
    if (this.payment === '') {
      errors.payment = 'Не выбран вид оплаты';
    }
    // Валидация адреса
    if (!this.address || this.address.trim() === '') {
      errors.address = 'Адрес не может быть пустым';
    }
    // Валидация номера телефона
    if (!this.phone || this.phone.trim() === '') {
      errors.phone = 'Телефон не может быть пустым';
    }

    if (this.phone.trim() != '' && !/^\+?[0-9]{10,15}$/.test(this.phone)) {
      errors.phone = 'Некорректный телефон';
    }
    // Валидация почтового ящика
    if (!this.email || this.email.trim() === '') {
      errors.email = 'Email не может быть пустым';
    }
    
    if (this.email.trim() != '' && !/^\S+@\S+\.\S+$/.test(this.email)) {
      errors.email = 'Некорректный email';
    }

    return errors;
  }
}