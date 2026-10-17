export type purchasedproductDataType = {
  getAllPurchaseReq: string;
  getInExpirePurcReq: string;
  totalProducts: string;
  purchasedPrdDetail: SupplierProduct[];
};
export type SupplierProduct = {
  uuid: string;
  product_uuid: string;
  supplier_uuid: string;
  supplier_info_uuid: string;
  price: string;

  base_price: string;
  units: number;
  is_purchaseable: boolean;
  end_date: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  product: ProductDetails;
};
export type ProductDetails = {
  uuid: string;
  name_en: string;
  name_ar: string;
  name_ur: string;
  overview_en: string;
  overview_ur: string;
  overview_ar: string;
  description_en: string;
  description_ar: string;
  description_ur: string;
  specification_en: string;
  specification_ar: string;
  specification_ur: string;
  category_uuid: string;
  measurement_uuid: string;
  images: string;
  featured_image: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
};
export type orderProduct = {
  price: string;
  product?: {
    name_en: string;
    name_ur: string;
    name_ar: string;
    featured_image: string;
    measurement: {
      unit_short_name: string;
      unit_short_name_ar: string;
      unit_short_name_ur: string;
    };
  };
  product_uuid?: string;
  quantity: number;
  quote_id?: string;
  supplierProductQuotes: {
    uuid: string;
    ProductPurchaseRequests: {
      uuid: string;
      products: {
        measurement: {
          unit_short_name: string;
          unit_short_name_ar: string;
          unit_short_name_ur: string;
        };
        name_en: string;
        name_ur: string;
        name_ar: string;
        featured_image: string;
      };
    };
  };
};
