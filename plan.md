# BeHisabi — implementation plan

## Scope
BeHisabi হবে ব্যক্তিগত ব্যবহারের জন্য একটি mobile-first বাংলা personal finance app। Blueprint অনুযায়ী প্রথম usable slice-এ dashboard, ৳ currency, wallet cards, income/expense entry, transaction history, theme switch এবং financial quick actions থাকবে। Database schema-তে wallet, transaction, loan, bill, budget, savings/DPS, EMI ও goal-এর durable model থাকবে যাতে পরের ধাপে authenticated sync যোগ করা যায়।

## Implementation approach
- Fixed Expo Router / React Native / TypeScript / NativeWind starter বজায় রাখা হবে; Web Preview-তেও React Native-compatible components ব্যবহার করা হবে।
- Dashboard-এ demo data দিয়ে local-first state থাকবে; AsyncStorage-এ wallet ও transaction snapshot সংরক্ষণ হবে, তাই login ছাড়াই নিজের ডিভাইসে prototype ব্যবহারযোগ্য।
- Floating add button এবং quick action থেকে একই transaction modal খোলা হবে। Income/expense save হলে balance, monthly income/expense ও recent transaction সঙ্গে সঙ্গে আপডেট হবে।
- Light/dark theme ThemeProvider-এর মাধ্যমে চালু থাকবে এবং user-এর পছন্দ local storage-এ রাখা হবে।
- Drizzle schema-তে users-এর পাশাপাশি wallets, transactions, loans, bills, budgets, savings plans, EMI plans ও goals থাকবে; server router-এ dashboard snapshot এবং CRUD-এর জন্য typed procedure surface রাখা হবে।
- App-এর নিচে Home, Activity, Insights ও Settings tabs থাকবে; প্রথম pass-এ Home সম্পূর্ণ polished এবং অন্য তিনটি tab একই design language-এ useful summary/settings দেখাবে।

## Project structure
- `app/(tabs)/index.tsx`: মূল dashboard, wallet summary, quick actions, recent transactions, add modal।
- `app/(tabs)/activity.tsx`: filter করা transaction feed।
- `app/(tabs)/insights.tsx`: budget/progress ও monthly spending visual summary।
- `app/(tabs)/settings.tsx`: theme switch ও product preferences।
- `components/ui/icon-symbol.tsx`: shared Material icon mapping।
- `drizzle/schema.ts`: durable finance data model।
- `server/db.ts`, `server/routers.ts`: typed persistence helpers ও API surface।
- `assets/images/*`: BeHisabi launcher identity।

## Design

### Style options considered
- **Quiet fintech utility** — 0.06 probability: প্রায় monochrome, information-dense, restrained accent।
- **Night-market ledger** — 0.08 probability: charcoal/green base, coral action color, tactile cards।
- **Soft paper planner** — 0.05 probability: warm paper background, pastel categories, notebook-like rhythm।

**Chosen style: Night-market ledger**

- **Design Movement:** modern Bengali fintech utility with dark cashbook references and soft tactile surfaces।
- **Core Principles:** one-glance clarity; high-contrast money states; quick one-handed entry; calm separation between essential and optional detail।
- **Color Philosophy:** deep forest/ink makes money data feel private and grounded; coral-red is reserved for action and expense; mint-green signals positive cash flow; pastel category chips make dense quick actions scannable।
- **Layout Paradigm:** a vertical mobile ledger with an oversized balance card, horizontally scrollable wallet rail, then a breathing quick-action panel and a feed; avoid equal dashboard grids except for the intentionally compact action matrix।
- **Signature Elements:** coral circular add button; two-tone balance card with subtle translucent circles; rounded pastel icon discs for financial modules।
- **Interaction Philosophy:** every primary action is reachable with a thumb; tapping a quick action preselects the right transaction type; save feedback is immediate and non-blocking।
- **Animation:** use short opacity/scale transitions only for modal and selected cards; no looping decorative motion; preserve reduced-motion-friendly defaults।
- **Typography System:** system sans with bold numeric hierarchy; 30–34px balance amount, 16–18px section titles, 12–13px metadata; Bengali labels remain legible and never rely on all-caps।
- **Brand Essence:** “নিজের টাকা, নিজের হিসাব, নিজের নিয়ন্ত্রণ”—for people who want a private daily money cockpit; clear, warm, dependable।
- **Brand Voice:** short and reassuring. Example: “আজকের হিসাব এক নজরে।” / “খরচ লিখে রাখুন, নিয়ন্ত্রণ নিজের হাতে রাখুন।”
- **Wordmark & Logo:** coral “B” inside a dark-green rounded cashbook tile, with two small mint wings suggesting a helpful হিসাবি companion।
- **Signature Brand Color:** `#F04444` coral action red।

## Material constraints
- No external image search is needed; the supplied reference defines the visual direction. Decorative imagery is intentionally skipped because this is a finance dashboard.
- Mobile runtime remains on the fixed 8081 Metro port and 3000 API endpoint. Existing app identifiers remain unchanged.
- Database writes are treated as shared development/production data; migrations are additive and the prototype does not run destructive SQL.
