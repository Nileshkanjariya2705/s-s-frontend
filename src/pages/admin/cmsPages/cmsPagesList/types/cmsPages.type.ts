export interface DataSourceProps {
  title: string;
  getCountOfBlogs: number;
  getCountOfFaqs: number;
  getCountOfReview: number;
}

export interface DataProps {
  filters: any;
  page_title: string;
  page_descritpion: string;
  slug: string;
}
