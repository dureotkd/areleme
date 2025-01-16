export function isValidEmail(email: string): boolean {
  const emailRegEx = /^A-Za-z0-9@A-Za-z0-9.[A-Za-z]{2,3}$/;

  return emailRegEx.test(email);
}

export function convertToPyeong(squareMeters: number): number {
  const conversionFactor = 3.3058;
  return Math.ceil(parseFloat((squareMeters / conversionFactor).toFixed(2)));
}
