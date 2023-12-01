import { Button, Spinner } from 'react-bootstrap';

export function LoadingButton({
  onClick,
  status,
  type,
  disabled,
  text,
}: {
  onClick?: () => Promise<void>;
  type?: 'submit' | undefined;
  disabled?: boolean;
  status?: string;
  text: string;
}) {
  return (
    <Button
      variant="primary"
      type={type}
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
