import { Box, Button, CircularProgress, Container, IconButton, Stack, Typography } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import '../../../../../../node_modules/swiper/swiper-bundle.css';
import { CategoriesAPI } from "../../../../../Api";
import { useFetch } from "../../../../../Hooks/useFetch";
import { useNavigate } from "react-router-dom";

interface Category {
  id: number;
  image: string;
  name: string;
}

export default function HomeCateg() {
  const navigate = useNavigate();

    const { data: categories, loading } = useFetch<Category[]>(
      () => CategoriesAPI.GetCategories()
    );
    
  return (
    <>
      <Box sx={{ py: 2 }}>
      <Container>
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          alignItems="flex-end" 
          sx={{ mb: 4 }}
        >
          <Box>
            <Stack direction='row' justifyContent='start' alignItems='center' spacing={1}>
              <Box sx={{width:'30px' , height:'2px' , backgroundColor:'#ED553B'}}></Box>
              <Typography variant="caption" color="#ED553B" fontWeight='bold'>Categories</Typography>
            </Stack>
            <Typography variant="h5" fontWeight='bold' color="#393280">Explore our Top Categories</Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <IconButton 
              className="prev-btn"
              sx={{ 
                border: '1px solid #ED553B', 
                color: '#ED553B',
                '&.swiper-button-disabled': { opacity: 0.5, borderColor: '#ccc' } 
              }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <IconButton 
              className="next-btn" 
              sx={{ 
                border: '1px solid #ED553B', 
                backgroundColor: 'transparent',
                color: '#ED553B',
                '&.swiper-button-disabled': { opacity: 0.5, borderColor: '#ccc' }
              }}
            >
              <ArrowForwardIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
        <Box>
          {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size="3rem" aria-label="Loading…" />
              </Box>
            ) : (
              <Swiper
                slidesPerView={1}
                spaceBetween={10}
                observer={true}
                observeParents={true}
                navigation={{
                  prevEl: '.prev-btn',
                  nextEl: '.next-btn',
                  disabledClass: 'swiper-button-disabled'
                }}
                breakpoints={{
                  600: { slidesPerView: 2, spaceBetween: 20 },
                  900: { slidesPerView: 3, spaceBetween: 30 },
                }}
                modules={[Navigation]}
                className="mySwiper"
              >
                {/* The ?. check fixes the 'possibly null' error */}
                {categories?.map((categ) => (
                  <SwiperSlide key={categ.id}>
                    <Stack direction='column' spacing={2} textAlign='center'>
                      <img 
                        src={`/api/images/categories/${categ.image}`} 
                        alt={categ.name} 
                        style={{ 
                          width: '100%', 
                          aspectRatio: '12/7',
                          objectFit: 'cover', 
                          borderRadius: '10px', 
                          display: 'block' 
                        }} 
                      />
                      <Typography variant="h6" color="#393280">{categ.name}</Typography>
                    </Stack>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
        </Box>
        <Box textAlign='center' my={4}>
          <Button variant='outlined' 
            sx={{color:'#393280' , borderColor: '#393280',px:3, py:1.5 , fontWeight:'normal'}}
            onClick={()=>navigate('/dashboard/books')} 
            endIcon={<ArrowForwardIcon />}>
              view more
          </Button>
        </Box>
      </Container>
    </Box>
    </>
  )
}