// Стили
import './scss/styles.scss';

// Модели
import  { ProductCatalog } from './components/models/Catalogue.ts';
// import { Buyer } from './components/models/Buyer.ts';
import { ShoppingCart } from './components/models/Basket.ts';
import { ApiCommunication } from './components/models/ApiService.ts';

// Представление
import { Header } from './components/view/HeaderView.ts';
import { Gallery } from './components/view/GalleryView.ts';
import { Modal } from './components/view/Modal.ts';
import { CardCatalog } from './components/view/cards/CardCatalog.ts';
import { CardDetailed } from './components/view/cards/CardDetailed.ts';

// Остальное
import { Api } from './components/base/Api.ts';
import { API_URL } from './utils/constants.ts';
import { cloneTemplate, ensureElement } from './utils/utils.ts';
import { EventEmitter } from './components/base/Events.ts';
import { IProduct } from './types/index.ts';

const events = new EventEmitter();

const productsModel = new ProductCatalog(events);
// const buyerModel = new Buyer(events);
const basketModel = new ShoppingCart(events);
const apiService = new ApiCommunication(new Api(API_URL));

const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const header = new Header(events, ensureElement<HTMLElement>('.header'));
const modal = new Modal(events, ensureElement<HTMLElement>('#modal-container'));

apiService
  .getProducts()
  .then((response) => {
    productsModel.setItems(response.items);
    console.log("Сохраненный массив с сервера:", productsModel.getItems());
  }) 
  .catch((error) => console.error('Ошибка загрузки товаров:', error));
// _______________________________________

// События каталога товаров
events.on('products:changed', () => {
  const products = productsModel.getItems();

  const cards = products.map((product) => {
    const cardCatalogTemplate = cloneTemplate<HTMLElement>('#card-catalog');
    const card = new CardCatalog(
      cardCatalogTemplate,
      {
        onClick: () => {
        events.emit('card-open', product);
      }
      }
    );
    
    return card.render(product);
  });

  gallery.render({ items: cards });
});

events.on('product:selected', () => {
  const product = productsModel.getSelectedProduct();
  const detailedCardTemplate = cloneTemplate<HTMLElement>('#card-preview');
  const detailedCard = new CardDetailed(events, detailedCardTemplate);
  const renderedCard = detailedCard.render(product);
  modal.open();
  modal.render({ content: renderedCard });
});


events.on('card-open', (product: IProduct) => {
    productsModel.saveSelectedProduct(product);
});

// События корзины товаров
events.on('basket:changed', () => {
  // Счетчик корзины в шапке
  const allInBasket = basketModel.getItemCount();
  header.counter = allInBasket;
  header.render();

  // Отображение корзины
// ??

})

events.on('basket:open', () => {
  modal.open();
  const ProductsInCart = basketModel.getItems();
  let index: number = 0;
  productsToShow = [];
  ProductsInCart.map(() => {

  })
});
// events.on('basket:checkout', () => {});
// events.on('basket:delete', () => {});
// events.on('product-basket:remove', () => {});
// events.on('product-basket:add', () => {});

// События данных покупателя и формы

// events.on('order:submit', () => {});