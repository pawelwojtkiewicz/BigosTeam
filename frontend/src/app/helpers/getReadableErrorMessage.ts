export function getReadableErrorMessage(message: string): string {
  switch (message) {
	case 'AUTH_CODE_USED': return 'Kod autoryzacyjny został już użyty.';
	case 'AUTH_CODE_CANCEL': return 'Anulowano autoryzację.';
	case 'AUTH_CODE_EXPIRED': return 'Kod autoryzacyjny wygasł.';
	default: return message;
  }
}