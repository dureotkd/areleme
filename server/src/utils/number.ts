export function maxLengthCheck(target: any) {
  if (target.value.length > target.maxLength) {
    //target.maxLength : 매게변수 오브젝트의 maxlength 속성 값입니다.
    target.value = target.value.slice(0, target.maxLength);
  }
}
