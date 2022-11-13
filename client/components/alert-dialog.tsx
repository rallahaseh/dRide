import { FC, forwardRef, ReactElement, Ref, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: ReactElement<any, any>;
    },
    ref: Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const AlertDialog: FC<AlertDialogProps> = (props: AlertDialogProps) => {
    const [open, setOpen] = useState(true);

    const handlePrimaryAction = () => {
        setOpen(false);
        props.primaryAction();
    };
    const handleSecondaryAction = () => {
        setOpen(false);
        props.secondaryAction && props.secondaryAction();
    };

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            aria-describedby="alert-info-dialog-slide"
        >
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-info-dialog-description">
                    {props.description}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handlePrimaryAction}>{props.primaryActionTitle}</Button>
                {props.secondaryActionTitle &&
                    <Button onClick={handleSecondaryAction} autoFocus>{props.secondaryActionTitle}</Button>
                }
            </DialogActions>
        </Dialog>
    );
};

interface AlertDialogProps {
    title: string;
    description: string;
    primaryActionTitle: string;
    primaryAction: () => void;
    secondaryActionTitle?: string;
    secondaryAction?: () => void;
}