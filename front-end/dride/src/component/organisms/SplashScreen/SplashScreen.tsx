import { Image, Box, Overlay, Highlight } from "@mantine/core"

import imgUrl from '../../../assets/images/splash_background.jpg';

export const SplashScreen = () => {

    return (
        <>
            {/* <Highlight
                sx={{ background: 'transparent' }}
                align="center"
                highlight={['dRide']}
                highlightStyles={(theme) => ({
                    backgroundImage: theme.fn.linearGradient(45, theme.colors.cyan[5], theme.colors.indigo[5]),
                    fontWeight: 700,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                })}>
                dRide | A decentralized car-sharing system using smart contracts.
            </Highlight>
            <Box sx={{ position: 'relative' }}>
                <Overlay opacity={0.4} color="#000" />
                <Image radius="md" src={imgUrl} alt="Splash Screen" />
            </Box> */}
            <Image radius="md" src={imgUrl} alt="Splash Screen" />
        </>
    );
}