import React from "react";
import {TableCell} from "@mui/material";
import {TableCellProps} from "@mui/material/TableCell/TableCell";

export const BaseTableHead: React.FC<TableCellProps> = ({children, ...rest}) => {
    return (
        <TableCell {...rest} sx={(theme) => ({
            background: theme.palette.background.default,
            border: 'none'
        })}>
            {children}
        </TableCell>
    )
}

export default BaseTableHead;