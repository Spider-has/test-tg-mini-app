import './TopPanel.scss';

export const TopPanel = (props: { children: React.ReactNode }) => {
    return <div className="top-panel">{props.children}</div>;
};
