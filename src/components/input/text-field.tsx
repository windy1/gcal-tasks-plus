import { Palette } from "@/constants";
import { TextField as MuiTextField } from "@mui/material";
import { ComponentProps } from "react";

const Variant = "outlined";
const Size = "small";
const Color = "primary";

export const TextField = (props: ComponentProps<typeof MuiTextField>) => (
    <MuiTextField
        fullWidth
        variant={Variant}
        size={Size}
        color={Color}
        sx={{ input: { color: Palette.White } }}
        {...props}
    />
);
