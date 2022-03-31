import React from "react";
import getComparator, {Order} from "../../lib/list/getComparator";
import stableSort from "../../lib/list/stableSort";
import HeadItem from "./HeadItem";
import BaseTableHead from "./BaseTableHead";
import {
    Box,
    createStyles,
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Tooltip
} from "@mui/material";

export const styles = createStyles({
    root: {},
    paper: {},
    table: {},
    container: {},
    visuallyHidden: {},
});

interface SortTableProps<T extends Record<string, any>> {
    heads: Array<HeadItem<T>>;
    initialOrderKey?: keyof T;
    initialOrder?: Order;
    elements: T[];
    startActions?: JSX.Element;
    actions?: JSX.Element;
    children: (elements: T[]) => JSX.Element | JSX.Element[];
    disabledSorting?: true;
}

const SortTable = <T extends Record<string, any>>(
    {
        heads,
        elements,
        actions,
        disabledSorting,
        startActions,
        initialOrder,
        initialOrderKey,
        children
    }: SortTableProps<T>
) => {
    const [order, setOrder] = React.useState<Order>(initialOrder ?? 'asc');
    const [orderBy, setOrderBy] = React.useState<keyof T>(initialOrderKey ?? 'name');

    const handleRequestSort = (property: keyof T) => () => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedRows = stableSort(elements, getComparator(order, orderBy)) as T[];

    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            flex: 1,
            position: 'relative',
        }}>
            <Paper sx={{
                height: '100%',
                width: '100%',
                position: 'relative',
                boxShadow: 'none',
            }}>
                <TableContainer sx={{
                    maxHeight: '100%',
                    width: '100%'
                }}>
                    <Table
                        aria-labelledby="tableTitle"
                        size="medium"
                        aria-label="enhanced table"
                        stickyHeader
                    >
                        <TableHead>
                            <TableRow>
                                {startActions && (
                                    <BaseTableHead>
                                        {startActions}
                                    </BaseTableHead>
                                )}
                                {heads.map((item) => {
                                    const header = (
                                        <>
                                            <Tooltip title={item.tooltip ?? ''}>
                                                <div style={{whiteSpace: 'nowrap'}}>
                                                    {item.label}
                                                </div>
                                            </Tooltip>
                                            {orderBy === item.id && (
                                                <Box sx={{
                                                    border: 0,
                                                    clip: 'rect(0 0 0 0)',
                                                    height: 1,
                                                    margin: -1,
                                                    overflow: 'hidden',
                                                    padding: 0,
                                                    position: 'absolute',
                                                    top: 20,
                                                    width: 1,
                                                }}>
                                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                </Box>
                                            )}
                                        </>
                                    )
                                    return (
                                        <BaseTableHead
                                            key={item.id as string}
                                            align={item.numeric ? 'right' : 'left'}
                                            padding={item.disablePadding ? 'none' : 'normal'}
                                            sortDirection={orderBy === item.id ? order : false}
                                        >
                                            {!disabledSorting && (
                                                <TableSortLabel
                                                    active={orderBy === item.id}
                                                    direction={orderBy === item.id ? order : 'asc'}
                                                    onClick={handleRequestSort(item.id)}
                                                >
                                                    {header}
                                                </TableSortLabel>
                                            )}
                                            {disabledSorting && header}
                                        </BaseTableHead>
                                    )
                                })}
                                <BaseTableHead
                                    align="right"
                                    size="small"
                                    padding="none"
                                    style={{paddingRight: 8}}
                                    variant="head"
                                >
                                    {actions}
                                </BaseTableHead>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {children(sortedRows)}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}

export default SortTable;
