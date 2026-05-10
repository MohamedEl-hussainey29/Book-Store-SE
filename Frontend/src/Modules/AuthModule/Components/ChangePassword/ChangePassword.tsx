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
import { passwordValidation } from "../../../../Constants/VALIDATIONS";
import { AuthAPI } from "../../../../Api";
import { useContext } from "react";
import { AuthContext } from "../../../../Contexts/AuthContext";

interface FormValues {
  oldPassword: string;
  newPassword: string;
}
export default function ChangePassword() {
  const navigate = useNavigate()
  const {userData}:any = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
  try {
    await AuthAPI.ChangePassword(userData.userId , data);
    toast.success("Password Changed Successfully!");
    navigate("/dashboard");
  } catch (error: any) {
    toast.error(error?.response?.data?.error);
  }
};

  return (
    <>
      <Box textAlign="start" mb={4}>
        <Typography variant="body1" color="textSecondary">
          Welcome Back!
        </Typography>
        <Typography variant="h4">Change your Password Easily!</Typography>
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ width: "100%", mt: 2 }}
      >

        {/* password */}
        <TextField
          sx={{ my: 2 }}
          id="password"
          type="password"
          label="Old Password"
          variant="outlined"
          fullWidth
          error={!!errors?.oldPassword}
          helperText={errors?.oldPassword?.message}
          {...register("oldPassword", passwordValidation)}
        />

        {/* new password */}
        <TextField
          sx={{ my: 2 }}
          id="password_new"
          type="password"
          label="New Password"
          variant="outlined"
          fullWidth
          error={!!errors?.newPassword}
          helperText={errors?.newPassword?.message}
          {...register("newPassword", passwordValidation)}
        />
        <Stack>
          <Button
            type="submit"
            color="warning"
            variant="contained"
            fullWidth
            sx={{ mt: 2, padding: "10px" }}
          >
            Save
          </Button>
        </Stack>
      </Box>
    </>
  );
}
