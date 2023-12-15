import { Button } from 'react-bootstrap';
import './Triples.css';
export function TripleButtonFactory({
  buttonData,
  onClick,
}: {
  buttonData: { text: string; index: number };
  onClick?: any;
}) {
  const buttonClick = () => {
    if (onClick) onClick(buttonData.index);
  };
  const getButtonComponent = (buttonData: { text: string; index: number }) => {
    if (buttonData.text) {
      return (
        <div className="d-grid gap-2">
          <Button className="btn3d m-0" onClick={buttonClick}>
            {buttonData.text}
          </Button>
        </div>
      );
    }
    return (
      <div className="d-grid gap-2" style={{ zIndex: -1000 }}>
        <Button className="btn-no-color">&nbsp;</Button>
      </div>
    );
  };
  return <>{getButtonComponent(buttonData)}</>;
}
