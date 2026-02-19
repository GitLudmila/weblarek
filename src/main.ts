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
import { Basket } from './components/view/BasketView.ts';
import { Modal } from './components/view/Modal.ts';
import { CardCatalog } from './components/view/cards/CardCatalog.ts';
import { CardDetailed } from './components/view/cards/CardDetailed.ts';
import { CardBasket } from './components/view/cards/CardBasket.ts';

// Остальное
import { Api } from './components/base/Api.ts';
import { API_URL } from './utils/constants.ts';
import { cloneTemplate, ensureElement } from './utils/utils.ts';
import { EventEmitter } from './components/base/Events.ts';
import { IProduct, TCardPreview, BuyerValidationErrors } from './types/index.ts';

const events = new EventEmitter();

const productsModel = new ProductCatalog(events);
const buyerModel = new Buyer(events);
const basketModel = new ShoppingCart(events);
const apiService = new ApiCommunication(new Api(API_URL));

const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const header = new Header(events, ensureElement<HTMLElement>('.header'));
const modal = new Modal(events, ensureElement<HTMLElement>('#modal-container'));
const basket = new Basket(events, cloneTemplate('#basket'));

let renderedBasket: HTMLElement;

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
      });
    
    return card.render(product);
  });

  gallery.render({ items: cards });
});

events.on('product:selected', () => {
  const product: IProduct = productsModel.getSelectedProduct() as IProduct;
  const item: TCardPreview = {...product};
  const detailedCard = new CardDetailed(
    cloneTemplate<HTMLElement>('#card-preview'),
    {
      onClick: () => {
        basketModel.hasItem(product.id)
        ? events.emit('product-basket:remove', product)
        : events.emit('product-basket:add', product);
    modal.close();
  }});

  if (product.price == null) {
    item['buttonText'] = 'Недоступно';
    detailedCard.disableButton();
  } else if (!basketModel.hasItem(product.id)) {
    item['buttonText'] = 'Купить';
  } else if (basketModel.hasItem(product.id)) {
    item['buttonText'] = 'Удалить из корзины';
  }

  const renderedCard = detailedCard.render(item);
  modal.render({ content: renderedCard });
  modal.open();
});

events.on('card-open', (product: IProduct) => {
    productsModel.saveSelectedProduct(product);
});

// События корзины товаров
events.on('basket:changed', () => {
  header.render({counter: basketModel.getItemCount()});

  basketModel.getItemCount() ? basket.enableButton() : basket.disableButton();
  const basketProducts = basketModel.getItems();
  const renderedItems = basketProducts.map((item, index) => {
    const card = new CardBasket(cloneTemplate('#card-basket'), {
      onClick: () => {
        events.emit('product-basket:remove', item);
      }});
      return card.render({...item, index: index + 1});
  });
  renderedBasket = basket.render({items: renderedItems, total: basketModel.getTotalPrice()}); 
});

events.on('basket:open', () => {
    modal.render({content: renderedBasket});
    modal.open();
});

events.on('product-basket:add', (product: IProduct) => {
  basketModel.addItem(product.id, productsModel.getItems());
});

events.on('product-basket:remove', (product: IProduct) => {
  basketModel.removeItem(product.id);
});

// События данных покупателя и формы
// let orderFormVisited = false;
// let contactsFormVisited = false;
// const orderStepErrors = ['address', 'payment'];
// const contactsStepErrors = ['phone', 'email'];

// events.on('buyer:changed', () => {
//   const errors: BuyerValidationErrors = buyerModel.validateData();

// })

// events.on('order:checkout', () => {});
// events.on('order:submit', () => {});