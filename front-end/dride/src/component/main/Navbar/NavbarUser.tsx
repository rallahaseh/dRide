import { IconChevronRight, IconChevronLeft } from '@tabler/icons';
import { UnstyledButton, Group, Avatar, Text, Box, useMantineTheme } from '@mantine/core';

export interface WalletData {
  address: string;
  balance: string;
}

interface NavbarUserProps {
  walletData: WalletData;
}

export function NavbarUser({ walletData }: NavbarUserProps) {
  const theme = useMantineTheme();

  return (
    <Box
      sx={{
        paddingTop: theme.spacing.sm,
        borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
          }`,
      }}
    >
      <UnstyledButton
        sx={{
          display: 'block',
          width: '100%',
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

          '&:hover': {
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
          },
        }}
      >
        <Group>
          <Text>Wallet Information</Text>
          {theme.dir === 'ltr' ? <IconChevronRight size={18} /> : <IconChevronLeft size={18} />}
          <Box sx={{ flex: 1 }}>
            <Text size="xs" sx={{ fontSize: 10 }}>{walletData.address}</Text>
            <Text color="dimmed" size="sm">{walletData.balance} ETH</Text>
          </Box>
        </Group>
      </UnstyledButton>
    </Box>
  );
}