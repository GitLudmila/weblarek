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
import { IProduct, TCardPreview, BuyerValidationErrors, IBuyer, IApiPost } from './types/index.ts';

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
  const product: IProduct = productsModel.getSelectedProduct() as IProduct;
  const item: TCardPreview = {...product};
  const detailedCard = new CardDetailed(
    cloneTemplate<HTMLElement>('#card-preview'),
    {onClick: () => {
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
let renderedBasket: HTMLElement = basket.render();

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
  renderedBasket = basket.render({fill: renderedItems, total: basketModel.getTotalPrice()}); 
});

events.on('basket:open', () => {
    modal.render({content: renderedBasket});
    modal.open();
});

events.on('product-basket:add', (product: IProduct) => {
  basketModel.addItem(product);
});

events.on('product-basket:remove', (product: IProduct) => {
  basketModel.removeItem(product);
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
  const orderFormErrors = filterErrors(errors, orderStepErrors);
  const contactsFormErrors = filterErrors(errors, contactsStepErrors);

  orderForm.render({
    errors: orderFormErrors,
    buttonActive: buyerModel.getData().payment,
    address: buyerModel.getData().address
  });
    
  contactsForm.render({
    errors: contactsFormErrors,
    phone: buyerModel.getData().phone,
    email: buyerModel.getData().email
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


let orderFormVisited: boolean = false;
let contactsFormVisited: boolean = false;

events.on('order:checkout', () => {
  const errors: BuyerValidationErrors = buyerModel.validateData();
  const orderFormErrors = filterErrors(errors, orderStepErrors);

  const renderedOrderForm = orderForm.render({
    errors: orderFormVisited ? orderFormErrors : {}
  });
  modal.render({content: renderedOrderForm});
  orderFormVisited = true;
});

events.on('order:proceed', () => {
    const errors: BuyerValidationErrors = buyerModel.validateData();
    const contactsFormErrors = filterErrors(errors, contactsStepErrors);

    const renderedContactsForm = contactsForm.render({
        errors: contactsFormVisited ? contactsFormErrors : {}
    });
    modal.render({content: renderedContactsForm});
    contactsFormVisited = true;
});

events.on('order:pay', () => {
    const order: IApiPost = {
        ...buyerModel.validateData(),
        total: basketModel.getTotalPrice(),
        items: basketModel.getItems().map(item => item.id)
    }

    apiService.postOrder(order)
        .then(data => {
            const renderedForm = successForm.render({total: data.total});
            modal.render({content: renderedForm});

            orderFormVisited = false;
            contactsFormVisited = false;
        })
        .catch(err => contactsForm.render({errors: {err}}));
});


events.on('order:success', () => {
  modal.close();
});