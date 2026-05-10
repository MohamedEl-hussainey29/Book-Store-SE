import { Box, Divider, Grid, List, ListItem, Stack, Typography } from "@mui/material";
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import footerImg from '../../../../assets/Images/footer.png';

export default function Footer() {
  return (
    <Box sx={{ backgroundColor: "#ED553B", color: 'white', py: 6, px: 4 }}>
      <Grid container spacing={4} sx={{width:'80%', margin:'auto'}}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2}>
            <Box 
              sx={{ 
                width: 80, 
                height: 80, 
                borderRadius: '50%', 
                overflow: 'hidden', 
                bgcolor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img src={footerImg} alt="footer_logo" style={{ width: '80%', height: 'auto' }} />
            </Box>
            <Typography variant="body2">
              Nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Typography>
            <Stack direction='row' spacing={2}>
              <FacebookRoundedIcon sx={{ fontSize: 50, cursor: 'pointer' }} />
              <LinkedInIcon sx={{ fontSize: 50, cursor: 'pointer' }} />
              <TwitterIcon sx={{ fontSize: 50, cursor: 'pointer' }} />
              <YouTubeIcon sx={{ fontSize: 50, cursor: 'pointer' }} />
            </Stack>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={{textTransform: 'uppercase'}}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Company
          </Typography>
          <List disablePadding>
            {['home', 'about us', 'books', 'new release', 'contact us', 'blog'].map((item) => (
              <ListItem key={item} sx={{ px: 0, py: 0.5, cursor: 'pointer' }}>
                {item}
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={{textTransform: 'uppercase',}}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Important Links
          </Typography>
          <List disablePadding>
            {['privacy policy', 'faqs', 'terms of service'].map((item) => (
              <ListItem key={item} sx={{ px: 0, py: 0.5, cursor: 'pointer' }}>
                {item}
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid size={12}>
          <Divider sx={{ mt: 4, mb: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
          <Box display='flex' justifyContent='space-between'>
            <Typography variant="caption" align="center" display="block">
              © 2026 Your Bookstore Name. All rights reserved.
            </Typography>
            <Typography variant="caption" align="center" display="block">
              Privacy | Terms of Service
            </Typography>
          </Box>
        </Grid>
      </Grid>
      
    </Box>
  );
}