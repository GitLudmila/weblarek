import { IApiGet, IApiPost, IApiPostResponse } from "../../types";  
import { Api } from "../base/Api";  

/**
 * Слой коммуникации с серверным API
 */
export class ApiCommunication {
  api: Api; 

  constructor(api: Api) {
    this.api = api;  
  } 

  /**
   * Метод получает список товаров с эндпоинта /product/
   */
  getProducts(): Promise<IApiGet> {
      return this.api.get<IApiGet>("/product");
  }

  /**
   * Метод отправляет данные заказа на эндпоинт /order/
   */
  async postOrder(data: IApiPost): Promise<IApiPostResponse> { 
    return this.api.post<IApiPostResponse>("/order", data);
  }
}