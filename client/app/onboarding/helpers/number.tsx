const number = {
  convertToKoreanWon(amount: number): string {
    const units = ['', '만', '억', '조'];
    let result = '';
    let unitIndex = 0;

    while (amount > 0) {
      const chunk = amount % 10000;
      if (chunk > 0) {
        result = chunk + units[unitIndex] + (result ? ' ' + result : '');
      }
      amount = Math.floor(amount / 10000);
      unitIndex++;
    }

    return result || '0원';
  },
};

export default number;
