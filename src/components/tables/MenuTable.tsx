import React from "react";
import More2FillIcon from "remixicon-react/More2FillIcon";
import BaseTable from "./BaseTable";
import HeadItem from "./HeadItem";
import {IconButton, TableCell} from "@mui/material";

interface MenuTableProps<T extends {id?: string; name?: string}> {
    heads: Array<HeadItem<T>>;
    elements: T[];
    onMenuClick: (event: React.MouseEvent<HTMLElement>, id: string) => void;
}

const MenuTable = <T extends {id: string; name?: string}>({ heads, elements, onMenuClick }: MenuTableProps<T>) => {
    const handleMenuClick = (id: string) => (e: React.MouseEvent<HTMLElement>) => onMenuClick(e, id);

    const EndHead = <TableCell padding="checkbox" />

    const EndCell = (row: T) => (
        <TableCell padding="checkbox">
            <IconButton
                aria-label="more"
                aria-controls="more-menu"
                aria-haspopup="true"
                onClick={handleMenuClick(row.id)}
            >
                <More2FillIcon />
            </IconButton>
        </TableCell>
    )

    return (
        <BaseTable
            heads={heads}
            elements={elements}
            endActions={EndHead}
            endCell={EndCell}
        />
    );
}

export default MenuTable;
