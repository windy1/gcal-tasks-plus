import { WithChildren } from "@/types";
import { Button as MuiButton } from "@mui/material";
import { ComponentProps } from "react";

const Color = "primary";
const Variant = "contained";

type ButtonProps = ComponentProps<typeof MuiButton> & WithChildren;

export const Button = ({ children, ...props }: ButtonProps) => (
    <MuiButton color={Color} variant={Variant} {...props}>
        {children}
    </MuiButton>
);
