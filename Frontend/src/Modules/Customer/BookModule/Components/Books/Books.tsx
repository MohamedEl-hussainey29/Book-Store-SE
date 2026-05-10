import { useBooks } from "../../../../../Hooks/useBooks";
import { Box, CircularProgress, Grid } from "@mui/material";
import BooksList from '../BooksList/BooksList';
import BooksToolbar from '../BooksToolbar/BooksToolbar';
import BooksPagination from '../BooksPagination/BooksPagination';
import BreadCrumbs from '../../../../Shared/Components/BreadCrumbs/BreadCrumbs';
import BooksFilter from '../BooksFilter/BooksFilter';
import { useFilters } from '../../../../../Hooks/useFilters';
import { useFetch } from "../../../../../Hooks/useFetch";
import { BooksAPI, CategoriesAPI } from "../../../../../Api";
import { useState } from "react";

interface Book {
  id: number;
  title: string;
  category: string;
  author: string;
  price: number;
  image: string;
  status: string;
  description: string;
}

interface Category {
  id: number;
  image: string;
  name: string;
}

export default function Books() {
  const [appliedCategory, setAppliedCategory] = useState<string>("");

  const { data: allBooks, loading } = useFetch<Book[]>(
    () => appliedCategory 
      ? BooksAPI.GetBooksByCategory(appliedCategory) 
      : BooksAPI.GetBooks(),[appliedCategory]);

  const { data: categories } = useFetch<Category[]>(
    () => CategoriesAPI.GetCategories()
  );

  const { filters, setPrice, toggleFilter, applyFilters, filteredBooks } = useFilters(allBooks ?? []);

  const books = useBooks(filteredBooks, "booksSettings");

  const handleApplyFilters = () => {
    const selectedCategoryName = filters.types.length > 0 ? filters.types[0] : "";
    setAppliedCategory(selectedCategoryName);
    applyFilters(); 
  };

  return (
    <>
      <Box>
        <BreadCrumbs />
      </Box>
      <Box p={3}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 3 }}>
           <BooksFilter 
              filters={filters} 
              setPrice={setPrice} 
              toggleFilter={toggleFilter} 
              applyFilters={handleApplyFilters} // Calls the combined handler
              categories={categories ? categories.map(cat => cat.name) : null} 
            />
          </Grid>

          <Grid size={{ xs: 12, md: 9 }}>
            <BooksToolbar {...books} />
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size="3rem" aria-label="Loading…" />
              </Box>
            ) : (
              <BooksList {...books} />
            )}
            <BooksPagination {...books} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}