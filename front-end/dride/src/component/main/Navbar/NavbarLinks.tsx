import React from 'react';
import { IconCar, IconKey, IconQuestionMark, IconMailForward } from '@tabler/icons';
import { ThemeIcon, UnstyledButton, Group, Text } from '@mantine/core';
import { Link } from 'react-router-dom';

interface NavbarLinkProps {
  id: number;
  icon: React.ReactNode;
  color: string;
  label: string;
  path: string;
  visible: boolean;
}

function NavbarLink({ icon, color, label, path }: NavbarLinkProps) {
  return (
    <UnstyledButton component={Link} to={path}
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
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>
        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
}

interface NavbarLinksProps {
  isAdmin: boolean;
  visibility: boolean;
}

export function NavbarLinks({ isAdmin, visibility }: NavbarLinksProps) {
  const data = [
    { id: 1, icon: <IconCar size={16} />, color: 'teal', label: 'Add Car', path: '/add-car', visible: visibility && isAdmin },
    { id: 2, icon: <IconKey size={16} />, color: 'violet', label: 'Rent a Car', path: '/rent', visible: visibility },
    { id: 3, icon: <IconQuestionMark size={16} />, color: 'grape', label: 'FAQ', path: '/faq', visible: true },
    { id: 4, icon: <IconMailForward size={16} />, color: 'blue', label: 'Contact us', path: '/contact-us', visible: true },
  ];

  const links = data.map((link) =>
    link.visible ? <NavbarLink {...link} key={link.id} /> : null
  );
  return <div>{links}</div>;
}