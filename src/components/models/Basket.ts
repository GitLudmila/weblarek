import { IProduct } from "./../../types/index.ts";
import { IEvents } from "../base/Events.ts";

export class ShoppingCart {
  private items: IProduct[] = []; // Массив товаров

  constructor(protected events: IEvents) {}

  /**
   * Получает массив товаров в корзине (копия).
  */
  getItems(): IProduct[] {
    return [...this.items];
  }

  /**
   * Добавляет товар в корзину.
  */
  addItem(product: IProduct): void {
    this.items.push(product);
    this.events.emit('basket:changed');
  }

  /**
   * Удаляет товар из корзины.
  */
  removeItem(product: IProduct): void {
    this.items = this.items.filter(item => item.id !== product.id);
    this.events.emit('basket:changed');
  }

  /**
   * Очищает корзину.
  */
  clearCart(): void {
    this.items = [];
    this.events.emit('basket:changed');
  }

  /**
   * Подсчитывает общую стоимость товаров.
   * Цены, равные null, считаются как 0.
  */
  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  /**
   * Возвращает количество товаров в корзине.
  */
  getItemCount(): number {
    return this.items.length;
  }

  /**
   * Проверяет наличие товара по ID.
  */
  hasItem(productId: string): boolean {
    return this.items.some(item => item.id === productId);
  }
}