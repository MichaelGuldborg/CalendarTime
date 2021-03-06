import React, {useState} from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {Box, Divider} from "@material-ui/core";
import SearchInput from "./inputs/SearchInput";
import List from "@material-ui/core/List";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import useTheme from "@material-ui/core/styles/useTheme";
import {toTimeAgo} from "../functions/dateFormat";
import SearchListElement from "../models/SearchListElement";

const useStyles = makeStyles(() => ({
    listWrapper: {
        display: "flex",
        flex: 1,
        width: "100%",
        overflowY: 'auto'
    },
    list: {listStyleType: 'none', width: '100%'},
    text: {
        paddingRight: 24,
        '& span, p': {
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
        }
    }
}))

export interface SearchListViewProps<T extends SearchListElement> {
    selectedId?: string,
    elements: T[],
    searchFilter: (search: string) => ({name, updatedAt}: T) => boolean;
    onElementClick?: (element: T) => void;
    onElementReadClick?: (element: T) => void;
    renderSubtitle?: (element: T) => string;
}

const SearchListView = <T extends SearchListElement, >(
    {
        selectedId,
        elements,
        searchFilter,
        onElementClick,
        onElementReadClick,
        renderSubtitle,
    }: SearchListViewProps<T>) => {
    const classes = useStyles();
    const [search, setSearch] = useState('');
    const filteredElements = elements.filter(searchFilter(search));

    const handleElementClick = (element: T) => () => onElementClick && onElementClick(element)
    const handleElementReadClick = (element: T) => () => onElementReadClick && onElementReadClick(element)

    return (
        <Box width='100%' display='flex' height='100%' flexDirection='column'>
            <Box>
                <Box pl={2} pr={2}>
                    <SearchInput
                        search={search}
                        onChange={setSearch}
                        box
                    />
                </Box>
                <Divider/>
            </Box>
            <Box className={classes.listWrapper}>
                <List disablePadding className={classes.list}>
                    {filteredElements?.map((element) => {
                        const selected = selectedId === element.id;
                        const read = element.read;
                        const subtitle = (renderSubtitle && renderSubtitle(element)) || toTimeAgo(element.updatedAt);
                        return (
                            <ListItem
                                key={element.id}
                                button={(Boolean(onElementClick) as true)}
                                selected={selected}
                                onClick={handleElementClick(element)}>
                                {selected && <Indicator/>}
                                <ListItemAvatar>
                                    <Avatar style={{backgroundColor: element?.color}}>
                                        {element.name}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    className={classes.text}
                                    primary={element.name}
                                    secondary={subtitle}
                                />
                                <Divider/>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>
        </Box>
    );
}


export const Indicator: React.FC = () => {
    const theme = useTheme();
    return (
        <div style={{
            position: 'absolute',
            left: 0,
            width: 5,
            height: '100%',
            backgroundColor: theme.palette.primary.main,
        }}/>
    )
}

export default SearchListView;
