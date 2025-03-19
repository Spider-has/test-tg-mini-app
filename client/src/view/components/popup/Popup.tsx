import { useEffect, useRef } from 'react';
import './Popup.scss';

type PopupProps = {
    isOpened: boolean;
    isBackgroundClose?: boolean;
    onClose: () => void;
};

type PopupManagerProps = PopupProps & {
    children: React.ReactNode;
};

const PopupManager = (props: PopupManagerProps) => {
    const popupRef = useRef<HTMLDivElement>(null);
    const screenAreaRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (screenAreaRef.current && props.isOpened) {
            screenAreaRef.current.classList.add('popup-manager_opened');
        } else if (screenAreaRef.current && !props.isOpened)
            screenAreaRef.current.classList.remove('popup-manager_opened');
        if (popupRef.current && props.isOpened) {
            popupRef.current.classList.add('popup-manager__popup-wrapper_opened');
        } else if (popupRef.current && !props.isOpened)
            popupRef.current.classList.remove('popup-manager__popup-wrapper_opened');
    }, [props.isOpened]);
    return (
        <div ref={screenAreaRef} className={'popup-manager'}>
            <div
                className={'popup-manager__background-area '}
                onClick={() => {
                    if (props.isBackgroundClose) props.onClose();
                }}
            ></div>
            <div ref={popupRef} className={'popup-manager__popup-wrapper'}>
                {props.children}
            </div>
        </div>
    );
};

type TextFieldPopupProps = PopupProps & {
    title: string;
    mainContent: string;
    children: React.ReactNode;
};

export const TextFieldPopup = (props: TextFieldPopupProps) => {
    return (
        <PopupManager
            isOpened={props.isOpened}
            onClose={props.onClose}
            isBackgroundClose={props.isBackgroundClose}
        >
            <div className={'popup-manager__content-wrapper'}>
                <div className={'popup-manager__title'}>{props.title}</div>
                <div className={'popup-manager__main-content'}>{props.mainContent}</div>
                <div className={'popup-manager__buttons-area'}>{props.children}</div>
            </div>
        </PopupManager>
    );
};

type ImagePopupProps = PopupProps & {
    children: React.ReactNode;
};

export const ImagePopup = (props: ImagePopupProps) => {
    return (
        <PopupManager
            isOpened={props.isOpened}
            onClose={props.onClose}
            isBackgroundClose={props.isBackgroundClose}
        >
            <div className={'popup-manager__image-wrapper'}>{props.children}</div>
        </PopupManager>
    );
};
