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

  maxLengthCheck(target) {
    if (target.value.length > target.maxLength) {
      //target.maxLength : 매게변수 오브젝트의 maxlength 속성 값입니다.
      target.value = target.value.slice(0, target.maxLength);
    }
  },
};

export default number;
