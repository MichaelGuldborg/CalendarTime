import DeleteButton from "../../components/buttons/DeleteButton";
import CloseCircleFillIcon from "remixicon-react/CloseCircleFillIcon";
import SaveIcon from "remixicon-react/SaveLineIcon";
import React, {useState} from "react";
import TextFieldDialog from "../../components/dialogs/TextFieldDialog";
import {ActionButton} from "../../components/buttons/ActionButton";
import {EventQueryFormValues} from "../../useEventQueryState";
import {Button} from "@mui/material";

const TEMPLATE_LIST_KEY = 'templates';
const getTemplateKey = (name: string) => 'template-' + name.trim();

export interface TemplateInputProps {
    values: EventQueryFormValues;
    setValues: (values: EventQueryFormValues) => void;
}

export const TemplateInput: React.FC<TemplateInputProps> = ({values, setValues}) => {
    const initialTemplates = JSON.parse(localStorage.getItem(TEMPLATE_LIST_KEY) ?? '[]');
    const [templates, setTemplates] = useState<string[]>(initialTemplates);

    const handleSaveTemplate = (input: string) => {
        const name = input.trim().toLowerCase();
        const newTemplates = [...templates, name];
        setTemplates(newTemplates);
        localStorage.setItem(TEMPLATE_LIST_KEY, JSON.stringify(newTemplates))
        const key = getTemplateKey(name);
        localStorage.setItem(key, JSON.stringify(values));
    }

    const handleDeleteTemplate = (name: string) => () => {
        const newTemplates = templates.filter(t => t !== name);
        setTemplates(newTemplates);
        localStorage.setItem(TEMPLATE_LIST_KEY, JSON.stringify(newTemplates))
    }

    const handleLoadTemplate = (name: string) => () => {
        const key = getTemplateKey(name);
        const valuesJSON = localStorage.getItem(key);
        const values: EventQueryFormValues = JSON.parse(valuesJSON ?? '{}');
        values.start = new Date(values.start);
        values.end = new Date(values.end);
        if (valuesJSON && values) setValues(values);
    }


    return (
        <>
            {templates.map((name: string) => {
                return <div key={name} style={{position: 'relative', marginRight: 16}}>
                    <Button
                        variant="outlined"
                        style={{height: 58}}
                        onClick={handleLoadTemplate(name)}
                    >
                        {name}
                    </Button>
                    <DeleteButton
                        style={{position: 'absolute', top: -24, right: -24}}
                        title={'Delete template'}
                        message={'Are you sure you want to delete "' + name + '"'}
                        onConfirm={handleDeleteTemplate(name)}
                        icon={CloseCircleFillIcon}
                    />
                </div>
            })}
            <div style={{flex: 1}}/>
            <TextFieldDialog title={'Save template'} onConfirm={handleSaveTemplate}>
                <ActionButton
                    text='SAVE QUERY'
                    icon={SaveIcon}
                />
            </TextFieldDialog>
        </>
    )
}


export default TemplateInput;