import './Button.scss';

type ButtonProps = {
  onClick: () => void;
  text: string;
};

export const Button = (props: ButtonProps): JSX.Element => {
  return (
    <button className="button" onClick={props.onClick}>
      {props.text}
    </button>
  );
};
