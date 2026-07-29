/** Поддерживаемые HTTP-методы для запросов с телом. */
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

/** Публичный контракт базового класса для выполнения HTTP-запросов. */
export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}

/** Доступные способы оплаты заказа. */
export type TPayment = 'card' | 'cash';

/** Товар, доступный в каталоге интернет-магазина. */
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

/** Данные покупателя, необходимые для оформления заказа. */
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

/**
 * Состояние модели покупателя до завершения заполнения формы.
 * Пустая строка означает, что способ оплаты ещё не выбран.
 */
export type TBuyerData = Omit<IBuyer, 'payment'> & {
  payment: TPayment | '';
};

/** Ошибки валидации отдельных полей данных покупателя. */
export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

/** Ответ сервера со списком товаров. */
export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

/** Данные заказа, отправляемые на сервер. */
export interface IOrderRequest extends IBuyer {
  total: number;
  items: string[];
}

/** Ответ сервера после успешного оформления заказа. */
export interface IOrderResponse {
  id: string;
  total: number;
}
