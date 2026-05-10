/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  FormControl,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { emailValidation, passwordValidation } from "../../../../Constants/VALIDATIONS";
import { AuthAPI } from "../../../../Api";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
}
export default function Register() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async(data: FormValues) => {
    try {
      await AuthAPI.Register(data)
      toast.success("User Created Successfully!");
      navigate('/login')
    } catch (error:any) {
      const msg = error.response?.data?.error || "Registration failed!";
      toast.error(msg)
    }
  };

  return (
    <>
      <Box textAlign="start" mb={2}>
        <Typography variant="body1" color="textSecondary">
          Create new account
        </Typography>
        <Typography variant="h4">Register</Typography>
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ width: "100%", mt: 2 }}
      >
          <Grid container spacing={2} sx={{my:2}}>
            {/* First Name */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                id="first_name"
                type="text"
                label="First Name"
                variant="outlined"
                fullWidth
                error={!!errors?.firstName}
                helperText={errors?.firstName?.message}
                {...register("firstName", {required: "First Name is required!" })}
              />
            </Grid>

            {/* Last Name */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                id="last_name"
                type="text"
                label="Last Name"
                variant="outlined"
                fullWidth
                error={!!errors?.lastName}
                helperText={errors?.lastName?.message}
                {...register("lastName", {required: "Last Name is required!" })}
              />
            </Grid>
          </Grid>
          
          {/* email */}
          <TextField
            id="email"
            type="email"
            label="Email"
            variant="outlined"
            fullWidth
            error={!!errors?.email}
            helperText={errors?.email?.message}
            {...register("email", emailValidation)}
          />

          {/* password */}
          <TextField
            sx={{ my: 2 }}
            id="password"
            type="password"
            label="password"
            variant="outlined"
            fullWidth
            error={!!errors?.password}
            helperText={errors?.password?.message}
            {...register("password", passwordValidation)}
          />

          {/* role */}
          <FormControl fullWidth>
            <TextField
              id="phone_number"
              type="text"
              label="Phone Number"
              variant="outlined"
              fullWidth
              error={!!errors?.phoneNumber}
              helperText={errors?.phoneNumber?.message}
              {...register("phoneNumber", {required: "Phone Number is required!" })}
            />
          </FormControl>

          <Stack direction="column">
            <Button
              type="submit"
              color="warning"
              variant="contained"
              fullWidth
              sx={{ mt: 2, padding: "10px" }}
            >
              Register
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                mt: 2,
                padding: "10px",
                color: "#6251DD",
                borderColor: "#6251DD",
              }}
              onClick={()=>navigate('/login')}
            >
              Login
            </Button>
          </Stack>
      </Box>
    </>
  );
}
