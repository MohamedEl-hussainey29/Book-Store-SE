import { useMemo } from "react";

interface Book {
  id: number;
  title: string;
  category: string;
  author: string;
  price: number;
  image: string;
  description: string;
  status: string;
}

interface PaginationResult {
  currentBooks: Book[];
  total: number;
  pageCount: number;
  startIndex: number;
}

export function usePagination(data: Book[],itemsPerPage: number,page: number): PaginationResult {

    const pagination = useMemo(() => {
    const total = data.length;

    const pageCount = Math.ceil(total / itemsPerPage);

    const startIndex = (page - 1) * itemsPerPage;

    const currentBooks = data.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    return {
      currentBooks,
      total,
      pageCount,
      startIndex,
    };
  }, [data, itemsPerPage, page]);

  return pagination;
}