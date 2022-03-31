import React from 'react';
import SearchIcon from 'remixicon-react/Search2LineIcon';
import {Box, InputAdornment, TextField, TextFieldProps} from "@mui/material";

export interface SearchProps {
    search: string;
    onChange: (search: string) => void;
    width?: React.CSSProperties["width"];
}

type SearchInputProps = SearchProps & Omit<TextFieldProps, "onChange">;

export const SearchInput: React.FC<SearchInputProps> = ({search, width, onChange, ...props}) => {
    return (
        <Box
            display='flex'
            alignItems='center'
            justifyContent='center'
            width={width}
        >
            <TextField
                placeholder="Search …"
                variant="outlined"
                fullWidth
                InputProps={{
                    startAdornment: (
                        <InputAdornment position='start'>
                            <SearchIcon size={18}/>
                        </InputAdornment>
                    ),
                }}
                value={search}
                onChange={(event) => onChange(event.target.value)}
                {...props}
            />
        </Box>

    )
};

export default SearchInput