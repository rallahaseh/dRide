import * as React from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Divider,
  Link
} from '@mui/material';


export default function Home() {
  return (
    <Container maxWidth="lg">
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: `url(https://littlevisuals.co/images/german.jpg)`,
        }}
      >
        {/* Increase the priority of the hero background image */}
        {<img style={{ display: 'none' }} src={"https://littlevisuals.co/images/german.jpg"} alt={"bgImage"} />}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.3)',
          }}
        />
        <Grid container>
          <Grid item md={6}>
            <Box
              sx={{
                position: 'relative',
                p: { xs: 3, md: 6 },
                pr: { md: 0 },
              }}
            >
              <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                dRide
              </Typography>
              <Typography variant="h5" color="inherit" paragraph>
                A new expirence to share your ride ...
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      <Grid container spacing={5} sx={{ mt: 3 }}>
        <Grid
          item
          xs={12}
          md={12}
          sx={{
            '& .markdown': {
              py: 3,
            },
          }}
        >
          <Typography variant="h4" gutterBottom>
            Decentralized Carsharing System
          </Typography>
          <Divider />
          <Typography variant="body1" gutterBottom padding={2}>
            A decentralized car-sharing system using smart contracts.
          </Typography>
        </Grid>
      </Grid>
      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h6" align="center" gutterBottom>
            dRide
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            component="p"
          >
            dApp for carsharing smart contract
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="/">
              rallahaseh
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Container>
      </Box>
    </Container>
  );
}
