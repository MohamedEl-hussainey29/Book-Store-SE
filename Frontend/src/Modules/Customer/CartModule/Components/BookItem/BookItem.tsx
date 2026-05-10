import { Box, Paper, Stack, Typography } from "@mui/material";
import { BooksAPI } from "../../../../../Api";
import { useFetch } from "../../../../../Hooks/useFetch";
import { useNavigate } from "react-router-dom";

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

interface BookItemProps {
  bookId: number;
}

export default function BookItem({ bookId }: BookItemProps) {
  const navigate = useNavigate();
  const { data: book } = useFetch<Book>(
    () => BooksAPI.GetBookById(bookId),
    [bookId],
  );

  if (!book) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
        width="100%"
      >
        <Paper
          elevation={6}
          sx={{
            width: { xs: 120, sm: 90 },
            height: { xs: 170, sm: 130 },
            borderRadius: 2,
            boxShadow: 2,
            flexShrink: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            p: 1,
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
              cursor: "pointer",
              display: "block",
            }}
            onClick={() => navigate(`/dashboard/books/${book.id}`)}
          />
        </Paper>

        <Typography
          variant="h6"
          fontWeight="bold"
          color="#393280"
          textAlign={{ xs: "center", sm: "left" }}
        >
          {book.title}
        </Typography>
      </Stack>
    </>
  );
}
