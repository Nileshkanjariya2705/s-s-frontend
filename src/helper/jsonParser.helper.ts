import { AddressType } from "types/generalTypes";

export function parseJSON(jsonString: string) {
  try {
    const parsedData = JSON.parse(jsonString);
    return parsedData;
  } catch (error) {
    return null;
  }
}

export function moveDefaultObjectToStart(arr: AddressType[]) {
  const defaultIndex = arr.findIndex((obj) => obj.is_default === true);
  if (defaultIndex !== -1) {
    return [
      arr[defaultIndex],
      ...arr.slice(0, defaultIndex),
      ...arr.slice(defaultIndex + 1),
    ];
  }
  return arr;
}

export function formatNumberWithCommas(number:number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}