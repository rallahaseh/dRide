import { Navbar } from "@mantine/core"
import { NavbarHome } from "./NavbarHome";
import { NavbarLinks } from "./NavbarLinks";
import { NavbarUser, WalletData } from "./NavbarUser";


interface NavigationBarProps {
    opened: boolean;
    isAdmin: boolean;
    isConnectedToWallet: boolean;
    walletData: WalletData;
}

export function NavigationBar({ opened, isAdmin, isConnectedToWallet, walletData }: NavigationBarProps) {
    return <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
        {/* Header */}
        <Navbar.Section mt="xs">
            <NavbarHome />
        </Navbar.Section>
        {/* Content */}
        <Navbar.Section grow mt="md">
            <NavbarLinks isAdmin={isAdmin} visibility={isConnectedToWallet} />
        </Navbar.Section>
        {/* Footer */}
        {isConnectedToWallet ?
            <Navbar.Section>
                <NavbarUser walletData={walletData} />
            </Navbar.Section>
            : null
        }
    </Navbar>
}