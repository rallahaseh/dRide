import { IconHome } from '@tabler/icons';
import { ThemeIcon, UnstyledButton, Group, Text } from '@mantine/core';
import { Link } from 'react-router-dom';

export function NavbarHome() {
    return (
        <UnstyledButton component={Link} to='/'
            sx={(theme) => ({
                display: 'block',
                width: '100%',
                padding: theme.spacing.xs,
                borderRadius: theme.radius.sm,
                color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

                '&:hover': {
                    backgroundColor:
                        theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                },
            })}
        >
            <Group>
                <ThemeIcon color='blue' variant="light">
                    <IconHome size={16} />
                </ThemeIcon>
                <Text size="sm">Home</Text>
            </Group>
        </UnstyledButton>
    );
}