import { Text, Title } from "@mantine/core"

export const WalletInstallation = () => {
    return (<>
    <Title> MetaMask is Required</Title>
    <Text>Follow the link to install 
        <Text variant="link" component="a" href="https://metamask.io/download/"> MetaMask</Text>
    </Text>
    </>)
}