import React from "react";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableHead from "@material-ui/core/TableHead";
import {Paper} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import stableSort from "../functions/stableSort";
import getComparator, {Order} from "../functions/getComparator";
import NamedValue from "../models/NamedValue";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            height: '80%',
            flex: 1,
            position: 'relative',
        },
        paper: {
            height: '100%',
            width: '100%',
            marginBottom: theme.spacing(2),
            position: 'relative',
            boxShadow: '0 1px 4px rgba(0,0,0,.09)',
        },
        table: {},
        container: {
            height: '100%',
        },
        visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1,
        },
    }),
);

interface SortTableProps<T extends NamedObject> {
    heads: Array<HeadItem<T>>;
    rows: T[];
    onClick?: (e: React.MouseEvent<HTMLTableRowElement>, id: string) => void;
    endHead?: JSX.Element;
    endCell?: (row: T, i: number) => JSX.Element;
}

const SortTable = <T extends NamedObject>({ heads, rows, onClick, endHead, endCell }: SortTableProps<T>) => {
    const classes = useStyles();
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof T>("name");

    const handleRequestSort = (property: keyof T) => () => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleRowClick = (rowId: string) => (e: React.MouseEvent<HTMLTableRowElement>) => onClick && onClick(e, rowId);

    const sortedRows = stableSort(rows, getComparator(order, orderBy)) as T[];

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <TableContainer className={classes.container}>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size="medium"
                        aria-label="enhanced table"
                        stickyHeader={true}
                    >
                        <TableHead>
                            <TableRow>
                                {heads.map((item) => (
                                    <TableCell
                                        key={item.id as string}
                                        align={item.numeric ? 'right' : 'left'}
                                        padding={item.disablePadding ? 'none' : 'default'}
                                        sortDirection={orderBy === item.id ? order : false}
                                    >
                                        <TableSortLabel
                                            active={orderBy === item.id}
                                            direction={orderBy === item.id ? order : 'asc'}
                                            onClick={handleRequestSort(item.id)}
                                        >
                                            {item.label}
                                            {orderBy === item.id && (
                                                <span className={classes.visuallyHidden}>
                                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                </span>
                                            )}
                                        </TableSortLabel>
                                    </TableCell>
                                ))}
                                {endHead}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedRows.map((row, i) => (
                                <TableRow key={row.id} tabIndex={-1} hover={Boolean(onClick)} onClick={handleRowClick(row.id)}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    {heads.filter(h => h.id !== "name").map(head => (
                                        <TableCell key={head.id as string} align={head.numeric ? 'right' : 'left'}>
                                            {row[head.id]}
                                        </TableCell>
                                    ))}
                                    {endCell && endCell(row, i)}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    );
}

export type NamedObject = NamedValue & {[k: string]: string};
export interface HeadItem<T extends NamedObject> {
    disablePadding: boolean;
    id: keyof T;
    label: string;
    numeric: boolean;
}

export default SortTable;
