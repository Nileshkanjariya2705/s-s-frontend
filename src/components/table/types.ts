export type ApiParamsType = {
  limit: number;
  count: number;
  page: number;
  isAsc?: boolean;
  sort?: string;
  searchText?: string;
  searchField?: string;
  extraParams?:Object
};


export interface ColumnProps {
  id: number;
  title: string;
  dataIndex: string;
  willBeSorted?: boolean;
  render?: (data: any) => JSX.Element;
  colRender?: () => JSX.Element;
}

export type onBtnClickFunc = (id: any) => void;
