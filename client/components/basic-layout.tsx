import { Fragment, useMemo } from 'react';
import { useRouter } from 'next/router';
import type { FC, ReactNode } from 'react';
import NavBar from './navbar';
import Container from '@mui/material/Container';

export const BasicLayout: FC<BasicLayoutProps> = (props: BasicLayoutProps) => {
    const { children } = props;
    const { pathname } = useRouter();
    const transitionKey = useMemo<string>(() => pathname, [pathname]);

    return (
        <Fragment>
            {/* Header */}
            <NavBar />
            {/* Body */}
            <Container key={transitionKey}>
                {children}
            </Container>
            {/* Footer */}
        </Fragment>
    );
};

interface BasicLayoutProps {
    children: ReactNode;
}