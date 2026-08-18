import './scss/styles.scss';

import { WebLarekApi } from './components/Communication/WebLarekApi';
import { Products } from './components/Models/Products';
import { Basket } from './components/Models/Basket';
import { BasketCard } from './components/View/BasketCard';
import { BasketView } from './components/View/BasketView';
import { CatalogCard } from './components/View/CatalogCard';
import { Modal } from './components/View/Modal';
import { Page } from './components/View/Page';
import { PreviewCard } from './components/View/PreviewCard';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

// Один брокер событий используется для связи частей приложения.
const events = new EventEmitter();

// Создаем модель каталога и основные компоненты представления.
const productsModel = new Products(events);
const basketModel = new Basket(events);
const page = new Page(document.body, events);
const modal = new Modal(
  ensureElement<HTMLElement>('#modal-container'),
  events
);

// Здесь будем хранить открытую корзину, чтобы обновлять её после удаления товара.
let basketView: BasketView | null = null;

// Класс WebLarekApi использует базовый Api для запросов к серверу.
const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

// Когда каталог изменился, получаем товары из модели и создаем карточки.
events.on('products:changed', () => {
  const products = productsModel.getItems();

  const cards = products.map((product) => {
    const card = new CatalogCard(
      cloneTemplate<HTMLElement>('#card-catalog'),
      events
    );

    return card.render(product);
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

  const previewCard = new PreviewCard(
    cloneTemplate<HTMLElement>('#card-preview'),
    events
  );

  let buttonText = 'Купить';

  if (basketModel.hasItem(product.id)) {
    buttonText = 'Удалить из корзины';
  }

  if (product.price === null) {
    buttonText = 'Недоступно';
  }

  const previewElement = previewCard.render({
    ...product,
    buttonText,
    buttonDisabled: product.price === null,
  });

  modal.render({ content: previewElement });
});

// Обрабатываем кнопку действия в подробной карточке товара.
events.on<{ id: string }>('preview:action', (data) => {
  const product = productsModel.getItemById(data.id);

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
  page.render({ counter: basketModel.getCount() });

  // Если корзина сейчас открыта, обновляем её содержимое.
  if (basketView) {
    const items = basketModel.getItems();

    const basketCards = items.map((product, index) => {
      const card = new BasketCard(
        cloneTemplate<HTMLElement>('#card-basket'),
        events
      );

      return card.render({
        id: product.id,
        title: product.title,
        price: product.price,
        index: index + 1,
      });
    });

    basketView.render({
      items: basketCards,
      total: basketModel.getTotal(),
      valid: items.length > 0,
    });
  }
});

// Открываем корзину по клику на иконку в шапке.
events.on('basket:open', () => {
  const items = basketModel.getItems();

  basketView = new BasketView(
    cloneTemplate<HTMLElement>('#basket'),
    events
  );

  const basketCards = items.map((product, index) => {
    const card = new BasketCard(
      cloneTemplate<HTMLElement>('#card-basket'),
      events
    );

    return card.render({
      id: product.id,
      title: product.title,
      price: product.price,
      index: index + 1,
    });
  });

  const basketElement = basketView.render({
    items: basketCards,
    total: basketModel.getTotal(),
    valid: items.length > 0,
  });

  modal.render({ content: basketElement });
});

// Удаляем товар по кнопке в строке корзины.
events.on<{ id: string }>('basket:item-remove', (data) => {
  const product = productsModel.getItemById(data.id);

  if (product) {
    basketModel.removeItem(product);
  }
});

// Закрываем модальное окно по событию от компонента Modal.
events.on('modal:close', () => {
  basketView = null;
  modal.close();
});

// Получаем товары с сервера. После сохранения модель сама сообщит об изменении каталога.
webLarekApi
  .getProducts()
  .then((response) => {
    productsModel.setItems(response.items);
  })
  .catch((error: unknown) => {
    console.error('Не удалось получить каталог товаров:', error);
  });
