import { Palette } from "@/constants";
import { TextField as MuiTextField } from "@mui/material";
import { ComponentProps } from "react";

const Variant = "outlined";
const Size = "small";
const Color = "primary";
const SxBackgroundColor = "& .MuiOutlinedInput-root";
const SxColor = "& .MuiOutlinedInput-input";

type TextFieldProps = ComponentProps<typeof MuiTextField> & {
    textColor?: string | undefined;
    backgroundColor?: string | undefined;
};

export const TextField = ({
    textColor: color = Palette.White,
    backgroundColor = undefined,
    ...props
}: TextFieldProps) => (
    <MuiTextField
        fullWidth
        variant={Variant}
        size={Size}
        color={Color}
        sx={{
            [SxBackgroundColor]: { backgroundColor },
            [SxColor]: { color },
        }}
        {...props}
    />
);
