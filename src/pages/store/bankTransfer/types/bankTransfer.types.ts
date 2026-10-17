export interface OrderDetailTypes {
  payment_status: string;
  amount: string;
  orders: {
    purchase_request_id: string;
    payment_receipt: string;
    status: string;
    created_at: string;
    address: {
      address: string;
      city: string;
      state: string;
      country: string;
      uuid?: string;
      user_uuid?: string;
      postal_code: string;
    };
    storeInfo: {
      uuid?: string;
      company_name: string;
      cr_number: string;
      tax_number: string;
    };
    supplierInfo: {
      uuid?: string;
      company_name: string;
      cr_number: string;
      tax_number: string;
    };
  };
}

export type searchFilterType={
  order_uuid: string|undefined,
  amount: string|undefined,
  order_date: string[]|undefined,
  status:string| undefined,
}