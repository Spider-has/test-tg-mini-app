import { useRef } from 'react';
import './Inputs.scss';

type TextInputProps = {
    placeholder: string;
    maxLength: number;
};

type TextAreaProps = {
    placeholder: string;
};

type CheckBoxProps = {
    text: string;
};

export type OptionsProps = {
    checkboxes: CheckBoxProps[];
};

export const TextInput = (props: TextInputProps) => {
    return (
        <input className={'input'} type="text" maxLength={props.maxLength} placeholder={props.placeholder} />
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
            }}
            className={'input input_multi-line'}
            placeholder={props.placeholder}
        ></textarea>
    );
};

export const OptionsList = (props: OptionsProps) => {
    const checkboxes = props.checkboxes.map((elem, i) => <CheckboxInput key={i} {...elem} />);
    return <div className={'options-area'}>{checkboxes}</div>;
};

export const CheckboxInput = (props: CheckBoxProps) => {
    return (
        <div className="checkbox-input">
            <input type="checkbox" />
            <span>{props.text}</span>
        </div>
    );
};
