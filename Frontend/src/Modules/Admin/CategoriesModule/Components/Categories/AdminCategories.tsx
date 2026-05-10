/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useRef, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, IconButton, Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { CreateCategory, UpdateCategory, DeleteCategory } from '../../../../../Api/modules/categories';
import { useCategories } from '../../../../../Contexts/CategoriesContext';

interface CategoryFormValues { name: string; }

function CategoryDialog({ open, onClose, onSubmitAction, initialData, title }: {
  open: boolean;
  onClose: () => void;
  onSubmitAction: (data: FormData) => void;
  initialData?: { id: number; name: string; image?: string };
  title: string;
}) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormValues>({
    defaultValues: { name: initialData?.name || '' }
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(initialData?.image || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (open) {
      reset({ name: initialData?.name || '' });
      setPreview(initialData?.image || null);
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

  const onSubmit = (data: CategoryFormValues) => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (selectedFile) formData.append('file', selectedFile);
    onSubmitAction(formData);
    reset();
    setPreview(null);
    setSelectedFile(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
        <Typography fontWeight={700} fontSize={18}>{title}</Typography>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3} mt={1}>
          <TextField
            label="Category Name"
            placeholder="Enter Category Name"
            fullWidth
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register('name', { required: 'Category name is required' })}
          />
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>
              Category Image
            </Typography>
            <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} />
            {!preview ? (
              <Button variant="outlined" fullWidth startIcon={<PhotoCameraIcon />} onClick={() => fileInputRef.current?.click()}
                sx={{ height: '56px', borderStyle: 'dashed', color: '#ED553B', borderColor: '#ED553B', textTransform: 'none' }}>
                Upload Image
              </Button>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                <Box component="img" src={preview} sx={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 0.5 }} />
                <Typography variant="body2" sx={{ flex: 1, color: '#666' }}>Image selected</Typography>
                <IconButton size="small" onClick={() => fileInputRef.current?.click()} sx={{ color: '#F5A623' }}><EditIcon fontSize="small" /></IconButton>
                <IconButton size="small" onClick={() => { setPreview(null); setSelectedFile(null); }} sx={{ color: '#e74c3c' }}><DeleteIcon fontSize="small" /></IconButton>
              </Box>
            )}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button variant="contained" fullWidth onClick={handleSubmit(onSubmit)}
          sx={{ bgcolor: '#ED553B', '&:hover': { bgcolor: '#d94a2f' }, py: 1.5, fontWeight: 700, textTransform: 'none', fontSize: 15 }}>
          {initialData ? 'Update Category' : 'Create Category'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function AdminCategories() {
  const { categories, refresh } = useCategories();
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const handleAdd = async (formData: FormData) => {
    try {
      await CreateCategory(formData);
      toast.success('Category created successfully!');
      refresh();
      setAddOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create category');
    }
  };

  const handleEdit = async (formData: FormData) => {
    if (selectedCategory) {
      try {
        await UpdateCategory(selectedCategory.id, formData);
        toast.success('Category updated successfully!');
        refresh();
        setEditOpen(false);
        setSelectedCategory(null);
      } catch (err: any) {
        toast.error(err.response?.data?.error || 'Failed to update category');
      }
    }
  };

  const handleDelete = async () => {
    if (selectedCategory) {
      try {
        await DeleteCategory(selectedCategory.id);
        toast.success('Category deleted successfully!');
        refresh();
        setDeleteOpen(false);
        setSelectedCategory(null);
      } catch (err: any) {
        toast.error(err.response?.data?.error || 'Failed to delete category');
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Categories
          <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({categories.length})
          </Typography>
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddOpen(true)}
          sx={{ bgcolor: '#ED553B', '&:hover': { bgcolor: '#d94a2f' }, textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>
          Add New Category
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid #eee' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#F4F6F8' }}>
              {['#', 'Category Image','Category Name', 'Books Count', 'Actions'].map((col) => (
                <TableCell key={col} sx={{ fontWeight: 700, color: '#2C3E50', fontSize: 13 }}>
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 5, color: '#888' }}>
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat: any, index: number) => (
                <TableRow key={cat.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                  <TableCell sx={{ fontSize: 13, color: '#555' }}>{index + 1}</TableCell>
                  <TableCell>
  <Box
    component="img"
    src={`/api/images/categories/${cat.image}`}
    alt={cat.name}
    sx={{
      width: 50,
      height: 50,
      objectFit: 'cover',
      borderRadius: 2,
      border: '1px solid #eee',
    }}
  />
</TableCell>
                  <TableCell sx={{ fontSize: 13, fontWeight: 500, textTransform: 'capitalize' }}>{cat.name}</TableCell>
                  <TableCell sx={{ fontSize: 13, color: '#888' }}>{cat.bookCount ?? 0} Books</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton size="small" sx={{ color: '#F5A623' }}
                        onClick={() => { setSelectedCategory(cat); setEditOpen(true); }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#e74c3c' }}
                        onClick={() => { setSelectedCategory(cat); setDeleteOpen(true); }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <CategoryDialog open={addOpen} onClose={() => setAddOpen(false)} onSubmitAction={handleAdd} title="Add New Category" />
      <CategoryDialog open={editOpen} onClose={() => { setEditOpen(false); setSelectedCategory(null); }}
        onSubmitAction={handleEdit} initialData={selectedCategory} title="Edit Category" />

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete "{selectedCategory?.name}"?</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
