/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NotFound from '../../../../Shared/Components/NotFound/NotFound.tsx';
import { Box, Container, Grid, Paper, Typography, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, CircularProgress } from '@mui/material';
import BreadCrumbs from '../../../../Shared/Components/BreadCrumbs/BreadCrumbs.tsx';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useFetch } from '../../../../../Hooks/useFetch.ts';
import { GetBookById, UpdateBook, DeleteBook } from '../../../../../Api/modules/books.ts';
import { Autocomplete } from "@mui/material";
import { useCategories } from "../../../../../Contexts/CategoriesContext";

// ✅ Book interface (Matches AdminBooks.tsx)
export interface Book {
  id: number;
  title: string;
  category: string;
  categoryName?: string;
  author: string;
  price: number;
  img: string;       
  image?: string;    
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

function BookEditDialog({ open, onClose, onSubmitAction, initialData }: { 
  open: boolean; 
  onClose: () => void; 
  onSubmitAction: (data: FormData) => void; 
  initialData: Book;
}) {
  const { categories } = useCategories();
  const categoryOptions = categories.map((c) => c.name);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<BookForm>();

  useEffect(() => {
    if (open && initialData) {
      reset({
        title: initialData.title || "",
        author: initialData.author || "",
        category: initialData.category || initialData.categoryName || "",
        price: initialData.price?.toString() || "",
        status: initialData.status || "available",
        quantity: initialData.quantity?.toString() || "0",
        description: initialData.description || "",
      });
      setPreview(initialData.img || null);
      setSelectedFile(null);
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
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee" }}>
        <Typography fontWeight={700} fontSize={18}>Edit Book</Typography>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={3} mt={0}>
          <Grid size={{ xs: 12, md: 6 }}><TextField label="Title" fullWidth error={!!errors.title} helperText={errors.title?.message} {...register("title", { required: "Title is required" })} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><TextField label="Author" fullWidth {...register("author", { required: "Author is required" })} /></Grid>
          
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

          <Grid size={{ xs: 12, md: 6 }}><TextField label="Price" type="number" fullWidth {...register("price", { required: "Price is required" })} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><TextField label="Quantity" type="number" fullWidth {...register("quantity", { required: "Quantity is required" })} /></Grid>

          <Grid size={{ xs: 12 }}>
            <TextField label="Description" multiline rows={3} fullWidth {...register("description")} />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>
                Book Image
              </Typography>
              <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} />
              
              {!preview ? (
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<PhotoCameraIcon />} 
                  onClick={() => fileInputRef.current?.click()}
                  sx={{ 
                    height: '56px', 
                    borderStyle: 'dashed', 
                    color: '#ED553B', 
                    borderColor: '#ED553B',
                    textTransform: 'none',
                    '&:hover': { borderStyle: 'dashed', bgcolor: 'rgba(237, 85, 59, 0.04)' }
                  }}
                >
                  Upload Image
                </Button>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                  <Box component="img" src={preview} sx={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 0.5 }} />
                  <Typography variant="body2" sx={{ flex: 1, color: '#666' }}>Image selected</Typography>
                  <IconButton size="small" onClick={() => fileInputRef.current?.click()} sx={{ color: '#F5A623' }}><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" onClick={removeImage} sx={{ color: '#e74c3c' }}><DeleteIcon fontSize="small" /></IconButton>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button variant="contained" fullWidth onClick={handleSubmit(onSubmit)} sx={{ bgcolor: "#ED553B", "&:hover": { bgcolor: "#d94a2f" }, py: 1.5, fontWeight: 600 }}>Save Changes</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function AdminBookDetails() {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const { data: bookData, loading, refresh } = useFetch(() => GetBookById(bookId), [bookId]);
    
  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress sx={{ color: '#ED553B' }} />
    </Box>
  );

  if(!bookData) return <NotFound/>

  const isOutOfStock = bookData.status?.toLowerCase() === "out of stock" || bookData.quantity === 0;

  const onEditSubmit = async (formData: FormData) => {
    try {
      await UpdateBook(bookData.id, formData);
      toast.success("Book updated successfully!");
      refresh();
      setEditOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update book");
    }
  };

  const onDeleteConfirm = async () => {
    try {
      await DeleteBook(bookData.id);
      toast.success("Book deleted successfully!");
      navigate('/admin/books');
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete book");
    }
  };

  return (
    <>
      <Box sx={{ px: 3, pt: 3 }}><BreadCrumbs /></Box>
      <Box py={3}>
        <Container>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/admin/books')}
            sx={{ mb: 4, color: '#393280', fontWeight: 600, textTransform: 'none' }}
          >
            Back to Books
          </Button>

          <Grid container spacing={6} alignItems="center">
            <Grid
              size={{ xs: 12, md: 6 }}
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "flex-start" },
              }}
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
                  src={`/api/images/books/${bookData.image}`}
                  alt={bookData.title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
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
                  {bookData.title}
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
                  mt={2}
                >
                  by {bookData.author}
                </Typography>

                <Typography variant="body2" color="#7A7A7A" my={2}>
                  {bookData.description || "No description available for this book."}
                </Typography>

                <Typography variant="h6" color="#ED553B" mt={3}>
                  {Number(bookData.price).toFixed(2)} EGP
                </Typography>

                <Typography variant="body1" color="#393280" mt={2} fontWeight="600">
                  Available Quantity: {bookData.quantity}
                </Typography>
                
                <Typography variant="body2" color="#393280" mt={1}>
                  Category: {bookData.categoryName || bookData.category}
                </Typography>
                
                <Typography variant="body2" color="#393280" mt={1}>
                  Status: {bookData.status}
                </Typography>
              </Box>

              <Box mt={{ xs: 3, md: 10 }}>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => setEditOpen(true)}
                    sx={{
                      backgroundColor: "#ED553B",
                      color: "#FFF",
                      flex: 1,
                      py: 1.5,
                      border: 0,
                      borderRadius: 1,
                      textTransform: "uppercase",
                      fontWeight: "medium",
                      "&:hover": {
                        backgroundColor: "#d94a2f",
                      },
                    }}
                  >
                    Edit Book
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={() => setDeleteOpen(true)}
                    sx={{
                      color: "#e74c3c",
                      borderColor: "#e74c3c",
                      flex: 1,
                      py: 1.5,
                      borderRadius: 1,
                      textTransform: "uppercase",
                      fontWeight: "medium",
                      "&:hover": {
                        borderColor: "#c0392b",
                        bgcolor: 'rgba(231, 76, 60, 0.05)'
                      }
                    }}
                  >
                    Delete Book
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <BookEditDialog 
        open={editOpen} 
        onClose={() => setEditOpen(false)} 
        onSubmitAction={onEditSubmit} 
        initialData={bookData} 
      />

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete "{bookData.title}"? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button onClick={onDeleteConfirm} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

