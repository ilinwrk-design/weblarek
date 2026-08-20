import './scss/styles.scss';

import { WebLarekApi } from './components/Communication/WebLarekApi';
import { Products } from './components/Models/Products';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { BasketCard } from './components/View/BasketCard';
import { BasketView } from './components/View/BasketView';
import { CatalogCard } from './components/View/CatalogCard';
import { ContactsForm } from './components/View/ContactsForm';
import { Modal } from './components/View/Modal';
import { OrderForm } from './components/View/OrderForm';
import { Page } from './components/View/Page';
import { PreviewCard } from './components/View/PreviewCard';
import { Success } from './components/View/Success';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IOrderRequest, TPayment } from './types';

// Один брокер событий используется для связи частей приложения.
const events = new EventEmitter();

// Создаем модель каталога и основные компоненты представления.
const productsModel = new Products(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);
const page = new Page(document.body, events);
const modal = new Modal(
  ensureElement<HTMLElement>('#modal-container'),
  events
);

// Статичные компоненты создаём один раз при загрузке страницы.
const previewCard = new PreviewCard(
  cloneTemplate<HTMLElement>('#card-preview'),
  {
    onClick: () => events.emit('preview:action'),
  }
);
const basketView = new BasketView(
  cloneTemplate<HTMLElement>('#basket'),
  events
);
const orderForm = new OrderForm(
  cloneTemplate<HTMLFormElement>('#order'),
  events
);
const contactsForm = new ContactsForm(
  cloneTemplate<HTMLFormElement>('#contacts'),
  events
);
const success = new Success(
  cloneTemplate<HTMLElement>('#success'),
  events
);

// Класс WebLarekApi использует базовый Api для запросов к серверу.
const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

// Когда каталог изменился, получаем товары из модели и создаем карточки.
events.on('products:changed', () => {
  const products = productsModel.getItems();

  const cards = products.map((product) => {
    const card = new CatalogCard(
      cloneTemplate<HTMLElement>('#card-catalog'),
      {
        onClick: () => events.emit('card:select', { id: product.id }),
      }
    );

    return card.render({
      title: product.title,
      price: product.price,
      category: product.category,
      image: product.image,
      alt: product.title,
    });
  });

  page.render({ gallery: cards });
});

// Пользователь выбрал карточку в каталоге.
events.on<{ id: string }>('card:select', (data) => {
  const product = productsModel.getItemById(data.id);

  if (product) {
    productsModel.setSelectedItem(product);
  }
});

// После изменения выбранного товара показываем его в модальном окне.
events.on('product:selected', () => {
  const product = productsModel.getSelectedItem();

  if (!product) {
    return;
  }

  let buttonText = 'Купить';

  if (basketModel.hasItem(product.id)) {
    buttonText = 'Удалить из корзины';
  }

  if (product.price === null) {
    buttonText = 'Недоступно';
  }

  const previewElement = previewCard.render({
    title: product.title,
    price: product.price,
    category: product.category,
    image: product.image,
    alt: product.title,
    description: product.description,
    buttonText,
    buttonDisabled: product.price === null,
  });

  modal.render({ content: previewElement });
});

// Обрабатываем кнопку действия в подробной карточке товара.
events.on('preview:action', () => {
  const product = productsModel.getSelectedItem();

  if (!product || product.price === null) {
    return;
  }

  if (basketModel.hasItem(product.id)) {
    basketModel.removeItem(product);
  } else {
    basketModel.addItem(product);
  }

  modal.close();
});

// После изменения корзины обновляем счетчик на главной странице.
events.on('basket:changed', () => {
  const items = basketModel.getItems();

  const basketCards = items.map((product, index) => {
    const card = new BasketCard(
      cloneTemplate<HTMLElement>('#card-basket'),
      {
        onClick: () => events.emit('basket:item-remove', { id: product.id }),
      }
    );

    return card.render({
      title: product.title,
      price: product.price,
      index: index + 1,
    });
  });

  page.render({ counter: basketModel.getCount() });

  basketView.render({
    items: basketCards,
    total: basketModel.getTotal(),
    valid: items.length > 0,
  });
});

// Открываем корзину по клику на иконку в шапке.
events.on('basket:open', () => {
  modal.render({ content: basketView.render() });
});

// Удаляем товар по кнопке в строке корзины.
events.on<{ id: string }>('basket:item-remove', (data) => {
  const product = productsModel.getItemById(data.id);

  if (product) {
    basketModel.removeItem(product);
  }
});


// Открываем первый шаг оформления заказа.
events.on('order:open', () => {
  const buyerData = buyerModel.getData();
  const errors = buyerModel.validate();

  if (buyerData.payment) {
    orderForm.render({ payment: buyerData.payment });
  } else {
    orderForm.clearPayment();
  }

  const orderElement = orderForm.render({
    address: buyerData.address,
    valid: !errors.payment && !errors.address,
    errors: errors.payment || errors.address || '',
  });

  modal.render({ content: orderElement });
});

// Сохраняем выбранный способ оплаты в модели покупателя.
events.on<{ payment: 'card' | 'cash' }>('order:payment-change', (data) => {
  buyerModel.setData({ payment: data.payment });
});

// На первом шаге нас интересует только поле адреса.
events.on<{ field: string; value: string }>('order:input', (data) => {
  if (data.field === 'address') {
    buyerModel.setData({ address: data.value });
  }
});

// После изменения данных покупателя обновляем открытую форму.
events.on('buyer:changed', () => {
  const buyerData = buyerModel.getData();
  const errors = buyerModel.validate();

  if (buyerData.payment) {
    orderForm.render({ payment: buyerData.payment });
  } else {
    orderForm.clearPayment();
  }

  orderForm.render({
    address: buyerData.address,
    valid: !errors.payment && !errors.address,
    errors: errors.payment || errors.address || '',
  });

  contactsForm.render({
    email: buyerData.email,
    phone: buyerData.phone,
    valid: !errors.email && !errors.phone,
    errors: errors.email || errors.phone || '',
  });
});


// Переходим ко второму шагу оформления заказа.
events.on('order:submit', () => {
  const buyerData = buyerModel.getData();
  const errors = buyerModel.validate();

  const contactsElement = contactsForm.render({
    email: buyerData.email,
    phone: buyerData.phone,
    valid: !errors.email && !errors.phone,
    errors: errors.email || errors.phone || '',
  });

  modal.render({ content: contactsElement });
});

// Сохраняем email и телефон из второй формы.
events.on<{ field: string; value: string }>('contacts:input', (data) => {
  if (data.field === 'email') {
    buyerModel.setData({ email: data.value });
  }

  if (data.field === 'phone') {
    buyerModel.setData({ phone: data.value });
  }
});


// Отправляем заполненный заказ на сервер.
events.on('contacts:submit', () => {
  const buyerData = buyerModel.getData();
  const items = basketModel.getItems();

  const order: IOrderRequest = {
    payment: buyerData.payment as TPayment,
    email: buyerData.email,
    phone: buyerData.phone,
    address: buyerData.address,
    total: basketModel.getTotal(),
    items: items.map((item) => item.id),
  };

  webLarekApi
    .createOrder(order)
    .then((response) => {
      basketModel.clear();
      buyerModel.clear();

      const successElement = success.render({
        total: response.total,
      });

      modal.render({ content: successElement });
    })
    .catch((error: unknown) => {
      console.error('Не удалось оформить заказ:', error);
    });
});

// Закрываем сообщение об успешном заказе.
events.on('success:close', () => {
  modal.close();
});


// Получаем товары с сервера. После сохранения модель сама сообщит об изменении каталога.
webLarekApi
  .getProducts()
  .then((response) => {
    const products = response.items.map((product) => ({
      ...product,
      image: `${CDN_URL}${product.image}`,
    }));

    productsModel.setItems(products);
  })
  .catch((error: unknown) => {
    console.error('Не удалось получить каталог товаров:', error);
  });
