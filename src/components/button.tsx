import { Button as MuiButton } from "@mui/material";
import { ComponentProps, ReactNode } from "react";

const Color = "primary";
const Variant = "contained";

interface ButtonProps extends ComponentProps<typeof MuiButton> {
    children: ReactNode;
}

export const Button = ({ children, ...props }: ButtonProps) => (
    <MuiButton color={Color} variant={Variant} {...props}>
        {children}
    </MuiButton>
);
