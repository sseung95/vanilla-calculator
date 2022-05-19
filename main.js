const operatorEls = document.querySelectorAll('.operators > div');
const numberEls = document.querySelectorAll('.numbers > div');
const resultEl = document.querySelector('#result');

const numbers = [];
const operators = [];

let result = 0;
let isNumber = false;
let isOperator = false;
let isResultDisplay = false;

/* 이벤트 */
// 연산자 눌렀을 때
operatorEls.forEach((operatorEl) =>
  operatorEl.addEventListener('click', (e) => {
    // 처음값이 연산자면 동작되지 않도록
    if (numbers.length === 0) return;

    // 연산자가 여러번 눌리지 않도록 이전에 눌린값이 operator면 동작되지 않도록
    if (isOperator) return;

    // 이전에 눌린 값이 연산자라고 표시
    isOperator = true;
    isNumber = false;

    const value = e.target.textContent;
    operators.push(value);

    // 화면에 출력
    display(value);
  })
);

// 숫자 눌렀을 때
numberEls.forEach((numberEl) =>
  numberEl.addEventListener('click', (e) => {
    const value = e.target.textContent;

    // 눌린 숫자값이 없을 때는 화면 비워주기
    if (numbers.length === 0) {
      clearDisplay();
    }

    // clear 눌렀을 때 모두 비워주기
    if (value === 'C') {
      clearAll();
      numbers.splice(0);
      return;
    }

    if (isNumber) {
      // 이전에 눌린 값이 숫자이면 현재 숫자 값에서 계속 더해지도록
      const lastNum = numbers[numbers.length - 1];
      numbers[numbers.length - 1] = String(lastNum) + value;
    } else {
      // 이전에 눌린 값이 숫자가 아니면 새로 숫자 배열에 넣어주기
      numbers.push(value);
    }

    // 현재 눌린 값이 숫자라고 표시
    isNumber = true;
    isOperator = false;

    // 화면에 출력
    display(value);
  })
);

// 결과(=) 눌렀을 때
resultEl.addEventListener('click', () => {
  // 입력된 숫자가 없거나, 입력된 숫자의 개수와 연산자 개수가 동일할 때 (ex. 7+3* , 89-) 동작 x
  if (numbers.length === 0 || numbers.length === operators.length) return;

  // 결과를 눌렀을 시점에 연산자 배열의 길이만큼 반복해야 모든 연산자 요소에 접근할 수 있다.
  const len = operators.length;

  for (let i = 0; i < len; i++) {
    // 연산자 배열 안에 곱하기, 나누기 있으면
    if (operators.includes('×') || operators.includes('÷')) {
      // 곱하기, 나누기 위치한 인덱스 찾아서 해당 인덱스를 계산
      const idx = operators.findIndex(
        (operator) => operator === '×' || operator === '÷'
      );
      calculate(idx);
    } else {
      // 연산자 배열 안에 곱하기, 나누기 없으면 더하기, 빼기 위치한 인덱스 찾아서 해당 인덱스를 계산
      const idx = operators.findIndex(
        (operator) => operator === '+' || operator === '-'
      );
      calculate(idx);
    }
  }

  // numbers 배열에서 계산하고 난 뒤 하나 남은 값이 전체 계산 결과값이므로
  result = numbers[0];

  clearAll();
  display(result);
  isResultDisplay = true;
});

/* 함수 */
// 계산 함수
function calculate(idx) {
  let calValue = 0;

  const num1 = +numbers[idx];
  const num2 = +numbers[idx + 1];
  const operator = operators[idx];

  switch (operator) {
    case '+':
      calValue = num1 + num2;
      break;
    case '-':
      calValue = num1 - num2;
      break;
    case '×':
      calValue = num1 * num2;
      break;
    case '÷':
      calValue = num1 / num2;
      break;
    default:
      throw Error('잘못된 연산자 입니다.');
  }

  // 계산한 해당 연산자와 숫자는 배열에서 삭제하고, 숫자 배열의 해당 인덱스 자리를 계산된 결과 값으로 바꾼다.
  operators.splice(idx, 1);
  numbers.splice(idx, 2, calValue);
}

// 화면에 받은 변수 추가하여 출력
function display(val) {
  const input = document.querySelector('#input');
  input.textContent += val;
}

// 화면 초기화
function clearDisplay() {
  const input = document.querySelector('#input');
  input.textContent = '';
}

// 모든 배열 및 화면 초기화
function clearAll() {
  clearDisplay();

  numbers.splice(0);
  operators.splice(0);

  isNumber = false;
  isOperator = false;
}
