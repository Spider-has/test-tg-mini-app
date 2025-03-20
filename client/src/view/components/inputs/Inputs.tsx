import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './Inputs.scss';

type InputProps = {
    placeholder: string;
    value: string;
    isNotValid?: boolean;
};

type TextInputProps = InputProps & {
    maxLength: number;
    onInputHandler: (value: string) => void;
};

type TextAreaProps = InputProps & {
    rowsCount?: number;
    onInputHandler: (value: string) => void;
};

export const TextInput = (props: TextInputProps) => {
    const inpRef = useRef<HTMLInputElement>(null);
    const validClass = props.isNotValid ? 'input_non-valid' : '';
    return (
        <input
            onInput={() => {
                if (inpRef.current) props.onInputHandler(inpRef.current.value);
            }}
            className={`input ${validClass}`}
            type="text"
            ref={inpRef}
            maxLength={props.maxLength}
            placeholder={props.placeholder}
            value={props.value}
        />
    );
};

export const TextAreaInput = (props: TextAreaProps) => {
    const textArea = useRef<HTMLTextAreaElement>(null);
    const inputMultiClass = props.rowsCount ? '' : 'input_multi-line';
    const validClass = props.isNotValid ? 'input_non-valid' : '';
    useEffect(() => {
        if (textArea.current && textArea.current.scrollHeight > textArea.current.offsetHeight) {
            textArea.current.style.height = textArea.current.scrollHeight + 'px';
        }
    }, [props.value]);
    return (
        <textarea
            ref={textArea}
            onInput={() => {
                if (textArea.current) props.onInputHandler(textArea.current.value);
            }}
            rows={props.rowsCount ? props.rowsCount : 0}
            className={`input ${inputMultiClass} ${validClass}`}
            placeholder={props.placeholder}
            value={props.value}
        ></textarea>
    );
};

export type OptionProps = {
    text: string;
    isSelected: boolean;
};

type CheckBoxOptionProps = OptionProps & {
    onClickHandler: (inpRef: React.RefObject<HTMLInputElement>, inpText: string) => void;
};

export type CheckBoxListProps = {
    options: OptionProps[];
    onCheckboxClick: (inpRef: React.RefObject<HTMLInputElement>, inpText: string) => void;
};

export type DropDownListProps = {
    options: OptionProps[];
    selectedIndex: number;
    onOptionClick: (optionIndex: number) => void;
};
export const OptionsList = memo(function OptionsList(props: CheckBoxListProps) {
    const checkboxes = props.options.map((elem, i) => (
        <CheckboxInput onClickHandler={props.onCheckboxClick} key={i} {...elem} />
    ));
    return <div className={'options-area'}>{checkboxes}</div>;
});

export const CheckboxInput = (props: CheckBoxOptionProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    return (
        <label className="checkbox-input">
            <input
                onChange={() => {
                    props.onClickHandler(inputRef, props.text);
                }}
                ref={inputRef}
                type="checkbox"
                checked={props.isSelected}
            />
            <span>{props.text}</span>
        </label>
    );
};

export const DropDownListItem = (props: OptionProps) => {
    const selectedClass = props.isSelected ? 'drop-down-elem_selected' : '';
    return <div className={`drop-down-elem ${selectedClass}`}>{props.text}</div>;
};

export const DropDownListInput = memo(function DropDownListInput(props: DropDownListProps) {
    const [open, setOpen] = useState(false);
    const optionsRef = useRef<HTMLDivElement>(null);
    const options = props.options.map((elem, i) => (
        <div
            key={i}
            onClick={() => {
                props.onOptionClick(i);
                setOpen(false);
            }}
            className={'drop-down-list__option'}
        >
            <DropDownListItem {...elem} isSelected={props.selectedIndex === i} />
        </div>
    ));
    useEffect(() => {
        if (optionsRef.current) {
            if (open) optionsRef.current.classList.add('drop-down-list__options-area_opened');
            else optionsRef.current.classList.remove('drop-down-list__options-area_opened');
        }
    }, [open]);
    const onInputClick = useCallback(() => {
        setOpen(open => !open);
    }, []);
    const inputText = props.options[props.selectedIndex].text;
    const disabledInputClass = open ? 'input_disabled' : '';
    return (
        <div className={'drop-down-list'}>
            <div className={`input ${disabledInputClass}`} onClick={onInputClick}>
                {inputText}
            </div>
            <div className={'drop-down-list__options-area'} ref={optionsRef}>
                {options}
            </div>
        </div>
    );
});

export type RadioOption = {
    text: string;
};

type RadioOptionProps = RadioOption & {
    isSelected: boolean;
    onOptionClick: (i: number) => void;
    index: number;
};

const Option = memo(function Option(props: RadioOptionProps) {
    const selectedClass = useMemo(
        () => (props.isSelected ? 'radio-input__radio-icon_selected' : ''),
        [props.isSelected],
    );
    return (
        <div className={'radio-input'} onClick={() => props.onOptionClick(props.index)}>
            <div className={`radio-input__radio-icon ${selectedClass}`}></div>
            <span>{props.text}</span>
        </div>
    );
});

type RadioInputListProps = {
    Options: RadioOption[];
    isValid?: boolean;
    onSelectedChange?: (i: number) => void;
};

export const RadioInputList = memo(function RadioInputList(props: RadioInputListProps) {
    const [selectedI, setSelectedI] = useState(-1);
    const onSelectionChange = useCallback((i: number) => {
        setSelectedI(i);
    }, []);
    const options = useMemo(
        () =>
            props.Options.map((el, i) => {
                return (
                    <Option
                        onOptionClick={onSelectionChange}
                        key={i}
                        index={i}
                        text={el.text}
                        isSelected={selectedI === i}
                    />
                );
            }),
        [selectedI],
    );
    useEffect(() => {
        if (props.onSelectedChange && selectedI >= 0) props.onSelectedChange(selectedI);
    }, [selectedI]);
    const validClass = useMemo(() => {
        if (props.isValid === false) return 'radio-inputs-list_non-valid';
        else return '';
    }, [props.isValid]);
    return <div className={`radio-inputs-list ${validClass}`}>{options}</div>;
});
