/**
 * Тип методов публикации API
*/
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

/**
 * Интерфейс API
*/
export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

/**
 * Интерфейс продукта
 */
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

/**
 * Тип способа оплаты
 */
export type TPayment = 'card' | 'cash';

/**
 * Интерфейс покупателя
 */
export interface IBuyer {
  payment: TPayment | '';
  email: string;
  phone: string;
  address: string;
}

/**
 * Интерфейс API get запроса
*/
export interface IApiGet {
  total: number;
  items: IProduct[]; 
}

/**
 * Интерфейс API post запроса
*/
export interface IApiPost extends IBuyer {
  id: string;
  total: number;
}