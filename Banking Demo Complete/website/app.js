const $ = (s) => document.querySelector(s);
const escape = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
const paths = {
  menu: "M4 6h16M4 12h16M4 18h16",
  back: "m14 5-7 7 7 7",
  chevron: "m9 5 7 7-7 7",
  accounts: "M8 6h12M8 12h12M8 18h12M4 6h.1M4 12h.1M4 18h.1",
  pay: "M6 3v18M9 6H5a3 3 0 0 0 0 6h2a3 3 0 0 1 0 6H3M14 8h7m-3-3 3 3-3 3M21 16h-7m3-3-3 3 3 3",
  cards: "M3 4h18v16H3zM3 9h18M6 16h4",
  products: "M12 8v8M8 12h8M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  transfer: "M3 7h16l-4-4M21 17H5l4 4M19 7l-4 4M5 17l4-4",
  dollar:
    "M12 4v16M16 7H10a3 3 0 0 0 0 5h4a3 3 0 0 1 0 5H8M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  savings: "M5 9 3 7v6l3 2 1 4h3v-3h6v3h3l1-5 2-2-2-2a7 7 0 0 0-5-5l1-3-4 2M8 6l3-1M17 9h.1",
  vault: "M3 3h18v18H3zM8 12h8M12 8v8M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0",
  search: "M16 16l5 5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  settings:
    "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1z",
  lock: "M6 10h12v11H6zM8 10V6a4 4 0 0 1 8 0v4M12 14v3",
  phone: "M7 2h10v20H7zM10 18h4",
  check: "m5 12 4 4L20 5",
  info: "M12 11v6M12 7h.1M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12M3 3l18 18",
  edit: "m4 16 12-12 4 4L8 20H4zM14 6l4 4",
  wallet: "M3 5h18v15H3zM16 11h5v5h-5z",
};
function icon(n) {
  return `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="${paths[n] || paths.info}"/></svg>`;
}
const chevron = `<span class="chevron">${icon("chevron")}</span>`;
const mark =
  '<img class="brand-mark" src="assets/brand-mark.png" alt="" aria-hidden="true" width="256" height="180">';
const initial = {
  cardNumber: "000000XXXXXX0000",
  name: "Alex Morgan",
  age: 21,
  email: "alex@example.com",
  phone: "0400 000 000",
  locked: false,
  accounts: [
    { id: "everyday", name: "Everyday Youth Account", number: "00001234", opening: 438.2 },
    { id: "savings", name: "Youth eSaver Account", number: "00005678", opening: 1000 },
  ],
  transactions: [
    {
      id: "t1",
      account: "everyday",
      date: "2026-09-29",
      title: "Card Purchase",
      description: "HARBOUR COFFEE",
      amount: -6.5,
      category: "Food & drink",
    },
    {
      id: "t2",
      account: "everyday",
      date: "2026-09-28",
      title: "Funds Transfer",
      description: "From: Sample account",
      amount: 50,
      category: "Transfer",
    },
    {
      id: "t3",
      account: "everyday",
      date: "2026-09-27",
      title: "Fast Pymt Out",
      description: "Sample payment",
      amount: -24,
      category: "Payment",
    },
    {
      id: "t4",
      account: "everyday",
      date: "2026-09-26",
      title: "Card Purchase",
      description: "LOCAL GROCER",
      amount: -47.67,
      category: "Shopping",
    },
    {
      id: "t5",
      account: "everyday",
      date: "2026-09-25",
      title: "Fast Pymt In",
      description: "SAMPLE PAYROLL",
      amount: 259,
      category: "Income",
    },
    {
      id: "t6",
      account: "savings",
      date: "2026-09-28",
      title: "Funds Transfer",
      description: "From: Sample account",
      amount: 20,
      category: "Transfer",
    },
  ],
  payees: [
    { name: "Jamie Taylor", bsb: "000000", number: "00001111" },
    { name: "Sam Lee", bsb: "000000", number: "00002222" },
  ],
};
let state = structuredClone(initial);
try {
  const x = JSON.parse(localStorage.getItem("southern-demo-v1"));
  if (x && Array.isArray(x.accounts) && Array.isArray(x.transactions)) state = x;
} catch {}
let page = "login",
  accountId = "everyday",
  filter = "ALL",
  query = "",
  searching = false,
  selectedTx = null,
  product = "Home loans",
  visibleTransactions = 5,
  historyScrollArmed = false,
  tapTimes = [],
  lastFocus = null;
const money = (n) =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(n);
const amount = (n) => `${n < 0 ? "-" : ""}${money(Math.abs(n))}`;
const account = () => state.accounts.find((a) => a.id === accountId);
const balance = (a) =>
  Math.round(
    (a.opening +
      state.transactions.filter((t) => t.account === a.id).reduce((s, t) => s + t.amount, 0)) *
      100,
  ) / 100;
function localDay(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
state.cardNumber = state.cardNumber || initial.cardNumber;
state.accounts.forEach((a) => (a.bsb = a.bsb || "000000"));
state.transactions.forEach((t) => {
  const seed = initial.transactions.find((i) => i.id === t.id);
  if (t.dayOffset === undefined && seed && t.date === seed.date) {
    t.dayOffset = Math.round(
      (new Date(seed.date + "T12:00:00") - new Date("2026-09-29T12:00:00")) / 86400000,
    );
  }
  if (Number.isInteger(t.dayOffset)) t.date = localDay(t.dayOffset);
});
const sydneyPlaces = [
  "Manly",
  "Newtown",
  "Surry Hills",
  "Parramatta",
  "Chatswood",
  "Bondi Junction",
  "Glebe",
  "Burwood",
  "Darlinghurst",
  "Macquarie Park",
  "Marrickville",
  "Circular Quay",
  "Strathfield",
  "Randwick",
  "Haymarket",
];
function pickPlace() {
  return sydneyPlaces[Math.floor(Math.random() * sydneyPlaces.length)];
}
function ensureDemoHistory() {
  if (state.historyVersion === 2) return;
  for (const a of state.accounts) {
    const existing = state.transactions.filter((t) => t.account === a.id);
    for (const t of existing) {
      const seed = initial.transactions.find((i) => i.id === t.id);
      if (seed && seed.description === t.description)
        t.description =
          t.amount > 0
            ? `From: Sample sender · ${pickPlace()}`
            : `${["CORNER CAFE", "LOCAL MARKET", "NEIGHBOURHOOD STORE"][Math.floor(Math.random() * 3)]} · ${pickPlace()}`;
    }
    const oldest = existing.length
      ? Math.min(
          ...existing.map((t) =>
            Math.round(
              (new Date(t.date + "T12:00:00") - new Date(localDay() + "T12:00:00")) / 86400000,
            ),
          ),
        )
      : 0;
    let added = 0;
    for (let i = existing.length; i < 50; i++) {
      const credit = a.id === "savings" ? i % 4 !== 3 : i % 3 === 1;
      const cents = credit
        ? 1000 + Math.floor(Math.random() * 24000)
        : 320 + Math.floor(Math.random() * 7500);
      const value = (credit ? cents : -cents) / 100;
      const offset = oldest - Math.floor((i - existing.length) / 2) - 1;
      state.transactions.push({
        id: crypto.randomUUID(),
        account: a.id,
        dayOffset: offset,
        date: localDay(offset),
        title: credit ? "Fast Pymt In" : "Card Purchase",
        description: credit
          ? `From: Sample sender · ${pickPlace()}`
          : `${["CORNER CAFE", "LOCAL MARKET", "NEIGHBOURHOOD STORE", "VILLAGE EATERY"][i % 4]} · ${pickPlace()}`,
        payer: "Sample sender",
        amount: value,
        category: credit ? "Income" : "Shopping",
        status: "Processed",
      });
      added += value;
    }
    // Backfill sample history without changing the user's current balance.
    a.opening = Math.round((a.opening - added) * 100) / 100;
  }
  state.historyVersion = 2;
}
ensureDemoHistory();
function matchingTransactions() {
  return state.transactions
    .filter((t) => t.account === accountId)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
    .filter(
      (t) =>
        (filter !== "DEBITS" || t.amount < 0) &&
        (filter !== "CREDITS" || t.amount >= 0) &&
        `${t.title} ${t.description} ${t.category}`.toLowerCase().includes(query.toLowerCase()),
    );
}
function loadMoreTransactions() {
  if (page !== "detail" || visibleTransactions >= matchingTransactions().length) return;
  historyScrollArmed = false;
  const scroll = $("#main").scrollTop;
  visibleTransactions += 5;
  $("#transactions").innerHTML = txList();
  $("#main").scrollTop = scroll;
}

function maskedCard(grouped = false) {
  const n = String(state.cardNumber)
    .replace(/[^0-9xX]/g, "")
    .toUpperCase();
  return grouped ? n.replace(/(.{4})/g, "$1 ").trim() : n;
}
function triple(key, action) {
  const now = Date.now();
  if (triple.key !== key) tapTimes = [];
  triple.key = key;
  tapTimes = tapTimes.filter((t) => now - t < 1300);
  tapTimes.push(now);
  if (tapTimes.length === 3) {
    tapTimes = [];
    action();
  }
}
paths.receipt =
  "M6 2h12a1 1 0 0 1 1 1v19l-2-2-2 2-2-2-2 2-2-2-2 2V3a1 1 0 0 1 1-1M10 6v8M12 7H9a2 2 0 0 0 0 4h1a2 2 0 0 1 0 4H8M14 8h3M14 11h2M14 14h3";
paths.cards =
  "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2M2 9h20M6 15h.1";
paths.share = "M12 16V2m-4 4 4-4 4 4M8 9H5v13h14V9h-3";
paths.pay = "M7 2v20M11 6H6a3 3 0 0 0 0 6h2a3 3 0 0 1 0 6H3M14 12h8m-4-4 4 4-4 4";
paths.savings =
  "M20 11h2v4l-3 2-1 4h-3v-3H9v3H6l-1-5-3-2V9h3l1-5 4 3M12 5a3 3 0 1 0 0-6 3 3 0 0 0 0 6M9 9h5M17 11h.1";
function loginView() {
  return `<div class="login-brand">${mark}<span>Great Southern<br>Bank</span></div><form id="login-form"><h1>Welcome back,<br><span>${escape(state.name.split(" ")[0])}</span></h1><label class="passcode-label">Passcode<input name="passcode" id="passcode" type="password" inputmode="numeric" autocomplete="off" maxlength="4" pattern="[0-9]{4}" aria-label="Passcode" required></label><p id="login-error" role="alert"></p><button class="btn login-button">Login</button><p class="login-help">Demo passcode: 3012</p></form><p class="login-foot">Independent banking prototype</p>`;
}

function save() {
  try {
    localStorage.setItem("southern-demo-v1", JSON.stringify(state));
  } catch {
    toast("Changes work here, but this browser could not save them.");
  }
}
function toast(s) {
  $("#toast").textContent = s;
  $("#toast").classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => $("#toast").classList.remove("show"), 2600);
}
function go(p) {
  closeOverlay();
  tapTimes = [];
  page = p;
  visibleTransactions = 5;
  query = "";
  searching = false;
  render();
  $("#main").scrollTop = 0;
  $("#main").classList.remove("animate");
  void $("#main").offsetWidth;
  $("#main").classList.add("animate");
}
function row(title, sub, ico, action) {
  return `<button class="list-row" data-action="${action}">${icon(ico)}<div><strong>${escape(title)}</strong>${sub ? `<p>${escape(sub)}</p>` : ""}</div>${chevron}</button>`;
}
function render() {
  $(".app").classList.toggle("login-screen", page === "login");
  $(".app").classList.toggle("transaction-screen", page === "tx");
  $(".app").dataset.screen = page;
  if (page === "login") {
    $("#header").innerHTML = "";
    $("#nav").innerHTML = "";
    $("#main").innerHTML = loginView();
    return;
  }
  const titles = {
    accounts: "",
    detail: "Account details",
    cards: "Cards",
    products: "Open or apply",
    transfer: "Transfer funds",
    payees: "Pay anyone",
    personal: "Personal details",
    tx: "Transaction details",
    vault: "The Vault",
    loan: "Open or apply",
  };
  const root = ["accounts", "cards", "products"].includes(page);
  $("#header").innerHTML =
    `<button class="left" data-action="${root ? "menu" : "back"}" aria-label="${root ? "Open menu" : "Back"}">${icon(root ? "menu" : "back")}</button>${page === "accounts" ? mark : `<h1>${titles[page] || ""}</h1>`}${page === "detail" ? `<button class="right" data-action="addtx" aria-label="Add demo transaction">${icon("products")}</button>` : ""}`;
  $("#nav").innerHTML = ["accounts", "pay", "cards", "products"]
    .map(
      (n) =>
        `<button data-action="nav-${n}" class="${page === n || (n === "accounts" && ["detail", "tx", "vault"].includes(page)) || (n === "pay" && ["transfer", "payees"].includes(page)) ? "active" : ""}">${icon(n)}${n.toUpperCase()}</button>`,
    )
    .join("");
  const views = {
    accounts: accountsView,
    detail: detailView,
    cards: cardsView,
    products: productsView,
    transfer: transferView,
    payees: payeesView,
    personal: personalView,
    tx: txView,
    vault: vaultView,
    loan: loanView,
  };
  $("#main").innerHTML = views[page]();
}
function accountsView() {
  return `<div class="section-title">Accounts</div>${state.accounts.map((a, i) => `<div class="band">${icon(i ? "savings" : "dollar")}${i ? "SAVINGS" : "EVERYDAY"}</div><button class="account" data-account="${a.id}"><div><div class="account-name">${escape(a.name)}</div><div class="meta">Acc: ${escape(a.number)}</div></div><div class="money-side"><div class="meta">Available</div><strong>${money(balance(a))}</strong><div class="meta">Balance ${money(balance(a))}</div></div>${chevron}</button>`).join("")}<div class="band">${icon("vault")}THE VAULT</div><div class="vault-row"><span>Hide your account<br>from yourself</span><button class="text-link" data-action="vault">Learn more ›</button></div><div class="open-area"><p>For new accounts or loans</p><button class="btn outline" data-action="nav-products">Open or apply</button></div>`;
}
function txList() {
  let tx = state.transactions
    .filter((t) => t.account === accountId)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  let run = account().opening;
  const running = {};
  [...tx].reverse().forEach((t) => {
    run += t.amount;
    running[t.id] = run;
  });
  tx = tx.filter(
    (t) =>
      (filter !== "DEBITS" || t.amount < 0) &&
      (filter !== "CREDITS" || t.amount >= 0) &&
      `${t.title} ${t.description} ${t.category}`.toLowerCase().includes(query.toLowerCase()),
  );
  const hasMore = tx.length > visibleTransactions;
  tx = tx.slice(0, visibleTransactions);
  let date = "";
  return tx.length
    ? tx
        .map((t) => {
          const head =
            t.date !== date
              ? `<div class="date-band">${new Date(t.date + "T12:00:00").toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" })}</div>`
              : "";
          date = t.date;
          return (
            head +
            `<button class="transaction" data-tx="${escape(t.id)}">${icon(t.title.includes("Transfer") ? "transfer" : t.amount > 0 ? "dollar" : "pay")}<div class="tx-body"><div class="tx-title">${escape(t.title)}</div><div class="tx-description">${escape(t.description)}</div></div><div class="tx-value"><strong data-tx-amount="${escape(t.id)}" role="button" tabindex="0" aria-label="Triple-tap ${escape(amount(t.amount))} to edit sample transaction" class="${t.amount > 0 ? "credit" : ""}">${amount(t.amount)}</strong><span class="chevron">›</span><div class="meta">Balance ${money(running[t.id])}</div></div></button>`
          );
        })
        .join("") +
        (hasMore
          ? '<button class="load-more" data-action="load-more">Load 5 more transactions</button>'
          : '<div class="history-end">End of sample transactions</div>')
    : '<div class="empty">No transactions to show.</div>';
}
function detailView() {
  const a = account();
  return `<div class="detail-head"><h2>${icon(a.id === "savings" ? "savings" : "dollar")}${escape(a.name)}</h2><div class="detail-summary"><div>BSB ${escape(a.bsb)}<br>Acc ${escape(a.number)}</div><div class="money-side"><div class="meta">Available</div><strong>${money(balance(a))}</strong><div class="meta">Balance ${money(balance(a))}</div></div></div></div><div class="tabs" role="tablist">${["ALL", "DEBITS", "CREDITS"].map((t) => `<button role="tab" aria-selected="${filter === t}" class="${filter === t ? "selected" : ""}" data-filter="${t}">${t}</button>`).join("")}<button class="search-btn" data-action="search" aria-label="Search transactions">${icon("search")}</button></div>${searching ? '<div class="search-field"><input id="search" aria-label="Search transactions" placeholder="Search transactions" value="' + escape(query) + '"></div>' : ""}<div id="transactions">${txList()}</div>`;
}
function cardsView() {
  const a = state.accounts[0];
  return `<div class="card-hero"><button class="bank-card" data-action="card-tap" aria-label="Demo card. Tap three times to edit demo details."><img src="assets/card-hd.png" alt="Great Southern Bank reference card artwork"><span class="sr">Tap three times to edit sample profile</span></button><div class="card-account">${escape(a.name)} (${escape(a.number)})</div></div><div class="info-table"><div class="info-row"><span>Card number</span><strong>${escape(maskedCard(true))}</strong></div><div class="info-row"><span>Card holder</span><span>${escape(state.name)}</span></div></div><div class="card-spacer"></div><div class="wallet">${icon("wallet")}Card added to Apple Wallet<span class="check">✓</span></div><div class="label">CARD SETTINGS</div>${row("Set PIN", "Or edit an existing PIN", "lock", "pin")}<button class="list-row" data-action="lock" role="switch" aria-checked="${state.locked}">${icon("lock")}<div><strong>Temporary card lock</strong><p>Block all transactions on this card</p></div><span class="switch ${state.locked ? "on" : ""}">${state.locked ? "ON" : "OFF"}</span></button>${row("Report lost or stolen card", "Cancel and replace this card", "cards", "lost")}`;
}
function productsView() {
  return [
    "Home loans",
    "Personal loans",
    "Transaction accounts",
    "Savings accounts",
    "Term deposits",
    "Credit cards",
    "Business",
    "Insurance",
  ]
    .map(
      (p) =>
        `<button class="list-row" data-product="${p}"><div><strong>${p}</strong></div>${chevron}</button>`,
    )
    .join("");
}
function transferView() {
  return `<form id="transfer-form" class="form-screen"><div class="transfer-block"><div class="caps">FROM</div><select name="from" aria-label="From account">${state.accounts.map((a) => `<option value="${a.id}">${escape(a.name)} · ${money(balance(a))}</option>`).join("")}</select></div><div class="transfer-block"><div class="caps">TO</div><select name="to" aria-label="To account">${state.accounts.map((a, i) => `<option value="${a.id}" ${i ? "selected" : ""}>${escape(a.name)}</option>`).join("")}</select></div><div class="pad"><label class="field">Amount<input name="amount" type="number" step="0.01" min="0.01" max="10000000" placeholder="$ 0.00" required inputmode="decimal"></label><label class="field">Description (optional)<input name="description" maxlength="100"></label><label class="field">Payment schedule<select><option>Now</option></select></label></div><div class="screen-bottom two-buttons"><button type="button" class="btn outline" data-action="back">Cancel</button><button class="btn">Continue</button></div></form>`;
}
function payeesView() {
  return (
    state.payees
      .map((p, i) => row(p.name, `BSB ${p.bsb}     Acc ${p.number}`, "accounts", `payee-${i}`))
      .join("") +
    '<div class="pad"><button class="btn" data-action="addpayee">Add new payee</button></div>'
  );
}
function personalView() {
  return `<div class="pad detail-list"><div class="info-row"><span>Name</span><strong>${escape(state.name)}</strong></div><div class="info-row"><span>Age</span><strong>${escape(state.age)}</strong></div><div class="info-row"><span>Email</span><strong>${escape(state.email)}</strong></div><div class="info-row"><span>Mobile</span><strong>${escape(state.phone)}</strong></div><p class="sheet-note">Sample profile · saved only in this browser.</p><button class="btn" data-action="profile">Edit demo details</button></div>`;
}
function txView() {
  const t = state.transactions.find((x) => x.id === selectedTx);
  if (!t) return '<div class="empty">Transaction not found</div>';
  const incoming = t.amount > 0;
  const date = new Date(t.date + "T12:00:00");
  return `<div class="transaction-content ${incoming ? "incoming" : "outgoing"}"><div class="transaction-hero">${icon("receipt")}${incoming ? `<div class="payment-title">${escape(t.title)}</div><div class="payment-date">${date.toLocaleDateString("en-GB")}</div>` : ""}<button class="big-value amount-edit" data-action="amount-tap" aria-label="Triple-tap ${escape(amount(t.amount))} to edit sample transaction">${amount(t.amount)}</button></div>${incoming ? `<dl class="receipt-fields"><dt>Payer Name</dt><dd>${escape(t.payer || "Sample sender")}</dd><dt>Payee Details</dt><dd>${escape(state.name)}<br>${escape(account().bsb)} ${escape(account().number)}</dd><dt>Description</dt><dd>${escape(t.description)}</dd><dt>Payment Type</dt><dd>Osko</dd><dt>Receipt number</dt><dd>DEMO-${escape(t.id.slice(0, 12).toUpperCase())}</dd><dt>Status</dt><dd>${escape(t.status || "Processed")}</dd><dt>Reference</dt><dd>Sample transaction</dd></dl>` : `<dl class="purchase-fields"><div><dt>Status</dt><dd><span class="status-pill ${t.status === "Pending" ? "pending" : ""}">${escape(t.status || "Processed")}</span></dd></div><div><dt>Transaction type</dt><dd>${icon("cards")}${escape(t.title)}</dd></div><div><dt>Card used</dt><dd>${escape(maskedCard())}</dd></div><div><dt>Description</dt><dd>${escape(t.description)}</dd></div><div><dt>Process date</dt><dd>${date.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</dd></div></dl>`}<div class="receipt-footer"><button class="btn outline" data-action="share-demo">${icon("share")} Share demo</button></div></div>`;
}
function vaultView() {
  return `<div class="vault">${icon("vault")}<h2>When an account is in The Vault</h2><p>It will be hidden from your accounts list.</p><p>You will still see the account and balance in your statements.</p><p class="sheet-note">This demo lets you explore the screen. Your sample accounts stay accessible.</p><button class="btn" data-action="back">Back to accounts</button></div>`;
}
function loanView() {
  return `<div class="pad"><h2 style="font-size:22px">${escape(product)}</h2>${product.includes("loans") ? `<h3 style="font-size:16px">Compare ${escape(product.toLowerCase())}</h3><div class="two-buttons"><label class="field">Property price<input id="price" type="number" value="500000" min="0"></label><label class="field">Deposit amount<input id="deposit" type="number" value="150000" min="0"></label></div><label class="field">Loan purpose<select><option>Owner occupier</option><option>Investment</option></select></label><label class="field">Loan type<select><option>Principal & interest</option><option>Interest only</option></select></label><div class="loan-card"><h2>Basic Variable</h2><p>Illustrative demo figures</p><div class="rates"><div><span>Demo rate</span><strong>6.04<small>%</small></strong></div><div><span>Comparison example</span><strong>6.10<small>%</small></strong></div></div><p>Estimated repayments</p><h2 id="repayment">$2,108 <small style="font-size:14px">Monthly</small></h2></div><p class="sheet-note">Sample illustration only. Not a current bank offer or a loan application.</p>` : `<p>Explore ${escape(product.toLowerCase())}.</p><p class="sheet-note">Product applications are unavailable in this demo.</p>`}<button class="btn outline" data-action="nav-products">Back to products</button></div>`;
}
function closeOverlay() {
  const old = $("#overlay").firstElementChild;
  $("#overlay").innerHTML = "";
  $("#main").inert = false;
  $("#nav").inert = false;
  $("#header").inert = false;
  if (old && lastFocus?.isConnected) lastFocus.focus();
}
function overlay(html, type = "sheet") {
  lastFocus = document.activeElement;
  $("#main").inert = true;
  $("#nav").inert = true;
  $("#header").inert = true;
  $("#overlay").innerHTML =
    `<div class="${type === "drawer" ? "menu-shade" : "sheet-shade"}" data-backdrop><section class="${type}" role="dialog" aria-modal="true" aria-label="${type === "drawer" ? "Navigation" : "Demo editor"}">${html}</section></div>`;
  setTimeout(() => $("#overlay").querySelector("button,input,select")?.focus(), 30);
}
function sheet(title, body) {
  overlay(
    `<div class="sheet-head"><h2>${title}</h2><button class="close" data-action="close" aria-label="Close">×</button></div>${body}`,
  );
}
function menu(settings = false) {
  overlay(
    `<div class="drawer-head"><span class="brand">${settings ? "Services & settings" : mark + "Great Southern Bank"}</span><button class="close" data-action="close" aria-label="Close menu">×</button></div><div class="sheet-note">Interactive demo · fictional data</div>${settings ? row("Personal details", "", "accounts", "personal") + row("Change password", "", "lock", "password") + row("Lock app", "", "lock", "logout") + row("Data sharing", "", "info", "sharing") + row("Back", "", "back", "menu") : row("Accounts", "", "accounts", "nav-accounts") + row("Payments & payees", "", "wallet", "payments") + row("Cards", "", "cards", "nav-cards") + row("Open or apply", "", "products", "nav-products") + row("Services & settings", "", "settings", "settings") + row("Contact us", "", "phone", "contact") + row("Important information", "", "info", "information") + row("Give us feedback", "", "info", "feedback") + row("FAQ’s", "", "info", "faq")}<button class="btn outline" data-action="logout">Log out</button><div class="meta">Independent prototype · not connected to the bank</div>`,
    "drawer",
  );
}
function field(label, name, value, type = "text", extra = "") {
  return `<label class="field">${label}<input name="${name}" value="${escape(value)}" type="${type}" ${extra}></label>`;
}
function profileEditor() {
  sheet(
    "Edit demo details",
    `<p class="sheet-note">These fictional details are saved on this device. No photo is used.</p><form id="profile-form">${field("Card holder name", "name", state.name, "text", 'required maxlength="60"')}${field("Sample card number (masked)", "cardNumber", maskedCard(), "text", 'required pattern="[0-9]{6}[xX]{6}[0-9]{4}" maxlength="16" title="Six digits, six X characters, then four digits"')}${field("Age", "age", state.age, "number", 'required min="1" max="120"')}${field("Email", "email", state.email, "email", 'maxlength="100"')}${field("Mobile", "phone", state.phone, "tel", 'maxlength="24"')}${state.accounts.map((a, i) => `<fieldset class="account-editor"><legend>${escape(a.name)}</legend>${field("Sample account number", `account${i}`, a.number, "text", 'required inputmode="numeric" pattern="[0-9]{4,12}" minlength="4" maxlength="12"')}${field("Sample BSB (6 digits)", `bsb${i}`, a.bsb, "text", 'required inputmode="numeric" pattern="[0-9]{6}" minlength="6" maxlength="6"')}${field("Available sample balance", `balance${i}`, balance(a), "number", 'required step="0.01" min="-10000000" max="10000000"')}</fieldset>`).join("")}<button class="btn">Save demo details</button></form>`,
  );
}
function transactionEditor(t) {
  sheet(
    t ? "Edit transaction" : "Add transaction",
    `<form id="tx-form" data-id="${escape(t?.id || "")}">${field("Date", "date", t?.date || localDay(), "date", "required")}${field("Transaction type", "title", t?.title || "Card Purchase", "text", 'required maxlength="60"')}${field("Description", "description", t?.description || "", "text", 'required maxlength="150"')}${field("Amount (negative for money out)", "amount", t?.amount ?? "", "number", 'required step="0.01" min="-10000000" max="10000000"')}${field("Category", "category", t?.category || "Shopping", "text", 'required maxlength="50"')}<label class="field">Status<select name="status"><option ${t?.status !== "Pending" ? "selected" : ""}>Processed</option><option ${t?.status === "Pending" ? "selected" : ""}>Pending</option></select></label>${field("Sample payer name", "payer", t?.payer || "Sample sender", "text", 'maxlength="80"')}<button class="btn">Save transaction</button>${t ? '<button type="button" class="btn danger" style="margin-top:12px" data-action="deletetx">Delete transaction</button>' : ""}</form>`,
  );
}
function payments() {
  sheet(
    "Payments & Transfers",
    `<p>What would you like to do?</p>${row("Transfer", "Between my accounts", "transfer", "transfer")}${row("Pay anyone", "Outside of my accounts", "pay", "payees")}${row("BPAY", "Pay a bill", "wallet", "bpay")}`,
  );
}
function info(title, message) {
  sheet(title, `<p>${message}</p><button class="btn" data-action="close">Done</button>`);
}
let stagedTransfer = null;
document.addEventListener("click", (e) => {
  const hit = e.target.closest("[data-tx-amount]");
  if (hit) {
    selectedTx = hit.dataset.txAmount;
    triple("tx-" + selectedTx, () =>
      transactionEditor(state.transactions.find((t) => t.id === selectedTx)),
    );
    return;
  }
  if (e.target.matches("[data-backdrop]")) return closeOverlay();
  const b = e.target.closest("button");
  if (!b) return;
  if (b.dataset.account) {
    accountId = b.dataset.account;
    filter = "ALL";
    return go("detail");
  }
  if (b.dataset.tx) {
    selectedTx = b.dataset.tx;
    return go("tx");
  }
  if (b.dataset.filter) {
    filter = b.dataset.filter;
    visibleTransactions = 5;
    return render();
  }
  if (b.dataset.product) {
    product = b.dataset.product;
    return go("loan");
  }
  const a = b.dataset.action;
  if (!a) return;
  if (a.startsWith("nav-")) {
    const p = a.slice(4);
    return p === "pay" ? payments() : go(p);
  }
  if (a.startsWith("payee-"))
    return info(
      "Demo payment",
      "Payments to other people are not sent from this prototype. You can add a sample payment with the transaction editor.",
    );
  switch (a) {
    case "load-more":
      loadMoreTransactions();
      break;
    case "menu":
      menu();
      break;
    case "settings":
      menu(true);
      break;
    case "close":
      closeOverlay();
      break;
    case "back":
      go(page === "tx" ? "detail" : page === "loan" ? "products" : "accounts");
      break;
    case "search":
      searching = !searching;
      render();
      $("#search")?.focus();
      break;
    case "payments":
      payments();
      break;
    case "transfer":
    case "payees":
    case "personal":
    case "vault":
      go(a);
      break;
    case "card-tap":
      triple("card", profileEditor);
      break;
    case "amount-tap":
      triple("tx-" + selectedTx, () =>
        transactionEditor(state.transactions.find((t) => t.id === selectedTx)),
      );
      break;
    case "logout":
      go("login");
      break;
    case "share-demo":
      shareDemo();
      break;
    case "profile":
      profileEditor();
      break;
    case "lock":
      state.locked = !state.locked;
      save();
      render();
      toast(state.locked ? "Demo card locked" : "Demo card unlocked");
      break;
    case "addtx":
      transactionEditor();
      break;
    case "edittx":
      transactionEditor(state.transactions.find((t) => t.id === selectedTx));
      break;
    case "deletetx":
      sheet(
        "Delete transaction?",
        `<p>This will remove the sample transaction and update your demo balance.</p><button class="btn danger" data-action="confirm-delete">Delete transaction</button><button class="btn outline" style="margin-top:10px" data-action="close">Cancel</button>`,
      );
      break;
    case "confirm-delete":
      state.transactions = state.transactions.filter((t) => t.id !== selectedTx);
      save();
      go("detail");
      toast("Transaction deleted");
      break;
    case "confirm-transfer":
      if (stagedTransfer) {
        state.transactions.push(...stagedTransfer);
        save();
        stagedTransfer = null;
        go("accounts");
        toast("Demo transfer complete");
      }
      break;
    case "addpayee":
      sheet(
        "Add new payee",
        `<form id="payee-form">${field("Name", "name", "", "text", 'required maxlength="60"')}${field("Sample BSB", "bsb", "000000", "text", 'required pattern="[0-9]{6}"')}${field("Sample account number", "number", "", "text", 'required pattern="[0-9]{4,12}"')}<button class="btn">Save sample payee</button></form>`,
      );
      break;
    case "pin":
      info(
        "Set PIN",
        "PIN changes are simulated in this demo. No bank PIN is requested or stored.",
      );
      break;
    case "lost":
      info(
        "Report lost or stolen card",
        "This is a demo card. No real card can be cancelled here.",
      );
      break;
    case "password":
    case "faceid":
      info(
        a === "password" ? "Change password" : "Face ID",
        "Authentication is not connected in this prototype.",
      );
      break;
    case "bpay":
      info(
        "BPAY",
        "Bill payments are not sent from this demo. Use editable sample transactions to model a payment.",
      );
      break;
    case "sharing":
      info(
        "Data sharing",
        "Your sample edits are stored only in this browser. Nothing is sent to a bank.",
      );
      break;
    case "contact":
    case "information":
    case "feedback":
    case "faq":
      info(
        "About this demo",
        "An independent interactive prototype based on your reference recording. Triple-tap the card to edit the sample profile. Triple-tap any transaction amount to edit it.",
      );
      break;
  }
});
document.addEventListener("input", (e) => {
  if (e.target.id === "search") {
    query = e.target.value;
    visibleTransactions = 5;
    $("#transactions").innerHTML = txList();
  }
  if (["price", "deposit"].includes(e.target.id)) {
    const p = Number($("#price").value),
      d = Number($("#deposit").value),
      r = 0.0604 / 12;
    const v = (Math.max(0, p - d) * r) / (1 - Math.pow(1 + r, -360));
    $("#repayment").innerHTML = `${money(v)} <small style="font-size:14px">Monthly</small>`;
  }
});
document.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target;
  const d = Object.fromEntries(new FormData(f));
  if (f.id === "login-form") {
    if (d.passcode === "3012") {
      go("accounts");
    } else {
      $("#login-error").textContent = "Incorrect passcode. Please try again.";
      $("#passcode").value = "";
      $("#passcode").focus();
    }
    return;
  }
  if (f.id === "profile-form") {
    if (!d.name.trim()) return toast("Enter a sample name");
    state.cardNumber = d.cardNumber.toUpperCase();
    state.name = d.name.trim();
    state.age = Number(d.age);
    state.email = d.email;
    state.phone = d.phone;
    state.accounts.forEach((a, i) => {
      a.number = d[`account${i}`];
      a.bsb = d[`bsb${i}`];
      const txTotal = state.transactions
        .filter((t) => t.account === a.id)
        .reduce((total, t) => total + t.amount, 0);
      a.opening = Math.round((Number(d[`balance${i}`]) - txTotal) * 100) / 100;
    });
    save();
    closeOverlay();
    render();
    toast("Demo details saved");
  }
  if (f.id === "tx-form") {
    const val = Number(d.amount);
    if (!Number.isFinite(val) || val === 0) return toast("Enter a non-zero amount");
    const previous = state.transactions.find((x) => x.id === f.dataset.id);
    const t = {
      ...d,
      ...(previous && previous.date === d.date && Number.isInteger(previous.dayOffset)
        ? { dayOffset: previous.dayOffset }
        : {}),
      amount: Math.round(val * 100) / 100,
      account: accountId,
      id: f.dataset.id || crypto.randomUUID(),
    };
    const idx = state.transactions.findIndex((x) => x.id === t.id);
    if (idx >= 0) state.transactions[idx] = t;
    else state.transactions.push(t);
    save();
    closeOverlay();
    render();
    toast("Transaction saved");
  }
  if (f.id === "payee-form") {
    state.payees.push(d);
    save();
    closeOverlay();
    render();
    toast("Sample payee saved");
  }
  if (f.id === "transfer-form") {
    const n = Number(d.amount),
      from = state.accounts.find((a) => a.id === d.from),
      to = state.accounts.find((a) => a.id === d.to);
    if (from === to) return toast("Choose two different accounts");
    if (!Number.isFinite(n) || n <= 0) return toast("Enter a valid amount");
    if (n > balance(from)) return toast("Not enough sample funds");
    const date = localDay();
    stagedTransfer = [
      {
        id: crypto.randomUUID(),
        account: from.id,
        date,
        title: "Funds Transfer",
        description: d.description || `To: ${to.name}`,
        amount: -n,
        category: "Transfer",
      },
      {
        id: crypto.randomUUID(),
        account: to.id,
        date,
        title: "Funds Transfer",
        description: d.description || `From: ${from.name}`,
        amount: n,
        category: "Transfer",
      },
    ];
    sheet(
      "Confirm demo transfer",
      `<div class="big-value">${money(n)}</div><p>From ${escape(from.name)}<br>To ${escape(to.name)}</p><p class="sheet-note">Only your sample balances will change.</p><button class="btn" data-action="confirm-transfer">Confirm transfer</button>`,
    );
  }
});
document.addEventListener("keydown", (e) => {
  const hit = e.target.closest("[data-tx-amount]");
  if (hit && (e.key === "Enter" || e.key === " ")) {
    e.preventDefault();
    selectedTx = hit.dataset.txAmount;
    transactionEditor(state.transactions.find((t) => t.id === selectedTx));
    return;
  }
  if (!$("#overlay").firstElementChild) return;
  if (e.key === "Escape") {
    closeOverlay();
    return;
  }
  if (e.key === "Tab") {
    const fs = [...$("#overlay").querySelectorAll("button,input,select")],
      first = fs[0],
      last = fs.at(-1);
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  }
});
async function shareDemo() {
  const t = state.transactions.find((x) => x.id === selectedTx);
  const text = `DEMO — FICTIONAL TRANSACTION\n${t.title}\n${amount(t.amount)}\n${t.date}\n${t.description}\nNot a bank record or proof of payment.`;
  try {
    if (navigator.share) {
      await navigator.share({ title: "Demo transaction", text });
    } else {
      await navigator.clipboard.writeText(text);
      toast("Demo details copied");
    }
  } catch (e) {
    if (e.name !== "AbortError") toast("Sharing is unavailable in this browser");
  }
}
$("#main").addEventListener(
  "wheel",
  () => {
    historyScrollArmed = true;
  },
  { passive: true },
);
$("#main").addEventListener(
  "touchmove",
  () => {
    historyScrollArmed = true;
  },
  { passive: true },
);
$("#main").addEventListener(
  "scroll",
  () => {
    const el = $("#main");
    if (
      page === "detail" &&
      historyScrollArmed &&
      el.scrollTop > 0 &&
      el.scrollHeight - el.scrollTop - el.clientHeight < 56
    )
      loadMoreTransactions();
  },
  { passive: true },
);
save();
render();
if (document.modelContext?.registerTool) {
  try {
    Promise.resolve(
      document.modelContext.registerTool({
        name: "open_demo_profile_editor",
        title: "Open demo profile editor",
        description: "Open the editor for fictional profile details without saving changes.",
        inputSchema: { type: "object", properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: false },
        execute(input) {
          if (!input || typeof input !== "object" || Object.keys(input).length)
            throw new Error("Expected an empty object");
          if (page === "login") throw new Error("Unlock the demo first");
          profileEditor();
          return { opened: true };
        },
      }),
    ).catch(() => {});
  } catch {}
}
