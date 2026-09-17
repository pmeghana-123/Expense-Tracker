const description = document.getElementById("description");
const amount = document.getElementById("amount");
const search = document.getElementById("search");
const filterCategory = document.getElementById("filterCategory");
const type = document.getElementById("type");
const category = document.getElementById("category");
const date = document.getElementById("date");

const addBtn = document.getElementById("addBtn");
const transactionList = document.getElementById("transactionList");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expenses = document.getElementById("expenses");
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let editIndex=-1;
addBtn.addEventListener("click", function() {

    const transaction = {
        description: description.value,
        amount: Number(amount.value),
        type: type.value,
        category: category.value,
        date: date.value
    };

    if (editIndex === -1) {
    transactions.push(transaction);
} else {
    transactions[editIndex] = transaction;
    editIndex = -1;
    addBtn.textContent="Add Transaction";
}
    localStorage.setItem("transactions", JSON.stringify(transactions));
    displayTransactions();
    updateSummary();

    console.log(transactions);
});
function displayTransactions(list=transactions) {

    transactionList.innerHTML = "";

    list.forEach(function(transaction,index) {

        const li = document.createElement("li");
        li.classList.add(transaction.type);
        li.innerHTML = `
            <div>
                <strong>${transaction.description}</strong>
                <br>
                ${transaction.category} | ${transaction.date}
            </div>

            <span>
                ₹${transaction.amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
})}
            </span>
            <button>Edit</button>
            <button>Delete</button>
        `;

        transactionList.appendChild(li);
        const deleteBtn = li.querySelectorAll("button")[1];
        const editBtn=li.querySelectorAll("button")[0];
        editBtn.addEventListener("click", function() {
            editIndex=index;
        description.value = transaction.description;
amount.value = transaction.amount;
type.value = transaction.type;
category.value = transaction.category;
date.value = transaction.date;
addBtn.textContent="Update Transaction";
});

    deleteBtn.addEventListener("click", function() {
    transactions.splice(index, 1);
    localStorage.setItem("transactions",JSON.stringify(transactions));
    displayTransactions();
    updateSummary();
    });
    });
}
search.addEventListener("input", function() {

    const searchText = search.value.toLowerCase();

    const filteredTransactions = transactions.filter(function(transaction) {
        return transaction.description.toLowerCase().includes(searchText);
    });

    displayTransactions(filteredTransactions);
});
filterCategory.addEventListener("change", function() {

    const selectedCategory = filterCategory.value;

    const filteredTransactions = transactions.filter(function(transaction) {

        if (selectedCategory === "all") {
            return true;
        }

        return transaction.category === selectedCategory;
    });

    displayTransactions(filteredTransactions);
});
function updateSummary() {

    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(function(transaction) {

        if (transaction.type === "income") {
            totalIncome += transaction.amount;
        } else {
            totalExpenses += transaction.amount;
        }

    });

    const totalBalance = totalIncome - totalExpenses;

    income.textContent = `₹${totalIncome.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
})}`;

expenses.textContent = `₹${totalExpenses.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
})}`;

balance.textContent = `₹${totalBalance.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
})}`;
}
displayTransactions();
    updateSummary();
