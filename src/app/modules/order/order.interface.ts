export type IOrderFilters = {
  searchTerm?: string;
};

type singleOrder = {
  bookId: string;
  quantity: number;
};
export type IOrderPayload = {
  orderedBooks: singleOrder[];
};
