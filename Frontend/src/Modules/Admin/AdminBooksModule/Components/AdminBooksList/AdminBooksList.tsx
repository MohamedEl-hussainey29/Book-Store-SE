import { Grid } from "@mui/material";
import AdminBooksCard from "../AdminBooksCard/AdminBooksCard";
import type { Book } from "../AdminBooks/AdminBooks";

interface AdminBooksListProps {
  view: string;
  currentBooks: Book[];
  onDelete: (id: number) => void;
  onEdit: (book: Book) => void;
}

export default function AdminBooksList({ currentBooks, view, onDelete, onEdit }: AdminBooksListProps) {
  return (
    <Grid container spacing={3}>
      {currentBooks.map((book) => (
        <Grid
          key={book.id}
          size={view === "grid" ? { xs: 12, sm: 6, md: 4 } : 12}
        >
          <AdminBooksCard book={book} view={view} onDelete={onDelete} onEdit={onEdit} />
        </Grid>
      ))}
    </Grid>
  );
}
