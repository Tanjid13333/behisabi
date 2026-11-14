import { boolean, decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const wallets = mysqlTable("wallets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 80 }).notNull(),
  kind: varchar("kind", { length: 40 }).default("cash").notNull(),
  openingBalance: decimal("openingBalance", { precision: 14, scale: 2 }).default("0.00").notNull(),
  color: varchar("color", { length: 16 }).default("#0E2C22").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  walletId: int("walletId").notNull(),
  kind: mysqlEnum("kind", ["income", "expense"]).notNull(),
  title: varchar("title", { length: 120 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  amount: decimal("amount", { precision: 14, scale: 2 }).notNull(),
  note: text("note"),
  occurredAt: timestamp("occurredAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const loans = mysqlTable("loans", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  direction: mysqlEnum("direction", ["given", "taken"]).notNull(),
  person: varchar("person", { length: 120 }).notNull(),
  principal: decimal("principal", { precision: 14, scale: 2 }).notNull(),
  repaid: decimal("repaid", { precision: 14, scale: 2 }).default("0.00").notNull(),
  dueDate: timestamp("dueDate"),
  status: mysqlEnum("status", ["active", "settled"]).default("active").notNull(),
  note: text("note"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const bills = mysqlTable("bills", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  amount: decimal("amount", { precision: 14, scale: 2 }).notNull(),
  dueDate: timestamp("dueDate").notNull(),
  status: mysqlEnum("status", ["upcoming", "paid", "overdue"]).default("upcoming").notNull(),
  recurring: boolean("recurring").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const budgets = mysqlTable("budgets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  month: varchar("month", { length: 7 }).notNull(),
  limitAmount: decimal("limitAmount", { precision: 14, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const savingsPlans = mysqlTable("savingsPlans", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  kind: mysqlEnum("kind", ["savings", "dps"]).notNull(),
  targetAmount: decimal("targetAmount", { precision: 14, scale: 2 }).notNull(),
  currentAmount: decimal("currentAmount", { precision: 14, scale: 2 }).default("0.00").notNull(),
  maturityDate: timestamp("maturityDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const emiPlans = mysqlTable("emiPlans", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  installmentAmount: decimal("installmentAmount", { precision: 14, scale: 2 }).notNull(),
  tenureMonths: int("tenureMonths").notNull(),
  nextDueDate: timestamp("nextDueDate").notNull(),
  paidInstallments: int("paidInstallments").default(0).notNull(),
  remainingLiability: decimal("remainingLiability", { precision: 14, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const goals = mysqlTable("goals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 120 }).notNull(),
  targetAmount: decimal("targetAmount", { precision: 14, scale: 2 }).notNull(),
  currentAmount: decimal("currentAmount", { precision: 14, scale: 2 }).default("0.00").notNull(),
  deadline: timestamp("deadline"),
  status: mysqlEnum("status", ["active", "completed"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Wallet = typeof wallets.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Loan = typeof loans.$inferSelect;
export type Bill = typeof bills.$inferSelect;
export type Budget = typeof budgets.$inferSelect;
export type SavingsPlan = typeof savingsPlans.$inferSelect;
export type EmiPlan = typeof emiPlans.$inferSelect;
export type Goal = typeof goals.$inferSelect;
