// Стили
import './scss/styles.scss';

// Модели
import  { ProductCatalog } from './components/models/Catalogue.ts';
import { Buyer } from './components/models/Buyer.ts';
import { ShoppingCart } from './components/models/Basket.ts';
import { ApiCommunication } from './components/models/ApiService.ts';

// Представление
import { Header } from './components/view/HeaderView.ts';
import { Gallery } from './components/view/GalleryView.ts';
import { Modal } from './components/view/Modal.ts';

// Остальное
import { Api } from './components/base/Api.ts';
import { API_URL } from './utils/constants.ts';
import { cloneTemplate, ensureElement } from './utils/utils.ts';
import { EventEmitter } from './components/base/Events.ts';
import { apiProducts } from './utils/data.ts';

const events = new EventEmitter();

// Проверка модели каталога товаров
const productsModel = new ProductCatalog(events);
productsModel.setItems(apiProducts.items);

console.log(`Массив товаров из каталога: `, productsModel.getItems());

console.log(`Продукт по ID: `, productsModel.getProductById('854cef69-976d-4c2a-a18c-2aa45046c390'));

productsModel.saveSelectedProduct(apiProducts.items[0]);
console.log('Получили сохраненный товар: ', productsModel.getSelectedProduct());

// Проверка модели покупателя
const buyerModel = new Buyer(events);
buyerModel.setData({ email: 'usser@example.com' });
buyerModel.setData({ phone: '+79991234567' });
buyerModel.setData({ address: '221b, Baker Street, London' });
buyerModel.setData({ payment: 'card' });

console.log(`Данные покупателя: `, buyerModel.getData());

const errors1Step = buyerModel.validateDataFirstStep();
if (Object.keys(errors1Step).length > 0) {
  console.log('Ошибки валидации шага 1:', errors1Step);
} else {
  console.log('Данные шага 1 валидны');
}

 
const errors2Step = buyerModel.validateDataSecondStep();
if (Object.keys(errors2Step).length > 0) {
  console.log('Ошибки валидации шага 2:', errors2Step);
} else {
  console.log('Данные шага 2 валидны');
}

buyerModel.clearData();
console.log(`Данные покупателя: `, buyerModel.getData());

const errors1Again = buyerModel.validateDataFirstStep();
if (Object.keys(errors1Again).length > 0) {
  console.log('Ошибки валидации шага 1:', errors1Again);
} else {
  console.log('Данные шага 1 валидны');
}

const errors2Again = buyerModel.validateDataSecondStep();
if (Object.keys(errors2Again).length > 0) {
  console.log('Ошибки валидации шага 2:', errors2Again);
} else {
  console.log('Данные шага 2 валидны');
}

// Проверка модели корзины товаров
const basketModel = new ShoppingCart(events);
basketModel.addItem('854cef69-976d-4c2a-a18c-2aa45046c390', apiProducts.items);
basketModel.addItem('412bcf81-7e75-4e70-bdb9-d3c73c9803b7', apiProducts.items);

console.log(`Массив товаров из корзины: `, basketModel.getItems());
console.log(`Кол.-во товаров в корзинe: `, basketModel.getItemCount());
console.log(`Полная цена товаров в корзинe: `, basketModel.getTotalPrice());
console.log(`Наличие товара в корзине: `, basketModel.hasItem('412bcf81-7e75-4e70-bdb9-d3c73c9803b7'));

basketModel.removeItem('854cef69-976d-4c2a-a18c-2aa45046c390');
console.log(`Массив товаров из корзины с 1 удаленным товаром: `, basketModel.getItems());

basketModel.clearCart();
console.log(`Пустая корзина: `, basketModel.getItems());


// Проверка модели коммуникационного слоя
const apiService = new ApiCommunication(new Api(API_URL));

apiService
  .getProducts()
  .then((response) => {
    productsModel.setItems(response.items);
    console.log("Сохраненный массив с сервера:", productsModel.getItems());
  }) 
  .catch((error) => console.error('Ошибка загрузки товаров:', error));

// Проверка представления шапки
const header = new Header(events, ensureElement<HTMLElement>('.header'));

header.counter = 15;
console.log(header.render());

// Проверка предсставления галереи
const cardElement = cloneTemplate<HTMLElement>('#card-catalog');

const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
gallery.items = [cardElement];

console.log(gallery.render());

// Проверка представления модального окна
const events1 = new EventEmitter();
const modal = new Modal(events1, ensureElement<HTMLElement>('#modal-container'));

modal.content = cardElement;
modal.open();
console.log(modal.render());