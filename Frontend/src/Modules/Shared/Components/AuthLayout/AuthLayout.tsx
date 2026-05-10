import { Box, Grid } from "@mui/material";
import Item from '@mui/material/Grid';
import authImage from '../../../../assets/Images/auth.jpg';
import { Outlet } from "react-router-dom";
import logo from '../../../../assets/Images/Logo.png'

export default function AuthLayout() {
  return (
    <>
      <Grid container justifyContent='center'>
        <Grid size={{sm: 12 , md: 6}} order={{xs: 2 , sm: 2 , md: 0}}>
            <Item><img src={authImage} alt='Book store image' className="w-100 vh-100"/></Item>
        </Grid>
        <Grid size={{sm: 12 , md: 6}} order={{xs: 1 , sm: 1 , md: 2}} sx={{my:5}}>
            <Box sx={{display: 'flex' , flexDirection: 'column' , justifyContent: 'center', alignItems: 'center'}}>
                <img src={logo} alt="logo"  className=" mt-2 mb-5"/>
                <Item sx={{width: '70%'}}><Outlet/></Item>
            </Box>
        </Grid>
      </Grid>
    </>
  )
}
