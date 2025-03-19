import { memo } from 'react';
import { CloseIcon, MagnifierIcon } from '../../static/icons/icons';

type UploadedImageProps = {
    src: string;
    alt: string;
    type: 'big' | 'small';
    index: number;
    OnCloseAction: (imageI: number) => void;
    onFullSizeAction: () => void;
};

export const UploadedImage = memo(function UploadedImage(props: UploadedImageProps) {
    const containerSizeType =
        props.type === 'big' ? 'request-task__big-image-wrapper' : 'request-task__small-image-wrapper';
    const imageSizeType = props.type === 'big' ? 'task-image_big' : 'task-image_small';
    return (
        <div className={containerSizeType}>
            <div className={`task-image ${imageSizeType}`}>
                <div
                    onClick={() => {
                        props.onFullSizeAction();
                    }}
                >
                    <img src={props.src} alt={props.alt} />
                </div>

                <div
                    className={'img-close-icon'}
                    onClick={() => {
                        props.OnCloseAction(props.index);
                    }}
                >
                    <CloseIcon />
                </div>
                <div className={'task-image__zoom-icon'}>
                    <MagnifierIcon />
                </div>
            </div>
        </div>
    );
});

type FullSizeImageProps = {
    src: string;
    alt: string;
    OnCloseAction: () => void;
};

export const FullSizeImage = memo(function FullSizeImage(props: FullSizeImageProps) {
    return (
        <div className={`full-size-image`}>
            <div>
                <img src={props.src} alt={props.alt} />
            </div>
            <div
                className={'img-close-icon img-close-icon_full-sized'}
                onClick={() => {
                    props.OnCloseAction();
                }}
            >
                <CloseIcon />
            </div>
        </div>
    );
});
