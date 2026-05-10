/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  Checkbox,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { emailValidation, passwordValidation } from "../../../../Constants/VALIDATIONS";
import { AuthAPI } from "../../../../Api";
import { useContext } from "react";
import { AuthContext } from "../../../../Contexts/AuthContext";

interface FormValues {
  email: string;
  password: string;
}
export default function Login() {
  
  const navigate = useNavigate()
  const {saveUserData}:any = useContext(AuthContext)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async(data: FormValues) => {
    try {
      const response = await AuthAPI.Login(data);
      const token = response?.data?.token;
      const userRole = response?.data?.role;

      localStorage.setItem('userToken', token);
      saveUserData(); 
      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      toast.success("Logged in!");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Login Failed");
    }
};

  return (
    <>
      <Box textAlign="start" mb={4}>
        <Typography variant="body1" color="textSecondary">
          Welcome Back!
        </Typography>
        <Typography variant="h4">Login to your Account</Typography>
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ width: "100%", mt: 2 }}
      >
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

        <Grid
          container
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack
            direction="row"
            display="flex"
            alignItems="center"
            sx={{ color: "#6251DD" }}
          >
            <Checkbox sx={{ color: "#6251DD" }} />
            <Typography variant="body2">Remember me</Typography>
          </Stack>
          <Stack>
            <Link to="/forget" style={{ color: "#6251DD" , textDecoration: 'none'}}>
              Forget Password
            </Link>
          </Stack>
        </Grid>
        <Stack direction="column">
          <Button
            type="submit"
            color="warning"
            variant="contained"
            fullWidth
            sx={{ mt: 2, padding: "10px" }}
          >
            Login
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
            onClick={()=>navigate('/register')}
          >
            Register
          </Button>
        </Stack>
      </Box>
    </>
  );
}
