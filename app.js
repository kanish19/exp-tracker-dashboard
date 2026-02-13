/* INITIAL DATA */
let transactions = JSON.parse(localStorage.getItem("tx")) || [
  { id: 1, name: "Salary", amount: 5000, type: "income" },
  { id: 2, name: "Rent", amount: 1500, type: "expense" }
];

/* ELEMENTS */
const list = document.getElementById("transactionList");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const balanceEl = document.getElementById("balance");

/* RENDER */
function render(data = transactions) {
  list.innerHTML = "";
  let income = 0;
  let expense = 0;

  data.forEach(tx => {
    const li = document.createElement("li");

    const signedAmount =
      tx.type === "income" ? tx.amount : -tx.amount;

    li.innerHTML = `
      <span>${tx.name}</span>
      <span class="${tx.type === 'income' ? 'pos' : 'neg'}">
        ${tx.type === 'income' ? '+' : '-'}₹${tx.amount}
      </span>
    `;

    list.appendChild(li);

    tx.type === "income"
      ? income += tx.amount
      : expense += tx.amount;
  });

  incomeEl.textContent = `₹${income}`;
  expenseEl.textContent = `₹${expense}`;
  balanceEl.textContent = `₹${income - expense}`;

  updateChart(income, expense);
  localStorage.setItem("tx", JSON.stringify(transactions));
}

/* FILTERS */
document.getElementById("search").addEventListener("input", applyFilters);
document.getElementById("typeFilter").addEventListener("change", applyFilters);

function applyFilters() {
  const search = document.getElementById("search").value.toLowerCase();
  const type = document.getElementById("typeFilter").value;

  let filtered = transactions.filter(tx =>
    tx.name.toLowerCase().includes(search)
  );

  if (type !== "all") {
    filtered = filtered.filter(tx => tx.type === type);
  }

  render(filtered);
}

/* CHART */
function updateChart(income, expense) {
  if (window.chart) window.chart.destroy();

  window.chart = new Chart(
    document.getElementById("expenseChart"),
    {
      type: "doughnut",
      data: {
        labels: ["Income", "Expense"],
        datasets: [{
          data: [income, expense],
          backgroundColor: ["#4f8cff", "#ff5f5f"]
        }]
      }
    }
  );
}

/* MODAL */
function openTransactionModal() {
  document.getElementById("transactionModal").classList.remove("hidden");
}

function closeTransactionModal() {
  document.getElementById("transactionModal").classList.add("hidden");
}

function submitTransaction() {
  const name = document.getElementById("txName").value.trim();
  const amount = Number(document.getElementById("txAmount").value);
  const type = document.getElementById("txType").value;

  if (!name || amount <= 0) {
    alert("Enter valid name and amount");
    return;
  }

  transactions.push({
    id: Date.now(),
    name,
    amount,
    type
  });

  document.getElementById("txName").value = "";
  document.getElementById("txAmount").value = "";

  closeTransactionModal();
  applyFilters();
}

/* INIT */
render();
