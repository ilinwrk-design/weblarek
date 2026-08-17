import './scss/styles.scss';

import { WebLarekApi } from './components/Communication/WebLarekApi';
import { Products } from './components/Models/Products';
import { CatalogCard } from './components/View/CatalogCard';
import { Page } from './components/View/Page';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { API_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';

// Один брокер событий используется для связи частей приложения.
const events = new EventEmitter();

// Создаем модель каталога и представление главной страницы.
const productsModel = new Products(events);
const page = new Page(document.body, events);

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

// Получаем товары с сервера. После сохранения модель сама сообщит об изменении каталога.
webLarekApi
  .getProducts()
  .then((response) => {
    productsModel.setItems(response.items);
  })
  .catch((error: unknown) => {
    console.error('Не удалось получить каталог товаров:', error);
  });
