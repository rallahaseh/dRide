import { Button } from '@mui/material';
import Typography from './home/home.typography';
import HomeLayout from './home/home.layout';
import backgroundImage from '../public/background.jpg'

export default function Home() {
  return (
    <HomeLayout
      sxBackground={{
        backgroundImage: `url(${backgroundImage.src})`,
        backgroundColor: '#7fc7d9', // Average color of the background image.
        backgroundPosition: 'center',
      }}
    >
      {/* Increase the network loading priority of the background image. */}
      <img
        style={{ display: 'none' }}
        src={backgroundImage.src}
        alt="increase priority"
      />
      <Typography color="inherit" align="center" variant="h2" marked="center">
        Upgrade your rides
      </Typography>
      <Typography
        color="inherit"
        align="center"
        variant="h5"
        sx={{ mb: 4, mt: { sx: 4, sm: 10 } }}
      >
        Enjoy secret offers up to -70% off the best luxury cars every Sunday.
      </Typography>
      <Button
        variant="contained"
        size="large"
        component="a"
        href="/rentVehicle"
        sx={{ minWidth: 200 }}
      >
        Start Now
      </Button>
      <Typography variant="body2" color="inherit" sx={{ mt: 2 }}>
        Discover the experience
      </Typography>
    </HomeLayout>
  );
}
