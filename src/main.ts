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
import { Order } from './components/view/forms/Order.ts';
import { Contacts } from './components/view/forms/UserContacts.ts';
import { Success } from './components/view/forms/Success.ts';

// Остальное
import { Api } from './components/base/Api.ts';
import { API_URL } from './utils/constants.ts';
import { cloneTemplate, ensureElement } from './utils/utils.ts';
import { EventEmitter } from './components/base/Events.ts';
import { IProduct, BuyerValidationErrors, IBuyer, IApiPost } from './types/index.ts';

const events = new EventEmitter();

const productsModel = new ProductCatalog(events);
const buyerModel = new Buyer(events);
const orderForm = new Order(events, cloneTemplate('#order'));
const successForm = new Success(events, cloneTemplate('#success'));
const contactsForm = new Contacts(events, cloneTemplate('#contacts'));
const basketModel = new ShoppingCart(events);
const apiService = new ApiCommunication(new Api(API_URL));

const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const header = new Header(events, ensureElement<HTMLElement>('.header'));
const modal = new Modal(events, ensureElement<HTMLElement>('#modal-container'));
const basket = new Basket(events, cloneTemplate('#basket'));
const detailedCard = new CardDetailed(events, cloneTemplate<HTMLElement>('#card-preview'));

apiService
  .getProducts()
  .then((response) => {
    productsModel.setItems(response.items);
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
      {onClick: () => {
        events.emit('card-open', product);
      }});
    
    return card.render(product);
  });

  gallery.render({ items: cards });
});

events.on('product:selected', () => {
  const product = {...productsModel.getSelectedProduct() as IProduct};

  if (product.price == null) {
    detailedCard.buttonText = 'Недоступно';
    detailedCard.disableButton();
  } else if (!basketModel.hasItem(product.id)) {
    detailedCard.buttonText = 'Купить';
    detailedCard.ableButton();
  } else if (basketModel.hasItem(product.id)) {
    detailedCard.buttonText = 'Удалить из корзины';
    detailedCard.ableButton();
  }

  const renderedCard = detailedCard.render(product);
  modal.render({ content: renderedCard });
  modal.open();
});

events.on('card-open', (product: IProduct) => {
    productsModel.saveSelectedProduct(product);
});

events.on('preview:toggle', () => {
  const product = productsModel.getSelectedProduct();

  if(product !== null) {
      if(basketModel.hasItem(product.id)) {
        basketModel.removeItem(product);
      } else {
        basketModel.addItem(product);
      }
  };

  modal.close();

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
      return card.render({...item, index: ++index});
  });
  basket.render({fill: renderedItems, total: basketModel.getTotalPrice()}); 
});

events.on('basket:open', () => {
    modal.render({content: basket.render()});
    modal.open();
});


// События данных покупателя и формы
function filterErrors(errors: BuyerValidationErrors, fields: string[]): BuyerValidationErrors {
  return Object.fromEntries(
    fields
      .filter(field => errors.hasOwnProperty(field))
      .map(field => [field as keyof IBuyer, errors[field as keyof IBuyer]])
  ) as BuyerValidationErrors;
}
const orderStepErrors: Array<keyof IBuyer> = ['address', 'payment'];
const contactsStepErrors: Array<keyof IBuyer> = ['phone', 'email'];

events.on('buyer:changed', () => {
  const errors = buyerModel.validateData();
  const products = buyerModel.getData();
  const orderFormErrors = filterErrors(errors, orderStepErrors);
  const contactsFormErrors = filterErrors(errors, contactsStepErrors);

  orderForm.render({
    errors: orderFormErrors,
    buttonActive: products.payment,
    address: products.address
  });
    
  contactsForm.render({
    errors: contactsFormErrors,
    phone: products.phone,
    email: products.email
  });

  if (Object.keys(orderFormErrors).length !== 0) {
    orderForm.disableNextButton();
  } else {
    orderForm.enableNextButton();
  }

  if (Object.keys(contactsFormErrors).length !== 0) {
    contactsForm.disableNextButton();
  } else {
    contactsForm.enableNextButton();
  }
})

events.on('form:change', (data: IBuyer) => {
    buyerModel.setData({...data});
});

events.on('order:checkout', () => {
  modal.render({content: orderForm.render()});
});

events.on('order:proceed', () => {
    modal.render({content: contactsForm.render()});
});

events.on('order:pay', () => {
    const order: IApiPost = {
        ...buyerModel.getData(),
        total: basketModel.getTotalPrice(),
        items: basketModel.getItems().map(item => item.id)
    }

    apiService.postOrder(order)
        .then(data => {
            const renderedForm = successForm.render({total: data.total});
            modal.render({content: renderedForm});
            basketModel.clearCart();
            buyerModel.clearData();
        })
        .catch(err => contactsForm.render({errors: {err}}));
});


events.on('order:success', () => {
  modal.close();
});