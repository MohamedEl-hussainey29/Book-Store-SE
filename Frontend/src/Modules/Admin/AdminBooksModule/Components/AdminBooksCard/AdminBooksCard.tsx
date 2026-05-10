import { Box, Typography, Button, Stack, Paper, IconButton, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Book } from "../AdminBooks/AdminBooks";

interface AdminBooksCardProps {
  view: string;
  book: Book;
  onDelete: (id: number) => void;
  onEdit: (book: Book) => void;
}

export default function AdminBooksCard({ book, view, onDelete, onEdit }: AdminBooksCardProps) {
  const navigate = useNavigate();
  const isOutOfStock = book.status === "out of stock";

  return (
    <Box
      className="bookItem"
      sx={{
        display: "flex",
        flexDirection: view === "grid" ? "column" : "row",
        alignItems: view === "grid" ? "center" : "flex-start",
        gap: 2,
        p: view === "grid" ? 0 : 2,
        border: view === "grid" ? "none" : "1px solid #eee",
        borderRadius: 1,
        position: "relative",
      }}
    >
      {/* Image Container */}
      <Box
        sx={{
          width: view === "grid" ? "100%" : { xs: "150px", md: "200px" },
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: view === "grid" ? "80%" : "100%",
            aspectRatio: "2 / 3",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: view === "grid" ? 2 : 1,
            overflow: "hidden",
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
              cursor: "pointer",
            }}
            onClick={() => navigate(`/admin/books/${book.id}`)}
          />

          {/* Out of Stock Badge */}
          {isOutOfStock && (
            <Box
              sx={{
                position: "absolute",
                top: 10,
                left: 10,
                backgroundColor: "#ED553B",
                color: "#fff",
                px: 1.5,
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

          {/* Admin Action Buttons - shown on hover (same spot as Add to Cart was) */}
          <Box
            className="actionsBtn"
            sx={{
              position: "absolute",
              bottom: "10%",
              width: "100%",
              display: "flex",
              gap: 1,
              justifyContent: "center",
              px: 1,
            }}
          >
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => onEdit(book)}
                sx={{
                  bgcolor: "#fff",
                  boxShadow: 2,
                  color: "#F5A623",
                  "&:hover": { bgcolor: "#F5A623", color: "#fff" },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                sx={{
                  bgcolor: "#fff",
                  boxShadow: 2,
                  color: "#e74c3c",
                  "&:hover": { bgcolor: "#e74c3c", color: "#fff" },
                }}
                onClick={() => onDelete(book.id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>
      </Box>

      {/* Text Content */}
      <Box sx={{ flex: 1, textAlign: view === "grid" ? "center" : "left" }}>
        <Stack
          direction="column"
          spacing={1}
          alignItems={view === "grid" ? "center" : "flex-start"}
          mt={view === "grid" ? 2 : 0}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            color="#393280"
            textTransform="capitalize"
            fontSize={{ xs: "16px", md: "24px" }}
            sx={{ cursor: "pointer" }}
            onClick={() => navigate(`/admin/books/${book.id}`)}
          >
            {book.title}
          </Typography>

          <Typography variant="caption" color="#888888" textTransform="capitalize">
            {book.author}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Quantity: {book.quantity}
          </Typography>

          {view === "list" && (
            <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
              {book.description || "No description available for this book."}
            </Typography>
          )}

          <Typography variant="button" color="#ED553B" sx={{ fontSize: "1.1rem" }}>
            {book.price.toFixed(2)} EGP
          </Typography>

          {/* List view actions */}
          {view === "list" && (
            <Stack direction="row" spacing={1} mt={1}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => onEdit(book)}
                sx={{
                  color: "#F5A623",
                  borderColor: "#F5A623",
                  "&:hover": { bgcolor: "#F5A623", color: "#fff" },
                  fontSize: { xs: "12px", md: "14px" },
                }}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                startIcon={<DeleteIcon />}
                sx={{
                  color: "#e74c3c",
                  borderColor: "#e74c3c",
                  "&:hover": { bgcolor: "#e74c3c", color: "#fff" },
                  fontSize: { xs: "12px", md: "14px" },
                }}
                onClick={() => onDelete(book.id)}
              >
                Delete
              </Button>
              <Button
                variant="outlined"
                sx={{
                  color: "#393280",
                  borderColor: "#393280",
                  "&:hover": { borderColor: "#ED553B", color: "#ED553B" },
                  fontSize: { xs: "12px", md: "14px" },
                }}
                onClick={() => navigate(`/admin/books/${book.id}`)}
              >
                View Details
              </Button>
            </Stack>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
