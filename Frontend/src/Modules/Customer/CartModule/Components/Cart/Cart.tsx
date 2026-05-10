/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Divider,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import BreadCrumbs from "../../../../Shared/Components/BreadCrumbs/BreadCrumbs";
import { useContext, useEffect, useState } from "react";
import { CartAPI, OrdersAPI } from "../../../../../Api";
import { AuthContext } from "../../../../../Contexts/AuthContext";
import BookItem from "../BookItem/BookItem";
import { useDispatch } from "react-redux";
import { clearCart, decrementCart } from "../../../../../redux/cartSlice";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

interface CartItem {
  id: number;
  bookId: number;
  price: number;
  subtotal: number;
  quantity: number;
}
export default function Cart() {
  const navigate = useNavigate();
  const { userData }: any = useContext(AuthContext);
  const dispatch = useDispatch();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const getCartItems = async () => {
      const userId = userData?.userId;
      if (!userId) return;
      try {
        const response = await CartAPI.GetCart(userId);
        setCartItems(response?.data?.cartItems);
      } catch (error) {
        console.log(error);
      }
    };

    getCartItems();
  }, [userData?.userId]);

  const updateQuantity = async (userId: number,bookId: number,newQuantity: number,) => {
    if (newQuantity < 1) return;
    try {
      await CartAPI.UpdateQuantity(userId, bookId, {
        quantity: newQuantity,
      });

      setCartItems((prev) =>
        prev.map((item) =>
          item.bookId === bookId
            ? {
                ...item,
                quantity: newQuantity,
                subtotal: item.price * newQuantity,
              }
            : item,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const removeFromCart = async (userId: number, bookId: number) => {
    try {
      await CartAPI.RemoveItem(userId, bookId);
      toast.success("removed Successfully!");
      dispatch(decrementCart(bookId));
      setCartItems((prev) => prev.filter((item) => item?.bookId !== bookId));
    } catch (error) {
      const err = error as AxiosError<any>;
      toast.warning(err.response?.data?.error || "Something went wrong");
    }
  };

  const placeOrder = async(userId: number)=>{
    try {
      const response = await OrdersAPI.PlaceOrder(userId);
      dispatch(clearCart());
      navigate("/dashboard/cart/confirmation", {state: {order: response?.data}});
    } catch (error) {
      const err = error as AxiosError<any>;
      toast.warning(err.response?.data?.error || "Something went wrong");
    }
  }
  const total = cartItems.reduce((acc, item) => acc + item.subtotal, 0);

  const tax = total * 0.14;

  const finalTotal = total + tax;

  return (
    <>
      <Box px={{ xs: 2, md: 4 }} pt={3}>
        <BreadCrumbs />
      </Box>
      <Box
        sx={{ px: { xs: 2, md: 6 }, py: { xs: 3, md: 6 }, minHeight: "100vh" }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "2fr 1fr",
            },
            gap: 4,
            alignItems: "start",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              background: "linear-gradient(to right, #FFE5E5 , #F5FFFE)",
            }}
          >
            <Box
              sx={{
                p: 3,
                borderBottom: "1px solid #ddd",
              }}
            >
              <Typography variant="h5" fontWeight="bold" color="#393280">
                In Your Cart
              </Typography>
            </Box>
            <Stack spacing={0}>
              {cartItems.map((item) => (
                <Box
                  key={item?.id}
                  sx={{
                    p: { xs: 2, md: 3 },
                    borderBottom: "1px solid #e5e5e5",
                  }}
                >
                  <Stack
                    direction={{ xs: "column", lg: "row" }}
                    spacing={{ xs: 3, md: 4 }}
                    alignItems={{ xs: "flex-start", lg: "center" }}
                    justifyContent="space-between"
                  >
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      spacing={3}
                      alignItems={{ xs: "center", md: "center" }}
                      flex={1}
                      width="100%"
                    >
                      <Box width={{ xs: "100%", md: "auto" }}>
                        <BookItem bookId={item?.bookId} />
                      </Box>
                      <Box
                        sx={{
                          textAlign: {
                            xs: "center",
                            md: "left",
                          },
                          width: {
                            xs: "100%",
                            md: "auto",
                          },
                        }}
                      >
                        <Typography
                          variant="body1"
                          color="#666"
                          fontWeight={500}
                        >
                          Price: {item?.price} EGP
                        </Typography>

                        <Typography
                          variant="body1"
                          color="#666"
                          mt={1}
                          fontWeight={500}
                        >
                          Subtotal: {item?.subtotal} EGP
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      justifyContent={{
                        xs: "center",
                        lg: "flex-end",
                      }}
                      width={{
                        xs: "100%",
                        lg: "auto",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <IconButton
                          size="small"
                          sx={{
                            bgcolor: "#393280",
                            color: "#fff",
                            borderRadius: "6px 0 0 6px",
                            width: 40,
                            height: 40,

                            "&:hover": {
                              bgcolor: "#2c2464",
                            },
                          }}
                          onClick={() =>
                            updateQuantity(
                              userData?.userId,
                              item?.bookId,
                              item.quantity - 1,
                            )
                          }
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>

                        <Box
                          sx={{
                            px: 3,
                            height: 40,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid #ddd",
                            bgcolor: "#fff",
                            fontWeight: "bold",
                            color: "#393280",
                            minWidth: 50,
                          }}
                        >
                          {item?.quantity}
                        </Box>

                        <IconButton
                          size="small"
                          sx={{
                            bgcolor: "#393280",
                            color: "#fff",
                            borderRadius: "0 6px 6px 0",
                            width: 40,
                            height: 40,

                            "&:hover": {
                              bgcolor: "#2c2464",
                            },
                          }}
                          onClick={() =>
                            updateQuantity(
                              userData?.userId,
                              item?.bookId,
                              item.quantity + 1,
                            )
                          }
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      {/* DELETE */}
                      <IconButton
                        sx={{
                          border: "1px solid #393280",
                          borderRadius: 2,
                          color: "#393280",
                          width: 42,
                          height: 42,

                          "&:hover": {
                            bgcolor: "#393280",
                            color: "#fff",
                          },
                        }}
                        onClick={() =>
                          removeFromCart(userData?.userId, item?.bookId)
                        }
                      >
                        <CloseIcon />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Paper>
          <Box>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                mb: 4,
                background: "linear-gradient(to right, #FFE5E5 , #F5FFFE)",
              }}
            >
              <Box
                sx={{
                  p: 3,
                  borderBottom: "1px solid #ddd",
                }}
              >
                <Typography variant="h5" fontWeight="bold" color="#393280">
                  Cart Total Cost
                </Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontWeight="bold" color="#393280">
                      Total
                    </Typography>

                    <Typography fontWeight="bold" color="#393280">
                      {total.toFixed(2)} EGP
                    </Typography>
                  </Box>
                  <Divider />
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontWeight="bold" color="#393280">
                      Tax
                    </Typography>
                    <Typography fontWeight="bold" color="#393280">
                      {tax.toFixed(2)} EGP
                    </Typography>
                  </Box>
                  <Divider />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" fontWeight="bold" color="#393280">
                      Total Cost
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="#393280">
                      {finalTotal.toFixed(2)} EGP
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Paper>
            {cartItems.length > 0 ?
              <Button
                fullWidth
                variant="contained"
                endIcon={<ShoppingCartCheckoutIcon />}
                sx={{
                  bgcolor: "#f2543d",
                  py: 2,
                  borderRadius: 2,
                  fontWeight: "bold",
                  letterSpacing: 2,
                  "&:hover": {
                    bgcolor: "#d94732",
                  },
                }}
                onClick={()=>placeOrder(userData?.userId)}
              >
                Proceed
              </Button>
              : <></>
            }
          </Box>
        </Box>
      </Box>
    </>
  );
}
