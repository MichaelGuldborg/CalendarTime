import React from "react";
import {TableCell} from "@mui/material";
import {TableCellProps} from "@mui/material/TableCell/TableCell";


export const BaseTableCell: React.FC<TableCellProps> = ({children, ...rest}) => {
    return <TableCell {...rest} sx={{
        borderColor: '#eceef0',
        padding: 2,
    }}>
        {children}
    </TableCell>
}

export default BaseTableCell;