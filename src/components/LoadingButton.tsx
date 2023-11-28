import { Button, Spinner } from 'react-bootstrap';

export function LoadingButton({
    onClick,
  status,
  disabled,
  text,
}: {
    onClick: () => Promise<void>;
  disabled?: boolean;
  status: string;
  text: string;
}) {
  return (
    <Button
      variant="primary"
      onClick={onClick}
      disabled={disabled || status == 'loading'}
    >
      {status == 'loading' ? (
        <Spinner animation="border" role="status" size="sm">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        text
      )}
    </Button>
  );
}
