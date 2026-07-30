import type {
  IApi,
  IOrderRequest,
  IOrderResponse,
  IProductsResponse,
} from '../../types';

/**
 * Коммуникационный слой приложения.
 * Получает каталог и отправляет заказ, используя переданный объект IApi.
 */
export class WebLarekApi {
  constructor(private readonly api: IApi) {}

  /** Получает объект с каталогом товаров с эндпоинта /product/. */
  getProducts(): Promise<IProductsResponse> {
    return this.api.get<IProductsResponse>('/product/');
  }

  /** Отправляет данные заказа на эндпоинт /order/. */
  createOrder(order: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order/', order);
  }
}
