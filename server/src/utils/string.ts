export function isValidEmail(email: string): boolean {
  const emailRegEx = /^A-Za-z0-9@A-Za-z0-9.[A-Za-z]{2,3}$/;

  return emailRegEx.test(email);
}
