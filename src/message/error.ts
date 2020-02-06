/**
 * Error message is a specail class for handling error packets.
 */
type ErrorDetails = {
  code: number,
  message: string,
};

export default class ErrorMessage {
  /** Packet hex to error message */
  static Errors: Record<string, ErrorDetails> = {
    '53feffff': {
      code: 404,
      message: 'Invalid packet was sent',
    },
    '6cfeffff': {
      code: -1,
      message: 'Invalid auth key',
    },
  };

  /** List of possbile packets */
  static ErrorList: string[] = Object.keys(ErrorMessage.Errors);

  /** Details of received error */
  error: ErrorDetails;

  constructor(err: string) {
    this.error = ErrorMessage.Errors[err];
  }
}