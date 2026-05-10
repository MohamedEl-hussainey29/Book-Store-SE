import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useForm } from 'react-hook-form';
import { useEffect, useState, useRef } from 'react';

export interface AdminFormValues {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  phone: string;
  password?: string;
  img?: string;
}

interface AdminFormProps {
  open: boolean;
  onClose: () => void;
  onSubmitAction: (admin: AdminFormValues) => void;
  initialData?: Partial<AdminFormValues>;
  title: string;
}

export default function AdminForm({ open, onClose, onSubmitAction, initialData, title }: AdminFormProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminFormValues>({
    defaultValues: initialData
  });

  useEffect(() => {
    if (open) {
      reset(initialData || {
        firstName: '',
        lastName: '',
        email: '',
        age: '',
        phone: '',
        password: '',
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreview(initialData?.img || null);
    }
  }, [open, initialData, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

const onSubmit = (data: AdminFormValues) => {
    onSubmitAction({ ...data, ...(preview && { img: preview })});
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #eee',
          pb: 1,
        }}
      >
        <Typography fontWeight={700} fontSize={18}>
          {title}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={3} mt={0}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="First Name"
              placeholder="Enter First Name"
              fullWidth
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              {...register('firstName', { required: 'First Name is required' })}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Last Name"
              placeholder="Enter Last Name"
              fullWidth
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              {...register('lastName', { required: 'Last Name is required' })}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Email"
              type="email"
              placeholder="Enter Email"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
              })}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Phone Number"
              placeholder="Enter Phone Number"
              fullWidth
              {...register('phone')}
            />
          </Grid>

          {!initialData && (
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Password"
                type="password"
                placeholder="Enter Password"
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register('password', { required: 'Password is required' })}
              />
            </Grid>
          )}

          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>
                Profile Image
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
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit(onSubmit)}
          sx={{
            bgcolor: '#ED553B',
            '&:hover': { bgcolor: '#ED553B' },
            py: 1.5,
            fontWeight: 600,
            fontSize: 15,
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
