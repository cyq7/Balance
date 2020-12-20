    //main menu
    const balance = document.getElementById('balance');
    const plus = document.getElementById('plus');
    const minus = document.getElementById('minus');
    const history = document.getElementById('history');
    const showMoreBtn = document.getElementById('showMoreBtn');
    //adding form
    const form = document.getElementById('form');
    const transactionText = document.getElementById('transactionText');
    const transactionAmount = document.getElementById('transactionAmount');
    const decoration = document.getElementById('decoration');
    const btn = document.getElementById('btn');
    const switchBtn = document.getElementById('switch');
    const cancel = document.getElementById('cancel');
    //piggy bank
    const pig = document.getElementById('pig');
    const piggyBanks = document.getElementById('piggyBanks');
    const pigContainer = document.getElementById('pigContainer');
    const pigDecoration = document.getElementById('pigDecoration')
    const xBtn = document.getElementById('x');
    const openSavingsFormBtn = document.getElementById('openSavingsFormBtn');
    //add new piggyBank form
    const savingsForm = document.getElementById('savingsForm');
    const cancelPig = document.getElementById('cancelPig');
    const pigText = document.getElementById('pigText');
    const pigTarget = document.getElementById('pigTarget');

  
     //warning massage
    const showWarning = document.getElementById('showWarning');
    const buttonsContainer = document.getElementById('buttonsContainer');
    const warningCancelBtn = document.getElementById('warningCancelBtn');
    const warningAcceptBtn = document.getElementById('acceptBtn');
    const warning = document.getElementById('warning');


    const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

    let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

    console.log(transactions);

    const localStorageSavings = JSON.parse(localStorage.getItem('savings'));

    let savings = localStorage.getItem('savings') !== null ? localStorageSavings : [];

    console.log(savings)

  
 
    // add new transaction
    function addNewTransaction(e) {
        e.preventDefault();

        if (transactionText.value.trim() === '' || transactionAmount.value.trim() === '' || +transactionAmount.value.trim() === 0) {
            alert('Wprowadź tytuł oraz kwotę transakcji')
        } else if (transactionAmount.value.trim() < 0) {
            alert('Kwota transakcji nie może być ujemna.')
        } else {
            if (!switchBtn.checked) { //if it's expense change amount to negative number
                const transaction = {
                    id: generateID(),
                    text: transactionText.value,
                    amount: -transactionAmount.value //- sign can transform string to a number
                };
                console.log(transaction.amount);
                transactions.push(transaction);
                addTransactionDOM(transaction);

            } else { //if it's income just adding + to change it from string to number
                const transaction = {
                    id: generateID(),
                    text: transactionText.value,
                    amount: +transactionAmount.value //+ sign can transform string to a number
                };
                console.log(transaction.amount);
                transactions.push(transaction);
                addTransactionDOM(transaction);
            }

            updateBalance();

            updateLocalStorage();

            transactionText.value = '';
            transactionAmount.value = '';

            form.classList.remove('show');
        }
    }

    //generate random ID
    function generateID() {
        return Math.floor(Math.random() * 10000000000);
    }


    // add transactions to dom list
    function addTransactionDOM(transaction) {

        //get a correct sign
        const sign = transaction.amount < 0 ? '-' : '+';

        const item = document.createElement('li');
        item.id = "listItem";

        //add class based on value
        item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

        item.innerHTML = `
         ${transaction.text} <span>${sign} ${Math.abs(transaction.amount)}</span> <button onclick="deleteTransaction(${transaction.id})" class="deleteBtn">x</button>
    `;

        history.prepend(item);

        checkHistoryLength();
    };

    // update the balance/income/expense
    function updateBalance() {
        const amounts = transactions.map(transaction => transaction.amount);

        const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

        const income = amounts
            .filter(item => item > 0)
            .reduce((acc, item) => (acc += item), 0)
            .toFixed(2);

        const expense = (amounts
            .filter(item => item < 0)
            .reduce((acc, item) => (acc += item), 0) * -1)
            .toFixed(2);

        balance.innerHTML = `${total} <span>PLN</span>`;
        plus.innerHTML = `${income}`;
        minus.innerHTML = `${expense}`;

        updateDecoration(total);
    }

    //remove transaction by id
    function deleteTransaction(id) {
        transactions = transactions.filter(transaction => transaction.id !== id);

        updateLocalStorage();

        document.location.reload();

        init();
    }

    // delete transactions' history 
    function deleteTransactionsHistory() {
        localStorage.clear();
        document.location.reload();
        checkHistoryLength();
    }

    // change decoration color
    function updateDecoration(balance) {
        if (balance >= 0) {
            decoration.style.backgroundColor = "#05a000";
        } else {
            decoration.style.backgroundColor = "#e44545"
        }
    }


    //PIGGY BANKS

    function addNewPiggyBank(e) {
        e.preventDefault();
            if (pigText.value.trim() === '' || pigTarget.value.trim() === ''){
                alert('Wprowadź nazwę i kwotę celu na jaki zbierasz')
            } else {
                
                    const saving = {
                        id: generateID(),
                        text: pigText.value,
                        amount: 0,
                        target: +pigTarget.value
                    };
                    savings.push(saving);

                savingsForm.classList.remove('show');
                addPigDOM(saving);
                updateLocalStorage();
            }



        pigText.value = '';
        pigTarget.value = '';


        document.location.reload();
    };

    function addPigDOM(saving) {
        const pig = document.createElement('li');
        pig.id = saving.id;
        pig.classList.add('piggyBank');

        pig.innerHTML = `
        <i class="fas fa-2x fa-piggy-bank"></i> 
        <span class="pigTitle">${saving.text}</span> 
            <div class="pigTags">
                <p>${saving.amount}</p>
                <p>${saving.target}</p>
            </div>`;

        pigContainer.append(pig);

        const pigDetails = document.createElement('div');
        pigDetails.id = saving.id;
        pigDetails.classList.add('pigDetails');

        const percent = (saving.amount / saving.target * 100).toFixed(0);


        pigDetails.innerHTML = `
            <i id="backBtn" class="fas fa-2x fa-chevron-left"></i>
            <h2>${saving.text}</h2>
                <div class="inc-exp">
                <div>
                    <h4>Uzbierałeś</h4>
                    <p class="savings money">${saving.amount}</p>
                </div>
                <div>
                    <h4>Twój cel</h4>
                    <p class="target money">${saving.target}</p>
                </div>
            </div>
            <div class="box">
                <svg>
                    <circle cx="125" cy="125" r="125"></circle>
                    <circle class="circle" id="${saving.id}" cx="125" cy="125" r="125"></circle>
                </svg>
                <div class="percent">
                    <h5>${percent}<span>%</span> </h5>
                </div>
            </div>
            <div class="bottomContainer">
                <div onclick="openPayInForm(${saving.id})" class="payInFormBtn">
                    <i class="fas fa-2x fa-coins"></i>
                    <h4>Zasil <br> skarbonkę</h4>
                    </div>
                    <div onclick="deletePiggyBank(${saving.id}, ${saving.amount})" class="breakContainer">
                        <i class="fas fa-2x fa-heart-broken"></i>
                        <h4>Rozbij <br> skarbonkę</h4>
                    </div>
                    </div>
        `
        document.body.appendChild(pigDetails);

        const payInForm = document.createElement('div');
        payInForm.id = saving.id;
        payInForm.classList.add('payInForm');

        payInForm.innerHTML = `
            <h4>Zasil skarbonkę</h4>
            <input class="payInInput" type="number" min="10" max="5000" placeholder="Kwota zasilenia...">
            <button onclick="payIn(${saving.id})" id="payInBtn" class="payInBtn btn"> Wrzuć do skarbonki</button>
            <div onclick="closePayInForm()" class="cancel cancelPayInFormBtn">Anuluj</div>
        `
        
        document.body.appendChild(payInForm);
        
    }

    //remove biggybank by id
    function deletePiggyBank(id, amount) {
        const text = "Rozbicie skarbonki";
        const transaction = {
            id: generateID(),
            text: text,
            amount: +amount //+ sign can transform string into a number
        };
        transactions.push(transaction);
        addTransactionDOM(transaction);

        savings = savings.filter(saving => saving.id !== id);
        updateLocalStorage();
        init();
        document.location.reload();
    }

//payIn piggyBank function
    function payIn(id) {
        const payInFormCollection = document.querySelectorAll('.payInForm');
        const certainPiggyBank = document.getElementById(id);
        const payInInputCollection = document.querySelectorAll('.payInInput');

        payInInputCollection.forEach((input) => {

            if(!input.value.trim() == "") {
                const coin = Number(input.value);
                console.log(coin);

                const objIndex = savings.findIndex(saving => saving.id === id);
                savings[objIndex].amount += coin;
                
                savings.forEach((saving) => {
                    if(saving.id == id) {
                        const title = "Na cel: " + saving.text;
                        const transaction = {
                            id: generateID(),
                            text: title,
                            amount: -coin //+ sign can transform string into a number
                        };
                        transactions.push(transaction);
                        addTransactionDOM(transaction);
                    }
                })
                
            }

            updateLocalStorage();
            document.location.reload();

        })

        payInInputCollection.forEach((input) => {
            input.value = '';
        })

        }



    // update local storage transactions and piggyBanks
    function updateLocalStorage() {
        localStorage.setItem('transactions', JSON.stringify(transactions));
        localStorage.setItem('savings', JSON.stringify(savings));
    }


    // init app
    function init() {
        history.innerHTML = '';

        transactions.forEach(addTransactionDOM);
        savings.forEach(addPigDOM);
        updateBalance();
        updatePiggyBankProgress()
    }

    init();


    //______________________ EVENT LISTENERS_________________
    form.addEventListener('submit', addNewTransaction);

    //open form
    add.addEventListener('click', () => {
        form.classList.add("show");
    });

        cancel.addEventListener('click', () => {
        form.classList.remove("show");
    });


    //change transaction type
    switchBtn.addEventListener('change', () => {
        if (switchBtn.checked) {
            btn.style.backgroundColor = "#00a03d";
            console.log('work')
        } else {
            btn.style.backgroundColor = "#e44545"
        }
    });

//close payInForm 
function closePayInForm() {
    const payInFormCollection = document.querySelectorAll('.payInForm');
    payInFormCollection.forEach((payInForm) => {
        if (payInForm.classList.contains('show')) {
            payInForm.classList.remove('show');
        }
    })
}

    //open piggy bank container
        pig.addEventListener('click', () => {
        piggyBanks.classList.add('show');
        pigDecoration.classList.add('show');
    })

    //close piggy bank container
        xBtn.addEventListener('click', () =>{
        piggyBanks.classList.remove('show');
        pigDecoration.classList.remove('show');
        });


    //open savingsForm
        openSavingsFormBtn.addEventListener('click', ()=> {
            savingsForm.classList.add('show');
        })

    //close savingsForm
        cancelPig.addEventListener('click', () => {
            savingsForm.classList.remove('show');
        })

    //add new pig
        savingsForm.addEventListener('submit', addNewPiggyBank);

    // back to piggyBanks container

    const backBtn = document.querySelectorAll('#backBtn');
        backBtn.forEach((btn) => {
            btn.addEventListener('click', () => {
                const allPigDetails = document.querySelectorAll('.pigDetails');
                allPigDetails.forEach((pigD) => {
                    if (pigD.classList.contains('show')) {
                        pigD.classList.remove('show');
                    }
                })
            })
        })

// open specific piggy Bank
const piggyBanksCollection = document.querySelectorAll('.piggyBank');
document.addEventListener('click', function (e) {
    const allPigDetails = document.querySelectorAll('.pigDetails');
    if (e.target.classList.contains('piggyBank')) {
        const pigID = e.target.id;
        allPigDetails.forEach((pigD) => {
            if (pigD.id === pigID) {
                pigD.classList.add('show');
            }
        });
    }
})

//open payInForm
const payInFormCollection = document.querySelectorAll('.payInForm');
function openPayInForm(id) {
    payInFormCollection.forEach((payInForm) => {
        if (id == payInForm.id) {
            payInForm.classList.add('show');
        }
    })
}


    //show warning massage upon history delete attempt
        showWarning.addEventListener('click', () => {
        warning.classList.add('show');
        setTimeout(() => {
            buttonsContainer.classList.add('show')}
            , 2500);
    });

    // close warning massage
        warningCancelBtn.addEventListener('click', () => {
        warning.classList.remove('show');
        buttonsContainer.classList.remove('show');
    });

    //trigger deleteTransactionsHistory function
        warningAcceptBtn.addEventListener('click', () => {
        deleteTransactionsHistory();
        warning.classList.remove('show');
    });

const listItem = document.querySelectorAll('#listItem'); //quered after it was created / can't be moved on the top of script (when li does not exist)

function checkHistoryLength() {
    if (transactions.length > 5) {
        showMoreBtn.classList.add('show');
    } else {
        showMoreBtn.classList.remove('show');
    }
}

checkHistoryLength();

function showFullHistory() {
    if (!showMoreBtn.classList.contains('rotate')) {
        listItem.forEach((item) => {
            item.classList.add('show');
        })
        showMoreBtn.classList.add('rotate');
    } else {
        listItem.forEach((item) => {
            item.classList.remove('show');
        })
        showMoreBtn.classList.remove('rotate');
    }
}

showMoreBtn.addEventListener('click', showFullHistory);

function checkPigContainerLength() {
    if (savings.length > 5) {
        openSavingsFormBtn.classList.add('hide');
    } else {
        openSavingsFormBtn.classList.remove('hide');
    }
}

function changeTransactionColor() {
    const transactions = document.querySelectorAll('.history li')
    transactions.forEach((transaction) => {
        if (transaction.textContent.includes('Na cel:')) {
                transaction.classList = "";
                transaction.classList.add('gold');
            }
        })
}

changeTransactionColor();


function updatePiggyBankProgress() {
    const circles = document.querySelectorAll('.circle');
    const piggyBanksCollection = document.querySelectorAll('.piggyBank');
    circles.forEach((circle) => {
        savings.forEach((saving) => {
            if(saving.id == circle.id) {
                const percent = (saving.amount / saving.target * 100).toFixed(0);
                if(percent <= 100) {
                    circle.style.strokeDashoffset = (800 - (800 * percent) / 100);
                } else {
                    circle.style.strokeDashoffset = 0;
                    piggyBanksCollection.forEach((piggyBank) => {
                        if (saving.id == piggyBank.id) {
                            piggyBank.classList.add('finished');
                            const tags = piggyBank.querySelector('.pigTags');
                            tags.innerHTML = "Zebrałeś całą kwotę!"
                            tags.style.width = "50%";
                            tags.style.bottom = "1px";
                            tags.style.right = "-12px"
                            console.log('finished')
                        } 
                    })

                }
            }
        })
    })
}
