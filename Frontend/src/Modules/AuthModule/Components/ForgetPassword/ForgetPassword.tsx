/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { emailValidation } from "../../../../Constants/VALIDATIONS";
import { AuthAPI } from "../../../../Api";

interface FormValues {
  email: string;
}
export default function ForgetPassword() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async(data: FormValues) => {
    try {
      const response = await AuthAPI.ForgetPassword(data);
      toast.success(response?.data?.message);
      navigate('/reset')
    } catch (error:any) {
      toast.error(error?.response?.data?.error)
    }
  };

  return (
    <>
      <Box textAlign="start" mb={4}>
        <Typography variant="body1" color="textSecondary">
          Welcome Back!
        </Typography>
        <Typography variant="h4">Forget Password!</Typography>
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
        <Stack direction="column">
          <Button
            variant="outlined"
            type="submit"
            fullWidth
            sx={{
              mt: 4,
              padding: "10px",
              color: "#6251DD",
              borderColor: "#6251DD",
            }}
          >
            Send
          </Button>
        </Stack>
      </Box>
    </>
  );
}
