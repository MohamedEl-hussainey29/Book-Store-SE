/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { useContext} from "react";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { AuthContext } from "../../../../../Contexts/AuthContext";
import { CartAPI, FavAPI } from "../../../../../Api";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { incrementCart } from "../../../../../redux/cartSlice";

interface Book{
    id: number;
    title: string;
    category: string;
    description: string;
    author: string;
    price: number;
    image: string;
    status: string;
    quantity?: number;
}
interface BookProps {
  book: Book
  mode?: "featured" | "details";
  favBooks: Book[];
  setFavBooks: React.Dispatch<React.SetStateAction<Book[]>>
}

export default function Book({ book, mode = "featured" , favBooks , setFavBooks}: BookProps) {
  const {userData}:any = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOutOfStock = book.status.toLowerCase() === "out of stock";
    const isFav = favBooks?.some(
  (favBook: any) => favBook.id === book.id
);

  const addToFav = async (userId?: number, bookId?: number) => {
  if (!userId || !bookId) return;

  try {
    const response = await FavAPI.AddToFavourites(userId, bookId);
    toast.success(`${response?.data?.book?.title} is Added To Favourites!`);
    setFavBooks((prev) => [...prev, book]);
  } catch (error) {
    const err = error as AxiosError<any>;
    toast.error(err.response?.data?.error || "Something went wrong");
  }
};

  const removeFav = async(userId:number , bookId:number)=>{
    try {
      await FavAPI.RemoveFromFavourites( userId , bookId);
      toast.success("Removed From Favourites!")
      setFavBooks((prev) =>
        prev.filter((favBook) => favBook.id !== book.id)
      );
    } catch (error) {
        const err = error as AxiosError<any>;
        toast.error(
          err.response?.data?.error || "Something went wrong"
        );
    }
  }


  const addToCart = async(userId:number , data:{bookId:number , quantity:number})=>{
      
      try {
        const response = await CartAPI.AddToCart(userId , data);
        dispatch(incrementCart({bookId: book?.id , quantity:1}))
        console.log(response)
        toast.success("Added to Cart Successfully")
      } catch (error) {
        const err = error as AxiosError<any>;
        toast.warning(
          err.response?.data?.error ||"Something went wrong");
      } 
    }
  return (
    <>
      <Grid container spacing={6} alignItems="center">
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            display: "flex",
            justifyContent: { xs: "center", md: "flex-start" },
          }}
          py={2}
        >
          <Paper
              elevation={6}
              sx={{
                width: 400,
                height: 600,
                overflow: "hidden",
                borderRadius: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 2,
                position: "relative",
                opacity: isOutOfStock ? 0.6 : 1,
              }}
            >
            <Box
              component="img"
              src={`/api/images/books/${book.image}`}
              alt={book.title}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              textAlign="center"
            />
            {isOutOfStock && (
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  backgroundColor: "#ED553B",
                  color: "#fff",
                  px: 2,
                  py: 0.5,
                  fontSize: "12px",
                  fontWeight: "bold",
                  borderRadius: "4px",
                  zIndex: 2,
                }}
              >
                Out of Stock
              </Box>
            )}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box textTransform="capitalize">
            <Typography variant="h3" color="#393280" fontWeight="600" mb={5}>
              {mode == 'featured'? "featured Book" : book.title}
            </Typography>

            <Box
              sx={{
                backgroundColor: "#ED553B",
                width: "100px",
                height: "2px",
                mt: 2,
              }}
            />

            <Typography
              variant="overline"
              color="#888888"
              display="block"
              mb={2}
            >
              by {book.author}
            </Typography>
            <Typography variant="h5" color="#393280" fontWeight="600">
              {mode == 'featured'? book.title : ""}
            </Typography>

            <Typography variant="body2" color="#7A7A7A" my={2}>
              {book.description}
            </Typography>

            <Typography variant="h6" color="#ED553B" mt={3}>
               {book.price.toFixed(2)} EGP
            </Typography>

            {mode === "details" && book.quantity !== undefined && (
              <>
                {userData?.role === "admin" && (
                  <Typography variant="body2" color="#7A7A7A" mt={1} sx={{ fontWeight: 'bold' }}>
                    Stock Quantity: {book.quantity} 
                  </Typography>
                )}
              </>
            )}
          </Box>

          <Box mt={{ xs: 3, md: 10 }}>
            {mode === "featured" && (
              <Button
                variant="outlined"
                sx={{
                  width: "100%",
                  color: "#393280",
                  borderColor: "#393280",
                  px: 3,
                  py: 1.5,
                }}
                endIcon={<ArrowForwardIcon />}
                onClick={()=>navigate(`/dashboard/books/${book.id}`)}
              >
                View More
              </Button>
            )}

            {mode === "details" && (
              <Button
                variant="outlined"
                disabled={isOutOfStock}
                sx={{
                  backgroundColor: isOutOfStock ? "#ccc" : "#ED553B",
                  color: "#FFF",
                  width: "100%",
                  py: 1.5,
                  border: 0,
                  borderRadius: 0,
                  textTransform: "uppercase",
                  fontWeight: "medium",
                  "&:hover": {
                    backgroundColor: isOutOfStock ? "#ccc" : "#d94a2f",
                  },
                }}
                onClick={()=>addToCart(userData?.userId , {bookId: book?.id , quantity:1})}
              >
                {isOutOfStock ? "Unavailable" : "Add To Cart"}
              </Button>
            )}

            <Button
                variant="outlined"
                onClick={isFav? () => removeFav(userData.userId, book.id) : () => addToFav(userData.userId, book.id)}
                sx={{
                  width: "100%",
                  py: 1.5,
                  borderColor: '#f52366',
                  borderRadius: 0,
                  textTransform: "uppercase",
                  fontWeight: "medium",
                  backgroundColor : isFav ? '#f52366' : '',
                  color : isFav ? '#FFF' : '#f52366', 
                  my:2
                }}
                startIcon={isFav ? <FavoriteIcon/> : <FavoriteBorderIcon/>}
              >
                {isFav ? "Remove from Wishlist": "Add To Wishlist"}
              </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
