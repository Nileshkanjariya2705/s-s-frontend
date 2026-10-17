export function getUnitShortName(item: any, language: string) {
  if (language === "en") {
    return (
      item?.product?.measurement?.unit_short_name ||
      item?.supplierProductQuotes?.ProductPurchaseRequests?.products
        ?.measurement?.unit_short_name
    );
  }

  if (language === "ar") {
    return (
      item?.product?.measurement?.unit_short_name_ar ||
      item?.supplierProductQuotes?.ProductPurchaseRequests?.products
        ?.measurement?.unit_short_name_ar
    );
  }

  if (language === "ur") {
    return (
      item?.product?.measurement?.unit_short_name_ur ||
      item?.supplierProductQuotes?.ProductPurchaseRequests?.products
        ?.measurement?.unit_short_name_ur
    );
  }

  return null;
}
