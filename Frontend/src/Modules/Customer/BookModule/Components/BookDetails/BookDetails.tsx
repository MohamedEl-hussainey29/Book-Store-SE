/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from 'react-router-dom';
import Book from '../Book/Book';
import NotFound from '../../../../Shared/Components/NotFound/NotFound';
import { Box, Container } from '@mui/material';
import { BooksAPI, FavAPI } from '../../../../../Api';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../../../Contexts/AuthContext';

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

export default function BookDetails() {
    const { bookId } = useParams();
    const [book , setBook] = useState(null);
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

    useEffect(()=>{
      const getBook = async()=>{
        try {
          const response = await BooksAPI.GetBookById(bookId);
          setBook(response?.data);
        } catch (error) {
          console.log(error)
        }
      }
      getBook()
    }, [bookId])
  if(!book) return <NotFound/>

  return (
    <>
      <Box py={3}>
        <Container>
            <Book book={book} mode="details" favBooks={favBooks} setFavBooks={setFavBooks}/>
        </Container>
      </Box>
    </>
  )
}
