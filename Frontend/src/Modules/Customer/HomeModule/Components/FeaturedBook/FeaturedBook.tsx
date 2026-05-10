/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box,CircularProgress,Container,IconButton } from "@mui/material";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import '../../../../../../node_modules/swiper/swiper-bundle.css';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Book from "../../../BookModule/Components/Book/Book";
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
  description: string;
}

export default function FeaturedBook() {

    const { data: books, loading } = useFetch<Book[]>(
              () => BooksAPI.GetBooks()
    );

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
    <>
    <Box className='bookBg' py={3} my={3}>
        <Container sx={{ position: 'relative' }}> 
             {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size="3rem" aria-label="Loading…" />
                </Box>
            ) : (
                <Swiper
                    spaceBetween={30}
                    centeredSlides={false}
                    loop={true}
                    autoplay={{ delay: 3500, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    navigation={{
                        prevEl: '.prev-btn',
                        nextEl: '.next-btn',
                    }}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="mySwiper"
                    style={{ paddingBottom: '50px' }}
                >
                    {books?.slice(0,5).map((book)=>(
                        <SwiperSlide key={book.id}>
                            <Book book={book} mode="featured" favBooks={favBooks} setFavBooks={setFavBooks}/>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
            <IconButton 
            className="prev-btn" 
            sx={{ 
                position: 'absolute', 
                left: { xs: 0, md: -100 },
                top: '50%', 
                transform: 'translateY(-50%)', 
                zIndex: 10,
                border: '1px solid #ED553B', 
                color: '#ED553B', 
                bgcolor: 'white',
                display: { xs: 'none', xl: 'inline-flex' },
            }}
            >
                <ArrowBackIcon />
            </IconButton>

            <IconButton 
            className="next-btn" 
            sx={{ 
                position: 'absolute', 
                right: { xs: 0, md: -100 }, 
                top: '50%', 
                transform: 'translateY(-50%)', 
                zIndex: 10,
                border: '1px solid #ED553B', 
                color: '#ED553B', 
                bgcolor: 'white',
                display: { xs: 'none', xl: 'inline-flex' },
            }}
            >
                <ArrowForwardIcon />
            </IconButton>
        </Container>
    </Box>
      
    </>
  )
}