# BeHisabi delivery TODO

- [x] **Dashboard and currency overview** — মোবাইল-ফার্স্ট card-based dashboard-এ মোট balance, income ও expense summary এবং সব অঙ্কে বাংলাদেশি ৳ currency প্রদর্শন; BeHisabi-এর light ও dark theme দুটিই ব্যবহারযোগ্য হতে হবে।
- [x] **Wallet management** — Cash, bKash ইত্যাদি একাধিক wallet তৈরি, wallet card-এ আলাদা balance দেখা এবং walletভিত্তিক হিসাব রাখার ভিত্তি তৈরি।
- [x] **Quick entry flow** — Floating add button ও quick action icons দিয়ে দ্রুত income, expense এবং প্রয়োজনীয় financial entry যোগ করা; amount, type, category, wallet, তারিখ ও note নেওয়া।
- [ ] **Ledger history** — তারিখ, ধরন, category, wallet ও note-সহ ledger/transaction history দেখা এবং transaction edit/delete করার জন্য typed data model রাখা।
- [ ] **Financial modules** — দেওয়া ও নেওয়া loan-এর পরিমাণ, ব্যক্তি, due date, repayment এবং বকেয়া balance; bill reminder-এ বিলের নাম, পরিমাণ, due date ও payment status; categoryভিত্তিক monthly budget ও progress; Savings/DPS contribution ও maturity/progress; EMI installment, মেয়াদ, next due date, paid installment ও remaining liability; financial goal-এ target, deadline, accumulated amount ও progress রাখার schema ও summary surface তৈরি।
- [x] **Persistent foundation** — Wallet, transaction, loan, bill, budget, savings, DPS, EMI ও goal-এর তথ্য নির্ভরযোগ্যভাবে সংরক্ষণ এবং পরবর্তী ব্যবহারে পুনরুদ্ধারের জন্য managed database schema/migration ও server router প্রস্তুত।
- [x] **Mobile delivery** — portrait one-handed flow, bottom navigation (Home, Activity, Insights, Settings), branded launcher assets, TypeScript diagnostics এবং Metro/API runtime ঠিক রাখা।
