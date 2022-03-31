import React from "react";
import NamedValue from "../../models/NamedValue";
import Identifiable from "../../models/Identifiable";
import {toIdValueMap} from "../../functions/toIdValueMap";
import {Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select} from "@mui/material";
import {SelectInputProps} from "@mui/material/Select/SelectInput";


export interface SelectNamedProps {
    label?: string;
    labelId?: string;
    options?: NamedValue[];
    value: string | string[];
    onChange: SelectInputProps['onChange'];
    multiple?: boolean;
    fullWidth?: boolean;
    variant?: 'standard' | 'outlined' | 'filled';
    className?: string;
}

export const SelectNamed: React.FC<SelectNamedProps> =
    ({
         label,
         labelId,
         options = [],
         value,
         onChange,
         multiple = false,
         fullWidth = false,
         variant = 'standard',
         className,
         ...rest
     }) => {

        const idValueMap = toIdValueMap(options);

        const renderValue = (selected: unknown): React.ReactNode => {
            if (typeof selected === 'object' && (selected as unknown[])?.length !== undefined) {
                return (selected as unknown[])?.map(u => {
                    if (typeof u === 'string') return idValueMap[u]?.name;
                    if (typeof u === 'object') return idValueMap[(u as Identifiable).id]?.name
                    return '' + u;
                })?.join(', ');
            }
            if (typeof selected === 'string') {
                return idValueMap[selected]?.name;
            }
            return '' + selected;
        }


        // if single select and string is not empty wrap in array
        const v = multiple ? value : !value ? value : [value];
        const lId = labelId || 'select-' + label?.toLowerCase() + '-label';
        return (
            <FormControl fullWidth={fullWidth} className={className}>
                <InputLabel id={lId} variant={variant}>
                    {label}
                </InputLabel>
                <Select
                    value={v}
                    onChange={onChange}
                    renderValue={renderValue}
                    multiple={multiple}
                    fullWidth={fullWidth}
                    labelId={lId}
                    variant={variant}
                    {...rest}
                >
                    <MenuItem value={undefined} disabled>{label}</MenuItem>
                    {options.map(({id, name}) => (
                        <MenuItem key={id} value={id}>
                            <ListItemText primary={name}/>
                            {multiple && <Checkbox checked={v?.indexOf(id) > -1}/>}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    }

export default SelectNamed;