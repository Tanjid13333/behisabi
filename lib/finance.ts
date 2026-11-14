export type TransactionKind = "income" | "expense";

export type FinanceTransaction = {
  id: string;
  title: string;
  category: string;
  wallet: string;
  note?: string;
  amount: number;
  kind: TransactionKind;
  date: string;
  icon: string;
  color: string;
};

export type Wallet = {
  id: string;
  name: string;
  balance: number;
  icon: string;
  accent: string;
};

export const INITIAL_BALANCE = 1_049;

export const DEFAULT_WALLETS: Wallet[] = [
  { id: "cash", name: "Cash", balance: 50_049, icon: "account-balance-wallet", accent: "#0E2C22" },
  { id: "bkash", name: "bKash", balance: 0, icon: "smartphone", accent: "#1F5A43" },
  { id: "bank", name: "Bank", balance: 0, icon: "account-balance", accent: "#234837" },
];

export const DEFAULT_TRANSACTIONS: FinanceTransaction[] = [
  {
    id: "demo-1",
    title: "Salary",
    category: "Income",
    wallet: "Cash",
    amount: 50_000,
    kind: "income",
    date: "Today, 09:10 AM",
    icon: "payments",
    color: "#C7F4DD",
    note: "Monthly salary",
  },
  {
    id: "demo-2",
    title: "Grocery shopping",
    category: "Food",
    wallet: "Cash",
    amount: 720,
    kind: "expense",
    date: "Today, 07:45 PM",
    icon: "shopping-basket",
    color: "#FDE2C4",
  },
  {
    id: "demo-3",
    title: "Ride share",
    category: "Transport",
    wallet: "Cash",
    amount: 180,
    kind: "expense",
    date: "Yesterday, 06:20 PM",
    icon: "directions-car",
    color: "#D9E9FF",
  },
  {
    id: "demo-4",
    title: "Freelance project",
    category: "Income",
    wallet: "Cash",
    amount: 2_500,
    kind: "income",
    date: "12 Nov, 03:30 PM",
    icon: "work-outline",
    color: "#E7D9FF",
  },
];

export const QUICK_ACTIONS = [
  { label: "Loans", icon: "handshake", tint: "#F8D5D5", iconColor: "#D64B4B", helper: "Track dues" },
  { label: "Ledger", icon: "menu-book", tint: "#CBEFE7", iconColor: "#0D9D80", helper: "All entries" },
  { label: "Bill reminder", icon: "notifications-active", tint: "#FBE1B8", iconColor: "#E89422", helper: "2 upcoming" },
  { label: "Budgets", icon: "pie-chart", tint: "#DADCF8", iconColor: "#6368C7", helper: "68% used" },
  { label: "Savings", icon: "savings", tint: "#CDEDF0", iconColor: "#1CABB6", helper: "৳ 12,500" },
  { label: "DPS", icon: "account-balance", tint: "#E9D5F5", iconColor: "#954BBE", helper: "1 active" },
  { label: "EMI", icon: "event-repeat", tint: "#F6D2E1", iconColor: "#D64F89", helper: "Due in 8 days" },
  { label: "Goals", icon: "flag", tint: "#D8EDD9", iconColor: "#429953", helper: "42% reached" },
] as const;

export function formatMoney(value: number, compact = false) {
  if (compact && Math.abs(value) >= 1000) {
    return `৳ ${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
  }
  return `৳ ${value.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatSignedMoney(value: number, kind: TransactionKind) {
  return `${kind === "income" ? "+" : "−"}${formatMoney(value).replace("৳ ", "৳")}`;
}
