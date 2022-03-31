import React from "react";
import {Checkbox} from "@mui/material";
import BaseTable from "./BaseTable";
import HeadItem from "./HeadItem";
import BaseTableCell from "./BaseTableCell";
import BaseTableHead from "./BaseTableHead";

interface SelectTableProps<T extends {id: string; name?: string}> {
    heads: Array<HeadItem<T>>;
    elements: T[];
    selected: string[];
    setSelected: (selected: string[]) => void;
    onClick?: (e: React.MouseEvent<HTMLTableRowElement>, id: string) => void;
    endCell?: (row: T, i: number) => JSX.Element;
    startCell?: (row: T, i: number) => JSX.Element;
    endActions?: JSX.Element;
}

const SelectTable = <T extends {id: string; name?: string}>
({
     heads,
     elements,
     selected,
     setSelected,
     onClick,
     endCell,
     startCell,
     endActions
 }: SelectTableProps<T>) => {

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = elements.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
        event.preventDefault();
        event.stopPropagation();
    };

    const isSelected = (id: string) => selected.indexOf(id) !== -1;

    const hasSelected = selected.length > 0;

    const SelectHead = (
        <Checkbox
            indeterminate={selected.length > 0 && selected.length < elements.length}
            checked={elements.length > 0 && selected.length === elements.length}
            onChange={handleSelectAllClick}
            inputProps={{'aria-label': 'select all'}}
            style={{ padding: 0}}
        />
    )

    const SelectCell = (row: T, index: number) => {
        const isItemSelected = isSelected(row.id);
        const labelId = `select-table-checkbox-${index}`;
        return (
            <BaseTableCell padding="checkbox">
                <Checkbox
                    checked={isItemSelected}
                    onClick={(e) => handleClick(e, row.id)}
                    inputProps={{'aria-labelledby': labelId}}
                />
            </BaseTableCell>
        );
    }

    if (startCell !== undefined) return (
        <BaseTable
            heads={heads}
            elements={elements}
            onClick={hasSelected ? handleClick : (onClick ?? handleClick)}
            endActions={SelectHead}
            startActions={endActions ? endActions : endCell ? <BaseTableHead/> : undefined}
            startCell={endCell}
            endCell={SelectCell}
            selected={selected}
        />
    )

    return (
        <BaseTable
            heads={heads}
            elements={elements}
            onClick={hasSelected ? handleClick : (onClick ?? handleClick)}
            startActions={SelectHead}
            endActions={endActions ? endActions : endCell ? <BaseTableHead/> : undefined}
            startCell={SelectCell}
            endCell={endCell}
            selected={selected}
        />
    )
}

export default SelectTable;
