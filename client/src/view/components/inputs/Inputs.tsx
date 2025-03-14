import { memo, useCallback, useEffect, useRef, useState } from 'react';
import './Inputs.scss';

type TextInputProps = {
    placeholder: string;
    maxLength: number;
    onInputHandler: (inputRef: React.RefObject<HTMLInputElement>) => void;
    value: string;
};

type TextAreaProps = {
    placeholder: string;
    value: string;
    onInputHandler: (inputRef: React.RefObject<HTMLTextAreaElement>) => void;
};

export const TextInput = (props: TextInputProps) => {
    const inpRef = useRef<HTMLInputElement>(null);
    return (
        <input
            onInput={() => {
                props.onInputHandler(inpRef);
            }}
            className={'input'}
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
    return (
        <textarea
            ref={textArea}
            onInput={() => {
                if (textArea.current) {
                    textArea.current.style.height = textArea.current.scrollHeight + 'px';
                }
                props.onInputHandler(textArea);
            }}
            className={'input input_multi-line'}
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
