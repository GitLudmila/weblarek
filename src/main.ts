import './scss/styles.scss';
import { apiProducts } from './utils/data.ts'
import  { ProductCatalog } from './components/models/Catalogue.ts';
import { Buyer } from './components/models/Buyer.ts';
import { ShoppingCart } from './components/models/Basket.ts';
import { ApiCommunication } from './components/models/ApiService.ts';
import { Api } from './components/base/Api.ts';
import { API_URL } from './utils/constants.ts';

// Проверка модели каталога товаров
const productsModel = new ProductCatalog();
productsModel.setItems(apiProducts.items);

console.log(`Массив товаров из каталога: `, productsModel.getItems());

// console.log(`Продукт по ID: `, productsModel.getProductById('854cef69-976d-4c2a-a18c-2aa45046c390'));


// Проверка модели покупателя
const buyerModel = new Buyer();
buyerModel.setData({ email: 'usser@example.com' });
buyerModel.setData({ phone: '+79991234567' });
buyerModel.setData({ address: '221b, Baker Street, London' });
buyerModel.setData({ payment: 'card' });

console.log(`Данные покупателя: `, buyerModel.getData());

// const errors = buyerModel.validateData();
// if (Object.keys(errors).length > 0) {
//   console.log('Ошибки валидации:', errors);
// } else {
//   console.log('Данные валидны');
// }
// buyerModel.clearData();
// console.log(`Данные покупателя: `, buyerModel.getData());

// Проверка модели корзины товаров
const basket = new ShoppingCart();
basket.addItem('854cef69-976d-4c2a-a18c-2aa45046c390', apiProducts.items);
basket.addItem('412bcf81-7e75-4e70-bdb9-d3c73c9803b7', apiProducts.items);

// basket.removeItem('854cef69-976d-4c2a-a18c-2aa45046c390');
// basket.clearCart();

console.log(`Массив товаров из корзины: `, basket.getItems());
// console.log(`Колю-во товаров в корзинe: `, basket.getItemCount());
// console.log(`Полная цена товаров в корзинe: `, basket.getTotalPrice());
// console.log(`Наличие товара в корзине: `, basket.hasItem('412bcf81-7e75-4e70-bdb9-d3c73c9803b7'));

// Проверка модели коммуникационного слоя
const apiService = new ApiCommunication(new Api(API_URL));

apiService
  .getFetch()
  .then((response) => {
    productsModel.setItems(response.items);
    console.log("Сохраненный массив с сервера:", productsModel.getItems());
  }) 
  .catch((error) => console.log(error));