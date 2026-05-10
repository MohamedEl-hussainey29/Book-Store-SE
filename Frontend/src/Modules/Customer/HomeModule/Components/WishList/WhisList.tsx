/* eslint-disable @typescript-eslint/no-explicit-any */
import BreadCrumbs from "../../../../Shared/Components/BreadCrumbs/BreadCrumbs";
import { Box, Grid } from "@mui/material";
import BooksToolbar from "../../../BookModule/Components/BooksToolbar/BooksToolbar";
import BooksList from "../../../BookModule/Components/BooksList/BooksList";
import BooksPagination from "../../../BookModule/Components/BooksPagination/BooksPagination";
import { useBooks } from "../../../../../Hooks/useBooks";
import { FavAPI } from "../../../../../Api";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../../Contexts/AuthContext";



export default function WhisList() {

  const {userData}:any = useContext(AuthContext);
  const [favBooks , setFavBooks] = useState([]);

  
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
  }, [userData?.userId , favBooks]);
  

    const books = useBooks(favBooks ?? [] , "favoritesBooksSettings");

  return (
    <>
      <Box>
        <BreadCrumbs/>
      </Box>
      <Box p={3}>
        <Grid container spacing={4}>
          <Grid size={{xs:12 , md:10}} mx='auto'>
            <BooksToolbar {...books} />
              <BooksList {...books} />
            <BooksPagination {...books} />
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
