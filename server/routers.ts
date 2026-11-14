import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { getSessionCookieName, getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { transactions, wallets } from "../drizzle/schema";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(getSessionCookieName(ctx.req), { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  finance: router({
    dashboard: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return { wallets: [], transactions: [] };
      const [userWallets, userTransactions] = await Promise.all([
        db.select().from(wallets).where(eq(wallets.userId, ctx.user.id)).orderBy(desc(wallets.createdAt)),
        db.select().from(transactions).where(eq(transactions.userId, ctx.user.id)).orderBy(desc(transactions.occurredAt)).limit(100),
      ]);
      return { wallets: userWallets, transactions: userTransactions };
    }),
    createWallet: protectedProcedure.input(z.object({ name: z.string().min(1).max(80), kind: z.string().max(40).default("cash"), openingBalance: z.number().nonnegative().default(0), color: z.string().max(16).default("#0E2C22") })).mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database is not available");
      const result = await db.insert(wallets).values({ userId: ctx.user.id, name: input.name, kind: input.kind, openingBalance: input.openingBalance.toFixed(2), color: input.color });
      return { id: Number(result[0].insertId) };
    }),
    addTransaction: protectedProcedure.input(z.object({ walletId: z.number().int().positive(), kind: z.enum(["income", "expense"]), title: z.string().min(1).max(120), category: z.string().min(1).max(80), amount: z.number().positive(), note: z.string().max(500).optional(), occurredAt: z.coerce.date().optional() })).mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database is not available");
      const ownedWallet = await db.select({ id: wallets.id }).from(wallets).where(and(eq(wallets.id, input.walletId), eq(wallets.userId, ctx.user.id))).limit(1);
      if (!ownedWallet.length) throw new Error("Wallet not found");
      const result = await db.insert(transactions).values({ userId: ctx.user.id, walletId: input.walletId, kind: input.kind, title: input.title, category: input.category, amount: input.amount.toFixed(2), note: input.note, occurredAt: input.occurredAt ?? new Date() });
      return { id: Number(result[0].insertId) };
    }),
    deleteTransaction: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database is not available");
      await db.delete(transactions).where(and(eq(transactions.id, input.id), eq(transactions.userId, ctx.user.id)));
      return { success: true } as const;
    }),
  }),
});

export type AppRouter = typeof appRouter;
