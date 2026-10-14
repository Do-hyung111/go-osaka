// DOM 요소 가져오기
const totalBalance = document.getElementById('total-balance');
const totalIncome = document.getElementById('total-income');
const totalExpense = document.getElementById('total-expense');
const form = document.getElementById('transaction-form');
const dateInput = document.getElementById('date');
const typeInput = document.getElementById('type');
const titleInput = document.getElementById('title');
const amountInput = document.getElementById('amount');
const transactionList = document.getElementById('transaction-list');

// 오늘 날짜 기본 지정
dateInput.value = new Date().toISOString().substring(0, 10);

// localStorage에서 내역 불러오기 (없으면 빈 배열)
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// 화면 새로고침 및 데이터 업데이트
function updateUI() {
    // 1. 리스트 비우기
    transactionList.innerHTML = '';

    let incomeSum = 0;
    let expenseSum = 0;

    // 2. 내역 순회하면서 리스트 그리기 및 합계 계산
    transactions.forEach((item, index) => {
        const li = document.createElement('li');
        li.classList.add('transaction-item');

        const amountNum = Number(item.amount);
        const formattedAmount = amountNum.toLocaleString('ko-KR');

        if (item.type === 'income') {
            incomeSum += amountNum;
        } else {
            expenseSum += amountNum;
        }

        li.innerHTML = `
            <div class="item-info">
                <span class="item-title">${item.title}</span>
                <span class="item-date">${item.date}</span>
            </div>
            <div class="item-right">
                <span class="item-amount ${item.type}">
                    ${item.type === 'income' ? '+' : '-'}${formattedAmount}엔
                </span>
                <button class="delete-btn" onclick="deleteTransaction(${index})">✕</button>
            </div>
        `;

        transactionList.appendChild(li);
    });

    // 3. 총 잔액/수입/지출 카드 업데이트
    const balance = incomeSum - expenseSum;
    totalBalance.textContent = `${balance.toLocaleString('ko-KR')}엔`;
    totalIncome.textContent = `+${incomeSum.toLocaleString('ko-KR')}엔`;
    totalExpense.textContent = `-${expenseSum.toLocaleString('ko-KR')}엔`;

    // 4. localStorage에 저장
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// 항목 추가
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const newTransaction = {
        date: dateInput.value,
        type: typeInput.value,
        title: titleInput.value,
        amount: amountInput.value
    };

    transactions.push(newTransaction);
    updateUI();

    // 입력 필드 초기화
    titleInput.value = '';
    amountInput.value = '';
});

// 항목 삭제
function deleteTransaction(index) {
    transactions.splice(index, 1);
    updateUI();
}

// 최초 실행
updateUI();