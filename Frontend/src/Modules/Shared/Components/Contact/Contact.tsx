import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Grid } from '@mui/material';

export default function Contact() {
  return (
    <Grid 
      container 
      sx={{ backgroundColor: '#393280', height: '56px', color: '#fff', px: 2 }}
      alignItems="center"
      justifyContent="space-between"
    >
      <Grid sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LocalPhoneIcon />
        <span>+91 8374902234</span>
      </Grid>

      <Grid sx={{ display: 'flex', gap: 2 }}>
        <FacebookIcon sx={{cursor:'pointer'}}/>
        <InstagramIcon sx={{cursor:'pointer'}}/>
        <LinkedInIcon sx={{cursor:'pointer'}}/>
        <TwitterIcon sx={{cursor:'pointer'}}/>
      </Grid>
    </Grid>
  );
}