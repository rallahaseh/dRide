import { Burger, Header, Highlight, MediaQuery, useMantineTheme } from "@mantine/core"
import { WalletConnect } from "../organisms/Wallet/Connect"

interface AppHeaderProps {
    setOpened: React.Dispatch<React.SetStateAction<boolean>>;
    opened: boolean;
}

export function AppHeader({ opened, setOpened }: AppHeaderProps) {
    const theme = useMantineTheme();

    return <Header height={70} px="xl" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                <Burger
                    opened={opened}
                    onClick={() => setOpened((o) => !o)}
                    size="sm"
                    color={theme.colors.gray[6]}
                    mr="xl"
                />
            </MediaQuery>
        </div>
        <Highlight
            align="center"
            highlight={['dRide', '|']}
            highlightStyles={(theme) => ({
                backgroundImage: theme.fn.linearGradient(45, theme.colors.cyan[5], theme.colors.indigo[5]),
                fontWeight: 700,
                fontSize: 45,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
            })}
        >
            dRide | Make your trip enjoyable
        </Highlight>
        <WalletConnect />
    </Header>
}