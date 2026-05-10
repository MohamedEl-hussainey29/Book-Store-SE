/* eslint-disable @typescript-eslint/no-explicit-any */
import { Grid } from "@mui/material";
import BookCard from "../BooksCard/BooksCard";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../../Contexts/AuthContext";
import { FavAPI } from "../../../../../Api";

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

interface BooksProps {
  view: string;
  currentBooks: Book[];
}

export default function BooksList({ currentBooks, view }:BooksProps) {
  const [favBooks, setFavBooks] = useState<Book[]>([]);
  const {userData}:any = useContext(AuthContext);

  useEffect(() => {
    const getMyFav = async () => {
      const id = userData?.userId;

      if (!id) return;

      try {
        const response = await FavAPI.GetFavourites(id);

        const extractedBooks = (response?.data || []).map(
          (item: any) => item.book
        );

        setFavBooks(extractedBooks);
      } catch (error) {
        console.log(error);
      }
    };

    getMyFav();
  }, [userData?.userId]);

  return (
    <Grid container spacing={3}>
      {currentBooks.map((book) => (
        <Grid
          key={book.id}
          size={view === "grid" ? { xs: 12, sm: 6, md: 4 } : 12}
        >
          <BookCard book={book} view={view} favBooks={favBooks} setFavBooks={setFavBooks}/>
        </Grid>
      ))}
    </Grid>
  );
}