import './scss/styles.scss';

import { WebLarekApi } from './components/Communication/WebLarekApi';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { Products } from './components/Models/Products';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

/** Модели создаются независимо от API и компонентов интерфейса. */
const productsModel = new Products();
const basketModel = new Basket();
const buyerModel = new Buyer();

/** Коммуникационный класс получает базовый API через композицию. */
const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

// Проверка модели каталога.
productsModel.setItems(apiProducts.items);
console.log('Каталог: сохранённый массив товаров:', productsModel.getItems());

const firstProduct = productsModel.getItems()[0];
const secondProduct = productsModel.getItems()[1];
const unavailableProduct = productsModel.getItems()[2];

if (firstProduct && secondProduct && unavailableProduct) {
  console.log(
    'Каталог: товар, найденный по идентификатору:',
    productsModel.getItemById(firstProduct.id)
  );
  console.log(
    'Каталог: результат поиска отсутствующего товара:',
    productsModel.getItemById('unknown-product-id')
  );

  productsModel.setSelectedItem(firstProduct);
  console.log(
    'Каталог: товар для подробного отображения:',
    productsModel.getSelectedItem()
  );

  // Проверка модели корзины.
  console.log('Корзина: начальное содержимое:', basketModel.getItems());
  basketModel.addItem(firstProduct);
  basketModel.addItem(secondProduct);
  basketModel.addItem(firstProduct);
  basketModel.addItem(unavailableProduct);
  console.log(
    'Корзина: товары после добавления доступных позиций:',
    basketModel.getItems()
  );
  console.log(
    'Корзина: наличие первого товара:',
    basketModel.hasItem(firstProduct.id)
  );
  console.log('Корзина: количество товаров:', basketModel.getCount());
  console.log('Корзина: общая стоимость:', basketModel.getTotal());

  basketModel.removeItem(firstProduct);
  console.log('Корзина: товары после удаления:', basketModel.getItems());
  basketModel.clear();
  console.log('Корзина: содержимое после очистки:', basketModel.getItems());
}

// Проверка модели покупателя.
console.log('Покупатель: начальные данные:', buyerModel.getData());
console.log('Покупатель: ошибки пустых полей:', buyerModel.validate());

buyerModel.setData({ address: 'Москва, улица Примерная, 10' });
buyerModel.setData({ payment: 'card' });
buyerModel.setData({ email: 'buyer@example.com', phone: '+7 900 000-00-00' });
console.log(
  'Покупатель: данные после частичного заполнения:',
  buyerModel.getData()
);
console.log(
  'Покупатель: ошибки после заполнения полей:',
  buyerModel.validate()
);
console.log(
  'Покупатель: валидные данные для заказа:',
  buyerModel.getValidData()
);

buyerModel.clear();
console.log('Покупатель: данные после очистки:', buyerModel.getData());

// Получение актуального каталога с сервера и сохранение его в модели.
webLarekApi
  .getProducts()
  .then((response) => {
    productsModel.setItems(response.items);
    console.log(
      'Сервер: каталог получен и сохранён в модели:',
      productsModel.getItems()
    );
  })
  .catch((error: unknown) => {
    console.error('Сервер: не удалось получить каталог:', error);
  });
