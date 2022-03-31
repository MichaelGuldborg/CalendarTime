import React from "react";
import HeadItem from "./HeadItem";
import SortTable from "./SortTable";
import BaseTableCell from "./BaseTableCell";
import {alpha, Checkbox, TableRow} from "@mui/material";
import formatNumber from "../../lib/string/formatNumber";
import {Order} from "../../lib/list/getComparator";
import {monthNames} from "../../lib/date/toLocalISO";


interface BaseTableProps<T extends Record<string, any>> {
    heads: Array<HeadItem<T>>;
    initialOrderKey?: keyof T;
    initialOrder?: Order;
    elements: T[];
    startActions?: JSX.Element;
    endActions?: JSX.Element | false;
    onClick?: ((e: React.MouseEvent<HTMLTableRowElement>, id: string) => void) | false;
    startCell?: (row: T, i: number) => JSX.Element;
    endCell?: ((row: T, i: number) => JSX.Element) | false;
    row?: (row: T, i: number) => JSX.Element;
    children?: React.ReactNode;
    selected?: string | string[];
    disabledSorting?: true;
}

const BaseTable = <T extends Record<string, any>>(
    {
        heads,
        elements,
        onClick,
        selected,
        endActions,
        initialOrder,
        initialOrderKey,
        endCell,
        startActions,
        startCell,
        row,
        children,
        disabledSorting,
    }: BaseTableProps<T>) => {
    const filteredHeads = heads.filter((e) => !e.hidden);
    const handleRowClick = (rowId: string) => (e: React.MouseEvent<HTMLTableRowElement>) => onClick && onClick(e, rowId);
    const renderRowValue = (row: T, head: HeadItem<T>) => {
        if (head.render) return head.render(row);
        if (head.hideNull && !Boolean(row[head.id])) return '';

        const value = row[head.id];
        const valueType = typeof value;

        if (typeof value?.getMonth === 'function') {
            const date = new Date(row[head.id]);
            const monthName = monthNames[date.getMonth()];
            return `${date.getDate()}. ${monthName} ${date.getFullYear()}`;
        }

        if (valueType === 'boolean') {
            return <Checkbox
                checked={row[head.id]}
                disabled={true}
                color="primary"
                style={{padding: 0}}
            />
        }
        if (valueType === 'number' || valueType === 'bigint') {
            if (head.percent) return (row[head.id] * 100) + ' %';
            return formatNumber(Math.round(row[head.id]))
        }

        if (head.numeric) {
            return formatNumber(row[head.id])
        }
        return row[head.id];
    }


    const renderRow = row ?? (
        (element: T, i: number) => (
            <TableRow
                key={element.id}
                tabIndex={-1}
                sx={(theme) => ({
                    '&:hover': {
                        background: Boolean(onClick) ? `${alpha(theme.palette.primary.main, 0.08)} !important` : ''
                    },
                })}
                hover={Boolean(onClick)}
                onClick={handleRowClick(element.id)}
                style={{cursor: Boolean(onClick) ? 'pointer' : undefined}}
                selected={Array.isArray(selected) ? selected.includes(element.id) : selected !== undefined && selected === element.id}
            >
                {startCell && startCell(element, i)}
                {filteredHeads.map((head, index) => (
                    <BaseTableCell
                        key={index + (head.id as string)}
                        align={head.numeric ? 'right' : 'left'}
                    >
                        {renderRowValue(element, head)}
                    </BaseTableCell>
                ))}
                {endCell && endCell(element, i)}
            </TableRow>
        ))

    return (
        <SortTable
            heads={filteredHeads}
            initialOrder={initialOrder}
            initialOrderKey={initialOrderKey}
            elements={elements}
            startActions={startActions}
            actions={endActions ? endActions : undefined}
            disabledSorting={disabledSorting}
        >
            {(sortedElements) => (
                <>
                    {sortedElements.map((element, i) => renderRow(element, i))}
                    {children}
                </>
            )}
        </SortTable>
    );
}


export default BaseTable;
