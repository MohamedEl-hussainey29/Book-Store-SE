/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from 'swiper/modules';
import '../../../../../../node_modules/swiper/swiper-bundle.css';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from "react-router-dom";
import BookCard from "../../../BookModule/Components/BooksCard/BooksCard";
import { useFetch } from "../../../../../Hooks/useFetch";
import { BooksAPI, FavAPI } from "../../../../../Api";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../../Contexts/AuthContext";

interface Book {
  id: number;
  title: string;
  category: string;
  author: string;
  price: number;
  image: string;
  status: string;
  description: string
}

export default function NewRelease() {
    const navigate = useNavigate();
    const { data: books, loading } = useFetch<Book[]>(
          () => BooksAPI.GetBooks()
    );

     const {userData}:any = useContext(AuthContext);
      const [favBooks , setFavBooks] = useState<Book[]>([]);
    
      
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
    <>
      <Box sx={{ backgroundColor: "#FCECEC", overflowX: "hidden" }}>
            <Stack py={8} textAlign="center">
            <Typography variant="overline" color="#7A7A7A">
                some quality items
            </Typography>

            <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
                <Box flex={1} height="1px" bgcolor="#E0E0E0" />
                <Typography variant="h3" fontWeight="bold" color="#393280" textTransform='capitalize'>
                new release books
                </Typography>
                <Box flex={1} height="1px" bgcolor="#E0E0E0" />
            </Box>
            </Stack>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size="3rem" aria-label="Loading…" />
                </Box>
            ) : (
                <Swiper
                slidesPerView= {1}
                spaceBetween={20}
                breakpoints={{
                    600: { slidesPerView: 2 },
                    900: { slidesPerView: 3 },
                    1200: { slidesPerView: 4 },
                }}
                pagination={{ clickable: true }}
                modules={[Pagination]}
                className="mySwiper"
                >
                {books?.slice(0, 10).map((book) => (
                    <SwiperSlide key={book.id}>
                        <BookCard book={book} view={'grid'} favBooks={favBooks} setFavBooks={setFavBooks}/>
                    </SwiperSlide>
                ))}
                    <Box flex={1} height="1px" bgcolor="#E0E0E0" mt={4} mb={6}/>
                </Swiper>
            )}
            <Box p={1} display='flex' justifyContent='flex-end'>
                    <Button 
                        endIcon={<ArrowForwardIcon />} 
                        sx={{color:"#ED553B",fontWeight:'bold'}}
                        onClick={()=>navigate('/dashboard/books')}
                    >
                        View All Products
                    </Button>
            </Box>
        </Box>
    </>
  );
}
