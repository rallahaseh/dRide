import { Text, Button, Group } from "@mantine/core"
import { Goerli, useEthers } from "@usedapp/core";

export const WalletConnect = () => {
    const { activateBrowserWallet, account, deactivate, chainId, switchNetwork } = useEthers();
    if (account) {
        if (chainId === Goerli.chainId) {
            return <Button onClick={deactivate}>Disconnect</Button>
        } else {
            return (
                <Group position="right">
                    <Text color="red">Wrong Network!</Text>
                    <Button onClick={() => switchNetwork(Goerli.chainId)}>Switch Network</Button>
                </Group>
            );
        }
    } else {
        return <Button onClick={activateBrowserWallet}>Connect your wallet</Button>
    }
}