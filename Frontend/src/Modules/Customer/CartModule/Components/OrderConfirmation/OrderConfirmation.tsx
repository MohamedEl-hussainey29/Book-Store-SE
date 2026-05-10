import { useLocation } from "react-router-dom";
import BreadCrumbs from "../../../../Shared/Components/BreadCrumbs/BreadCrumbs";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Divider,
  Chip,
} from "@mui/material";

interface Book {
  id: number;
  title: string;
  author: string;
  image: string;
  price: number;
}

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  subtotal: number;
  book: Book;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  image: string;
}

interface Order {
  id: number;
  date: string;
  status: string;
  total: number;
  user: User;
  orderItems: OrderItem[];
}


export default function OrderConfirmation() {

  const location = useLocation();
  const order = location.state?.order as Order;
  
  return (
    <>
      <Box px={{ xs: 2, md: 4 }} pt={3}>
      <BreadCrumbs />
    </Box>
    <Box
      sx={{
        maxWidth: 1000,
        mx: "auto",
        py: 5,
        px: { xs: 2, md: 4 },
      }}
    >
      {/* HEADER */}
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 4,
          mb: 4,
          background:
            "linear-gradient(to right, #FFE5E5 , #F5FFFE)",
        }}
      >
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          justifyContent="space-between"
          spacing={3}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight="bold"
              color="#393280"
              mb={1}
            >
              Order Confirmation
            </Typography>

            <Typography color="#666">
              Order #{order.id}
            </Typography>

            <Typography color="#666">
              Date: {order.date}
            </Typography>
          </Box>

          <Chip
            label={order.status}
            sx={{
              alignSelf: {
                xs: "flex-start",
                md: "center",
              },
              bgcolor:
                order.status === "pending"
                  ? "#fff3cd"
                  : "#d4edda",
              color:
                order.status === "pending"
                  ? "#856404"
                  : "#155724",
              fontWeight: "bold",
              textTransform: "capitalize",
              px: 2,
            }}
          />
        </Stack>
      </Paper>

      {/* CUSTOMER INFO */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
          mb: 4,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          color="#393280"
          mb={3}
        >
          Customer Information
        </Typography>

        <Stack spacing={2}>
          <Typography>
            <strong>Name:</strong>{" "}
            {order.user.firstName}{" "}
            {order.user.lastName}
          </Typography>

          <Typography>
            <strong>Email:</strong>{" "}
            {order.user.email}
          </Typography>

          <Typography>
            <strong>Phone:</strong>{" "}
            {order.user.phoneNumber}
          </Typography>
        </Stack>
      </Paper>

      {/* ORDER ITEMS */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
          mb: 4,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          color="#393280"
          mb={4}
        >
          Order Items
        </Typography>

        <Stack spacing={3}>
          {order.orderItems.map((item) => (
            <Box
              key={item.id}
              sx={{
                border: "1px solid #eee",
                borderRadius: 3,
                p: 2,
              }}
            >
              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={3}
                alignItems={{
                  xs: "flex-start",
                  sm: "center",
                }}
              >
                {/* IMAGE */}
                <Box
                  component="img"
                  src={`/api/images/books/${item.book.image}`}
                  alt={item.book.title}
                  sx={{
                    width: 100,
                    height: 140,
                    objectFit: "cover",
                    borderRadius: 2,
                    boxShadow: 2,
                  }}
                />

                {/* DETAILS */}
                <Box flex={1}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="#393280"
                    mb={1}
                  >
                    {item.book.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="#777"
                    mb={1}
                  >
                    {item.book.author}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="#555"
                  >
                    Quantity: {item.quantity}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="#555"
                  >
                    Price: {item.price} EGP
                  </Typography>

                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    color="#ED553B"
                    mt={1}
                  >
                    Subtotal: {item.subtotal} EGP
                  </Typography>
                </Box>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Paper>

      {/* TOTAL */}
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 4,
        }}
      >
        <Stack spacing={2}>
          <Box
            display="flex"
            justifyContent="space-between"
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              color="#393280"
            >
              Total Amount
            </Typography>

            <Typography
              variant="h6"
              fontWeight="bold"
              color="#ED553B"
            >
              {order.total.toFixed(2)} EGP
            </Typography>
          </Box>

          <Divider />

          <Typography
            textAlign="center"
            color="#666"
            mt={2}
          >
            Thank you for your purchase ❤️
          </Typography>
        </Stack>
      </Paper>
    </Box>
    </>
  );
}