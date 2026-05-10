/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect, useCallback } from "react";
import { Box, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Typography, Paper, CircularProgress } from "@mui/material";
import { useFetch } from "../../../../../Hooks/useFetch";
import { GetBooks, CreateBook, UpdateBook, DeleteBook, GetBooksByCategory } from "../../../../../Api/modules/books";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Autocomplete } from "@mui/material";
import { Controller } from "react-hook-form";

import { useBooks } from "../../../../../Hooks/useBooks";
import { useFilters } from "../../../../../Hooks/useFilters";
import AdminBooksList from "../AdminBooksList/AdminBooksList";
import BooksToolbar from "../../../../Customer/BookModule/Components/BooksToolbar/BooksToolbar";
import BooksPagination from "../../../../Customer/BookModule/Components/BooksPagination/BooksPagination";
import BreadCrumbs from "../../../../Shared/Components/BreadCrumbs/BreadCrumbs";
import BooksFilter from "../../../../Customer/BookModule/Components/BooksFilter/BooksFilter";
import { useCategories } from "../../../../../Contexts/CategoriesContext";
import { CategoriesAPI } from "../../../../../Api";

// ✅ Book interface يدعم الـ field names من الـ API (image) والقديمة (img)
export interface Book {
  id: number;
  title: string;
  category: string;
  categoryName?: string;
  author: string;
  price: number;
  image: string;
  imagePath?: string;
  status: string;
  quantity: number;
  description?: string;
}


interface BookForm {
  title: string;
  author: string;
  category: string;
  price: string;
  status: string;
  quantity: string;
  description: string;
}

function BookDialog({
  open,
  onClose,
  onSubmitAction,
  initialData,
  title,
}: {
  open: boolean;
  onClose: () => void;
  onSubmitAction: (data: FormData) => void;
  initialData?: Partial<Book>;
  title: string;
}) {
  const { categories } = useCategories();
  const categoryOptions = categories.map((c) => c.name);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<BookForm>({
    defaultValues: {
      title: "",
      author: "",
      category: "",
      price: "",
      status: "available",
      quantity: "0",
      description: "",
    },
  });

  useEffect(() => {
    if (open) {
      const imgSrc = initialData?.image || null;
      setPreview(imgSrc);
      setSelectedFile(null);
      reset({
        title: initialData?.title || "",
        author: initialData?.author || "",
        category: initialData?.category || initialData?.categoryName || "",
        price: initialData?.price?.toString() || "",
        status: initialData?.status || "available",
        quantity: initialData?.quantity?.toString() || "0",
        description: initialData?.description || "",
      });
    }
  }, [open, initialData, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = (data: BookForm) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("author", data.author);
    formData.append("categoryName", data.category);
    formData.append("price", data.price);
    formData.append("quantity", data.quantity);
    formData.append("status", data.status);
    formData.append("description", data.description);
    if (selectedFile) formData.append("file", selectedFile);
    onSubmitAction(formData);
    reset();
    setPreview(null);
    setSelectedFile(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee" }}>
        <Typography fontWeight={700} fontSize={18}>{title}</Typography>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={3} mt={0}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField label="Title" placeholder="Enter Book Title" fullWidth error={!!errors.title} helperText={errors.title?.message} {...register("title", { required: "Title is required" })} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField label="Author" placeholder="Enter Author Name" fullWidth error={!!errors.author} helperText={errors.author?.message} {...register("author", { required: "Author is required" })} />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="category"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  options={categoryOptions}
                  value={value || null}
                  onChange={(_, newValue) => onChange(newValue ?? "")}
                  renderInput={(params) => (
                    <TextField {...params} label="Category" placeholder="Search or select" error={!!errors.category} helperText={errors.category?.message} />
                  )}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField label="Price" placeholder="Enter Price" type="number" fullWidth error={!!errors.price} helperText={errors.price?.message} {...register("price", { required: "Price is required" })} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField label="Quantity" placeholder="Enter Quantity" type="number" fullWidth error={!!errors.quantity} helperText={errors.quantity?.message} {...register("quantity", { required: "Quantity is required" })} />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField label="Description" placeholder="Enter Description" multiline rows={3} fullWidth error={!!errors.description} helperText={errors.description?.message} {...register("description")} />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block", fontWeight: 600 }}>
                Book Image
              </Typography>
              <input type="file" accept="image/*" style={{ display: "none" }} ref={fileInputRef} onChange={handleFileChange} />
              {!preview ? (
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<PhotoCameraIcon />}
                  onClick={() => fileInputRef.current?.click()}
                  sx={{ height: "56px", borderStyle: "dashed", color: "#ED553B", borderColor: "#ED553B", textTransform: "none", "&:hover": { borderStyle: "dashed", bgcolor: "rgba(237, 85, 59, 0.04)" } }}
                >
                  Upload Image
                </Button>
              ) : (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 1, border: "1px solid #eee", borderRadius: 1 }}>
                  <Box component="img" src={preview} sx={{ width: 40, height: 40, objectFit: "cover", borderRadius: 0.5 }} />
                  <Typography variant="body2" sx={{ flex: 1, color: "#666" }}>Image selected</Typography>
                  <IconButton size="small" onClick={() => fileInputRef.current?.click()} sx={{ color: "#F5A623" }}><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" onClick={removeImage} sx={{ color: "#e74c3c" }}><DeleteIcon fontSize="small" /></IconButton>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit(onSubmit)}
          sx={{ bgcolor: "#ED553B", "&:hover": { bgcolor: "#d94a2f" }, py: 1.5, fontWeight: 600 }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminBooks() {
  const [appliedCategory, setAppliedCategory] = useState<string>("");

  const { data: booksData, loading, refresh } = useFetch(
    () => appliedCategory 
      ? GetBooksByCategory(appliedCategory) 
      : GetBooks(), 
    [appliedCategory]
  );

  const { data: categoriesData } = useFetch(() => CategoriesAPI.GetCategories());
  const categoriesList = Array.isArray(categoriesData) ? categoriesData : (categoriesData as any)?.data || [];


  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const { filters, setPrice, toggleFilter, filteredBooks, applyFilters } = useFilters(booksData?? [] as any);
  const books = useBooks(filteredBooks as any, "admin-books-settings");

  const handleApplyFilters = useCallback(() => {
    const selectedCategoryName = filters.types.length > 0 ? filters.types[0] : "";
    setAppliedCategory(selectedCategoryName);
    applyFilters(); 
  }, [filters.types, applyFilters]);

  const handleAdd = async (formData: FormData) => {
    try {
      await CreateBook(formData);
      toast.success("Book created successfully!");
      refresh();
      setAddOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to create book");
    }
  };

  const handleEdit = async (formData: FormData) => {
    if (!selectedBook) return;
    try {
      await UpdateBook(selectedBook.id, formData);
      toast.success("Book updated successfully!");
      refresh();
      setEditOpen(false);
      setSelectedBook(null);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update book");
    }
  };

  const handleDelete = async () => {
    if (!selectedBook) return;
    try {
      await DeleteBook(selectedBook.id);
      toast.success("Book deleted successfully!");
      refresh();
      setDeleteOpen(false);
      setSelectedBook(null);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to delete book");
    }
  };

  const openEditDialog = (book: Book) => {
    setSelectedBook(book);
    setEditOpen(true);
  };

  const openDeleteDialog = (id: number) => {
    const book = booksData.find((b:any) => b.id === id);
    if (book) {
      setSelectedBook(book);
      setDeleteOpen(true);
    }
  };

if (loading && (!booksData || booksData.length === 0)) {
  return <Typography sx={{ p: 3 }}>Loading books...</Typography>;
}

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, px: 3, pt: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Books Management
          <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({booksData.length})
          </Typography>
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddOpen(true)}
          sx={{ bgcolor: "#ED553B", "&:hover": { bgcolor: "#d94a2f" }, textTransform: "none", fontWeight: 600 }}
        >
          Add New Book
        </Button>
      </Box>

      <Box sx={{ px: 3 }}><BreadCrumbs /></Box>

      <Grid container spacing={3} p={3}>
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
              <BooksFilter 
                filters={filters} 
                setPrice={setPrice} 
                toggleFilter={toggleFilter} 
                applyFilters={handleApplyFilters} 
                categories={categoriesList ? categoriesList.map((cat: any) => cat.name) : []}
              />
              <BooksToolbar
                view={books.view}
                setView={books.setView}
                sortBy={books.sortBy}
                setSortBy={books.setSortBy}
                itemsPerPage={books.itemsPerPage}
                setItemsPerPage={books.setItemsPerPage}
                total={books.total}
                startIndex={books.startIndex}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          {loading ? (
             <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size="3rem" sx={{ color: '#ED553B' }} />
             </Box>
          ) : (
            <AdminBooksList
              currentBooks={books.currentBooks as any}
              view={books.view}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <BooksPagination pageCount={books.pageCount} page={books.page} setPage={books.setPage} />
          </Box>
        </Grid>
      </Grid>

      {/* Dialogs */}
      <BookDialog open={addOpen} onClose={() => setAddOpen(false)} onSubmitAction={handleAdd} title="Add New Book" />
      {selectedBook && (
        <BookDialog
          key={selectedBook.id}
          open={editOpen}
          onClose={() => { setEditOpen(false); setSelectedBook(null); }}
          onSubmitAction={handleEdit}
          initialData={selectedBook}
          title="Edit Book"
        />
      )}

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete "{selectedBook?.title}"? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
