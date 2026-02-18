import { IProduct } from "../../types/index.ts";
import { IEvents } from "../base/Events.ts";

/**
 * Модель каталога товаров
*/
export class ProductCatalog {
  private allProducts: IProduct[] = []; // Хранит массив всех товаров
  private selectedProduct: IProduct | null = null; // Выбранный для детализации товар

  constructor(protected events: IEvents) {}

  /**
   * Сохраняет массив товаров в модель
   */
  setItems(products: IProduct[]): void {
    this.allProducts = [...products]; // Создаём копию массива
    this.events.emit('products:changed', this.allProducts);
  }

  /**
   * Возвращает массив всех товаров
   */
  getItems(): IProduct[] {
    return [...this.allProducts]; // Возвращаем копию
  }

  /**
   * Находит товар по ID
   */
  getProductById(productId: string): IProduct | undefined {
    return this.allProducts.find(item => item.id === productId);
  }

  /**
   * Сохраняет товар для подробного отображения
   */
  saveSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
    this.events.emit('product:selected');
  }

  /**
   * Возвращает товар, выбранный для детализации
   */
  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}