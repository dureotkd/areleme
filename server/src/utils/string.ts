export function isValidEmail(email: string): boolean {
  const emailRegEx = /^A-Za-z0-9@A-Za-z0-9.[A-Za-z]{2,3}$/;

  return emailRegEx.test(email);
}

export function convertToPyeong(squareMeters: number): number {
  const conversionFactor = 3.3058;
  return Math.ceil(parseFloat((squareMeters / conversionFactor).toFixed(2)));
}

export function convertToSquareMeters(pyeong: number): number {
  const conversionFactor = 3.3058;
  return Math.ceil(parseFloat((pyeong * conversionFactor).toFixed(2)));
}

export function convertLImit(page: number, per: number = 10): string {
  const offset = (page - 1) * per;
  const limit = offset + per;

  return `LIMIT ${offset},${limit}`;
}
