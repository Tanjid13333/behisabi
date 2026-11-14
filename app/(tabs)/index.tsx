import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { FinanceIcon } from "@/components/finance-icon";
import { useThemeContext } from "@/lib/theme-provider";
import { useColors } from "@/hooks/use-colors";
import {
  DEFAULT_TRANSACTIONS,
  DEFAULT_WALLETS,
  INITIAL_BALANCE,
  QUICK_ACTIONS,
  formatMoney,
  formatSignedMoney,
  type FinanceTransaction,
  type TransactionKind,
  type Wallet,
} from "@/lib/finance";

type IconName = React.ComponentProps<typeof MaterialIcons>["name"];
const STORAGE_KEY = "behisabi:dashboard";

function Icon({ name, size = 22, color }: { name: IconName; size?: number; color: string }) {
  return <FinanceIcon name={name} size={size} color={color} />;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

export default function HomeScreen() {
  const colors = useColors();
  const { colorScheme, setColorScheme } = useThemeContext();
  const dark = colorScheme === "dark";
  const [wallets, setWallets] = useState<Wallet[]>(DEFAULT_WALLETS);
  const [transactions, setTransactions] = useState<FinanceTransaction[]>(DEFAULT_TRANSACTIONS);
  const [composerVisible, setComposerVisible] = useState(false);
  const [composerKind, setComposerKind] = useState<TransactionKind>("expense");
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Food");
  const [walletName, setWalletName] = useState("Cash");
  const [note, setNote] = useState("");
  const [toast, setToast] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!raw) return;
      try {
        const saved = JSON.parse(raw) as { wallets?: Wallet[]; transactions?: FinanceTransaction[] };
        if (saved.wallets?.length) setWallets(saved.wallets);
        if (saved.transactions?.length) setTransactions(saved.transactions);
      } catch {
        // Keep the safe demo state when local data is malformed.
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ wallets, transactions })).catch(() => undefined);
  }, [wallets, transactions]);

  const totals = useMemo(() => {
    const income = transactions.filter((item) => item.kind === "income").reduce((sum, item) => sum + item.amount, 0);
    const expense = transactions.filter((item) => item.kind === "expense").reduce((sum, item) => sum + item.amount, 0);
    return { income, expense, balance: INITIAL_BALANCE + income - expense };
  }, [transactions]);

  const recentTransactions = transactions.slice(0, 4);

  function openComposer(kind: TransactionKind = "expense") {
    setComposerKind(kind);
    setAmount("");
    setTitle("");
    setCategory(kind === "income" ? "Income" : "Food");
    setWalletName("Cash");
    setNote("");
    setComposerVisible(true);
  }

  function notify(message: string) {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  }

  function saveTransaction() {
    const numericAmount = Number(amount.replace(/[^0-9.]/g, ""));
    if (!numericAmount || numericAmount <= 0) {
      notify("একটি amount লিখুন");
      return;
    }
    const newTransaction: FinanceTransaction = {
      id: `${Date.now()}`,
      title: title.trim() || (composerKind === "income" ? "New income" : "New expense"),
      category,
      wallet: walletName,
      note: note.trim(),
      amount: numericAmount,
      kind: composerKind,
      date: "Just now",
      icon: composerKind === "income" ? "south-west" : "north-east",
      color: composerKind === "income" ? "#C7F4DD" : "#FDE2C4",
    };
    setTransactions((current) => [newTransaction, ...current]);
    setWallets((current) => current.map((wallet) => wallet.name === walletName ? { ...wallet, balance: wallet.balance + (composerKind === "income" ? numericAmount : -numericAmount) } : wallet));
    setComposerVisible(false);
    notify(composerKind === "income" ? "Income saved" : "Expense saved");
  }

  function handleQuickAction(label: string) {
    if (label === "Ledger") {
      router.push("/activity");
      return;
    }
    if (label === "Budgets") {
      router.push("/insights");
      return;
    }
    notify(`${label} module is ready for your next entry`);
  }

  return (
    <ScreenContainer edges={["top", "left", "right"]} containerClassName="bg-background" safeAreaClassName="bg-background">
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.page}>
          <View style={styles.headerRow}>
            <View style={styles.brandRow}>
              <View style={[styles.brandMark, { backgroundColor: dark ? "#D94D4D" : "#F04444" }]}><Text style={styles.brandMarkText}>B</Text></View>
              <View><Text style={[styles.brandName, { color: colors.foreground }]}>Be<Text style={{ color: colors.primary }}>Hisabi</Text></Text><Text style={[styles.brandSubline, { color: colors.muted }]}>Your money, your control</Text></View>
            </View>
            <View style={styles.headerActions}>
              <Pressable accessibilityLabel="Notifications" onPress={() => notify("You have 2 reminders")} style={[styles.iconButton, { backgroundColor: colors.surface, borderColor: colors.border }]}><Icon name="notifications-none" size={21} color={colors.foreground} /><View style={styles.notificationDot}><Text style={styles.notificationText}>2</Text></View></Pressable>
              <Pressable accessibilityLabel="Toggle theme" onPress={() => setColorScheme(dark ? "light" : "dark")} style={[styles.iconButton, { backgroundColor: colors.surface, borderColor: colors.border }]}><Icon name={dark ? "light-mode" : "dark-mode"} size={20} color={colors.foreground} /></Pressable>
            </View>
          </View>

          <View style={styles.greetingRow}><View><Text style={[styles.greeting, { color: colors.muted }]}>{getGreeting()} <Text style={{ color: colors.foreground }}>☾</Text></Text><Text style={[styles.userName, { color: colors.foreground }]}>User</Text></View><Text style={[styles.todayLabel, { color: colors.muted }]}>14 Nov 2026</Text></View>

          <View style={[styles.balanceCard, { backgroundColor: dark ? "#0D3A29" : "#15271F" }]}>
            <View style={styles.balanceGlowOne} /><View style={styles.balanceGlowTwo} />
            <View style={styles.cardTopRow}><Text style={styles.cardEyebrow}>Total Balance</Text><View style={styles.periodPill}><Text style={styles.periodText}>This month</Text><Icon name="keyboard-arrow-down" size={15} color="#D2E8DC" /></View></View>
            <Text style={styles.balanceAmount}>{formatMoney(totals.balance)}</Text>
            <View style={styles.balanceStatsRow}><View><Text style={styles.statLabel}>Income</Text><Text style={[styles.statValue, { color: "#5BE6A9" }]}>{formatMoney(totals.income, true)}</Text></View><View style={styles.statDivider} /><View><Text style={styles.statLabel}>Expense</Text><Text style={[styles.statValue, { color: "#FF8F8F" }]}>{formatMoney(totals.expense, true)}</Text></View><View style={styles.balanceTrend}><Icon name="north-east" size={15} color="#5BE6A9" /><Text style={styles.trendText}>12.4%</Text></View></View>
          </View>
          <View style={styles.carouselDots}><View style={[styles.dot, styles.activeDot]} /><View style={styles.dot} /><View style={styles.dot} /></View>

          <View style={styles.sectionHeader}><Text style={[styles.sectionTitle, { color: colors.foreground }]}>My wallets</Text><Pressable onPress={() => notify("Wallet management coming next")}><Text style={[styles.seeAll, { color: colors.primary }]}>Manage</Text></Pressable></View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.walletRail}>{wallets.map((wallet, index) => <Pressable key={wallet.id} onPress={() => notify(`${wallet.name}: ${formatMoney(wallet.balance)}`)} style={[styles.walletCard, { backgroundColor: dark ? wallet.accent : index === 0 ? "#17221E" : colors.surface, borderColor: index === 0 ? "transparent" : colors.border }]}><View style={[styles.walletIcon, { backgroundColor: index === 0 ? "#315E4C" : "#DCF5E9" }]}><Icon name={wallet.icon as IconName} size={19} color={index === 0 ? "#A7EAC8" : "#159A6C"} /></View><Text style={[styles.walletName, { color: index === 0 ? "#E9F4EF" : colors.foreground }]}>{wallet.name}</Text><Text style={[styles.walletBalance, { color: index === 0 ? "#5BE6A9" : colors.success }]}>{formatMoney(wallet.balance, true)}</Text></Pressable>)}<Pressable onPress={() => notify("Add wallet coming next")} style={[styles.addWallet, { borderColor: colors.border }]}><Icon name="add" size={25} color={colors.primary} /><Text style={[styles.addWalletText, { color: colors.foreground }]}>Wallet</Text></Pressable></ScrollView>

          <View style={[styles.quickPanel, { backgroundColor: dark ? "#0C1D17" : "#EEF2F0" }]}><View style={styles.sectionHeader}><View><Text style={[styles.sectionTitle, { color: colors.foreground }]}>Quick actions</Text><Text style={[styles.sectionHint, { color: colors.muted }]}>Keep your money in order</Text></View><Icon name="grid-view" size={21} color={colors.muted} /></View><View style={styles.actionGrid}>{QUICK_ACTIONS.map((action) => <Pressable key={action.label} onPress={() => handleQuickAction(action.label)} style={({ pressed }) => [styles.actionItem, pressed && { opacity: 0.72 }]}><View style={[styles.actionIcon, { backgroundColor: action.tint }]}><Icon name={action.icon as IconName} size={22} color={action.iconColor} /></View><Text numberOfLines={1} style={[styles.actionLabel, { color: colors.foreground }]}>{action.label}</Text><Text numberOfLines={1} style={[styles.actionHelper, { color: colors.muted }]}>{action.helper}</Text></Pressable>)}</View><Pressable onPress={() => notify("More modules will be added here")} style={styles.moreButton}><Text style={[styles.moreButtonText, { color: colors.primary }]}>See more</Text><Icon name="keyboard-arrow-down" size={18} color={colors.primary} /></Pressable></View>

          <View style={styles.sectionHeader}><Text style={[styles.sectionTitle, { color: colors.foreground }]}>Upcoming bills</Text><Pressable onPress={() => notify("No bill is overdue")}><Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text></Pressable></View>
          <View style={[styles.billCard, { backgroundColor: colors.surface, borderColor: colors.border }]}><View style={[styles.billIcon, { backgroundColor: dark ? "#4A3422" : "#FFF0D8" }]}><Icon name="wifi" size={21} color="#E89422" /></View><View style={styles.billCopy}><Text style={[styles.billName, { color: colors.foreground }]}>WiFi bill</Text><Text style={[styles.billMeta, { color: colors.muted }]}>Due in 3 days · 17 Nov</Text></View><Text style={[styles.billAmount, { color: colors.foreground }]}>৳ 1,200</Text></View>

          <View style={styles.sectionHeader}><Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent transactions</Text><Pressable onPress={() => router.push("/activity")}><Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text></Pressable></View>
          <View style={[styles.transactionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>{recentTransactions.map((item, index) => <View key={item.id} style={[styles.transactionRow, index < recentTransactions.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}><View style={[styles.transactionIcon, { backgroundColor: item.color }]}><Icon name={item.icon as IconName} size={19} color="#1F4B3A" /></View><View style={styles.transactionCopy}><Text style={[styles.transactionTitle, { color: colors.foreground }]}>{item.title}</Text><Text style={[styles.transactionMeta, { color: colors.muted }]}>{item.category} · {item.date}</Text></View><Text style={[styles.transactionAmount, { color: item.kind === "income" ? colors.success : colors.error }]}>{formatSignedMoney(item.amount, item.kind)}</Text></View>)}</View>
          <View style={{ height: 88 }} />
        </View>
      </ScrollView>

      <Pressable accessibilityLabel="Add transaction" onPress={() => openComposer("expense")} style={({ pressed }) => [styles.fab, { backgroundColor: colors.primary }, pressed && { transform: [{ scale: 0.94 }] }]}><Icon name="add" size={31} color="#FFFFFF" /></Pressable>
      {toast ? <View style={[styles.toast, { backgroundColor: dark ? "#EAFBF2" : "#142820" }]}><Icon name="check-circle" size={18} color={dark ? "#0B6F4A" : "#70E1A5"} /><Text style={{ color: dark ? "#0B6F4A" : "#FFFFFF", fontWeight: "700" }}>{toast}</Text></View> : null}

      <Modal visible={composerVisible} transparent animationType="slide" onRequestClose={() => setComposerVisible(false)}><KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.modalBackdrop}><Pressable style={StyleSheet.absoluteFill} onPress={() => setComposerVisible(false)} /><View style={[styles.composer, { backgroundColor: colors.surface }]}><View style={styles.composerHandle} /><View style={styles.composerHeader}><View><Text style={[styles.composerTitle, { color: colors.foreground }]}>Add transaction</Text><Text style={[styles.composerSubtitle, { color: colors.muted }]}>Write it down, stay in control</Text></View><Pressable onPress={() => setComposerVisible(false)}><Icon name="close" size={23} color={colors.muted} /></Pressable></View><View style={styles.kindSwitch}><Pressable onPress={() => setComposerKind("expense")} style={[styles.kindButton, composerKind === "expense" && { backgroundColor: "#F04444" }]}><Text style={[styles.kindText, { color: composerKind === "expense" ? "#FFFFFF" : colors.muted }]}>Expense</Text></Pressable><Pressable onPress={() => setComposerKind("income")} style={[styles.kindButton, composerKind === "income" && { backgroundColor: "#12B978" }]}><Text style={[styles.kindText, { color: composerKind === "income" ? "#FFFFFF" : colors.muted }]}>Income</Text></Pressable></View><Text style={[styles.inputLabel, { color: colors.muted }]}>Amount</Text><View style={[styles.amountInputWrap, { borderColor: colors.border, backgroundColor: dark ? "#102A20" : "#F5F8F6" }]}><Text style={[styles.currencySymbol, { color: colors.primary }]}>৳</Text><TextInput autoFocus keyboardType="decimal-pad" value={amount} onChangeText={setAmount} placeholder="0.00" placeholderTextColor={colors.muted} style={[styles.amountInput, { color: colors.foreground }]} /></View><View style={styles.twoColumn}><View style={styles.inputColumn}><Text style={[styles.inputLabel, { color: colors.muted }]}>Title</Text><TextInput value={title} onChangeText={setTitle} placeholder="e.g. Lunch" placeholderTextColor={colors.muted} style={[styles.textInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: dark ? "#102A20" : "#F5F8F6" }]} /></View><View style={styles.inputColumn}><Text style={[styles.inputLabel, { color: colors.muted }]}>Category</Text><TextInput value={category} onChangeText={setCategory} placeholder="Food" placeholderTextColor={colors.muted} style={[styles.textInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: dark ? "#102A20" : "#F5F8F6" }]} /></View></View><View style={styles.inputColumn}><Text style={[styles.inputLabel, { color: colors.muted }]}>Wallet</Text><View style={styles.walletChoices}>{wallets.slice(0, 3).map((wallet) => <Pressable key={wallet.id} onPress={() => setWalletName(wallet.name)} style={[styles.walletChoice, { borderColor: walletName === wallet.name ? colors.primary : colors.border, backgroundColor: walletName === wallet.name ? (dark ? "#183E2E" : "#FFF0F0") : "transparent" }]}><Text style={[styles.walletChoiceText, { color: walletName === wallet.name ? colors.primary : colors.foreground }]}>{wallet.name}</Text></Pressable>)}</View></View><Text style={[styles.inputLabel, { color: colors.muted }]}>Note (optional)</Text><TextInput value={note} onChangeText={setNote} placeholder="Add a little context" placeholderTextColor={colors.muted} style={[styles.textInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: dark ? "#102A20" : "#F5F8F6" }]} /><Pressable onPress={saveTransaction} style={[styles.saveButton, { backgroundColor: composerKind === "income" ? colors.success : colors.primary }]}><Text style={styles.saveButtonText}>Save {composerKind}</Text><Icon name="arrow-forward" size={20} color="#FFFFFF" /></Pressable></View></KeyboardAvoidingView></Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 24 }, page: { width: "100%", maxWidth: 520, alignSelf: "center", paddingHorizontal: 20, paddingTop: 12 }, headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, brandRow: { flexDirection: "row", alignItems: "center", gap: 10 }, brandMark: { width: 38, height: 38, borderRadius: 14, alignItems: "center", justifyContent: "center", transform: [{ rotate: "-8deg" }] }, brandMarkText: { color: "#FFFFFF", fontSize: 22, fontWeight: "900", transform: [{ rotate: "8deg" }] }, brandName: { fontSize: 20, fontWeight: "900", letterSpacing: -0.6 }, brandSubline: { fontSize: 9, letterSpacing: 0.3, textTransform: "uppercase", marginTop: 1 }, headerActions: { flexDirection: "row", gap: 8 }, iconButton: { height: 38, width: 38, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center" }, notificationDot: { position: "absolute", top: -4, right: -4, width: 17, height: 17, borderRadius: 10, backgroundColor: "#F04444", alignItems: "center", justifyContent: "center" }, notificationText: { fontSize: 10, color: "#FFFFFF", fontWeight: "800" }, greetingRow: { marginTop: 24, marginBottom: 13, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }, greeting: { fontSize: 13, fontWeight: "600" }, userName: { fontSize: 22, fontWeight: "900", letterSpacing: -0.5, marginTop: 3 }, todayLabel: { fontSize: 11, marginBottom: 3 }, balanceCard: { minHeight: 190, borderRadius: 27, padding: 22, overflow: "hidden", shadowColor: "#04130D", shadowOpacity: 0.16, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 7 }, balanceGlowOne: { position: "absolute", width: 145, height: 145, borderRadius: 80, backgroundColor: "rgba(54, 128, 92, 0.25)", right: -22, bottom: -52 }, balanceGlowTwo: { position: "absolute", width: 95, height: 95, borderRadius: 60, backgroundColor: "rgba(8, 66, 43, 0.28)", right: 46, top: -38 }, cardTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, cardEyebrow: { color: "#D1E6DC", fontSize: 12, fontWeight: "600" }, periodPill: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.09)" }, periodText: { color: "#D1E6DC", fontSize: 10, fontWeight: "700" }, balanceAmount: { color: "#FFFFFF", fontSize: 32, fontWeight: "900", letterSpacing: -1.1, marginTop: 17 }, balanceStatsRow: { flexDirection: "row", alignItems: "flex-end", gap: 17, marginTop: 24 }, statLabel: { color: "#BDD2C8", fontSize: 11, fontWeight: "600" }, statValue: { fontSize: 14, fontWeight: "800", marginTop: 3 }, statDivider: { height: 27, width: 1, backgroundColor: "rgba(255,255,255,0.18)" }, balanceTrend: { marginLeft: "auto", flexDirection: "row", alignItems: "center", gap: 3, marginBottom: 2 }, trendText: { color: "#5BE6A9", fontSize: 11, fontWeight: "800" }, carouselDots: { flexDirection: "row", justifyContent: "center", gap: 5, paddingVertical: 10 }, dot: { width: 6, height: 6, borderRadius: 4, backgroundColor: "#CAD3CF" }, activeDot: { width: 18, backgroundColor: "#F04444" }, sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 13, marginBottom: 11 }, sectionTitle: { fontSize: 17, fontWeight: "900", letterSpacing: -0.3 }, sectionHint: { fontSize: 11, marginTop: 2 }, seeAll: { fontSize: 12, fontWeight: "800" }, walletRail: { gap: 11, paddingBottom: 2 }, walletCard: { width: 145, minHeight: 104, borderRadius: 18, borderWidth: 1, padding: 14, shadowColor: "#0E2C22", shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 2 }, walletIcon: { width: 29, height: 29, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 9 }, walletName: { fontSize: 12, fontWeight: "800" }, walletBalance: { fontSize: 13, fontWeight: "900", marginTop: 2 }, addWallet: { width: 84, minHeight: 104, borderRadius: 18, borderWidth: 1, borderStyle: "dashed", alignItems: "center", justifyContent: "center", gap: 4 }, addWalletText: { fontSize: 11, fontWeight: "800" }, quickPanel: { marginTop: 22, borderRadius: 25, padding: 17 }, actionGrid: { flexDirection: "row", flexWrap: "wrap", rowGap: 18, marginTop: 8 }, actionItem: { width: "25%", alignItems: "center", paddingHorizontal: 2 }, actionIcon: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", marginBottom: 6 }, actionLabel: { fontSize: 10, fontWeight: "800", textAlign: "center" }, actionHelper: { fontSize: 8, marginTop: 3, textAlign: "center" }, moreButton: { marginTop: 19, flexDirection: "row", gap: 3, alignItems: "center", justifyContent: "center" }, moreButtonText: { fontSize: 12, fontWeight: "900" }, billCard: { borderRadius: 18, borderWidth: 1, padding: 14, flexDirection: "row", alignItems: "center" }, billIcon: { width: 41, height: 41, borderRadius: 14, alignItems: "center", justifyContent: "center" }, billCopy: { flex: 1, marginLeft: 11 }, billName: { fontSize: 13, fontWeight: "800" }, billMeta: { fontSize: 10, marginTop: 3 }, billAmount: { fontSize: 13, fontWeight: "900" }, transactionCard: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 14 }, transactionRow: { minHeight: 67, flexDirection: "row", alignItems: "center", paddingVertical: 9 }, transactionIcon: { width: 39, height: 39, borderRadius: 14, alignItems: "center", justifyContent: "center" }, transactionCopy: { flex: 1, marginLeft: 11 }, transactionTitle: { fontSize: 12, fontWeight: "800" }, transactionMeta: { fontSize: 10, marginTop: 4 }, transactionAmount: { fontSize: 12, fontWeight: "900" }, fab: { position: "absolute", right: 20, bottom: 25, height: 58, width: 58, borderRadius: 29, alignItems: "center", justifyContent: "center", shadowColor: "#F04444", shadowOpacity: 0.32, shadowRadius: 12, shadowOffset: { width: 0, height: 7 }, elevation: 8 }, toast: { position: "absolute", bottom: 93, alignSelf: "center", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18, flexDirection: "row", alignItems: "center", gap: 7, shadowColor: "#000", shadowOpacity: 0.14, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 4 }, modalBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(2, 13, 9, 0.48)" }, composer: { borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 20, paddingTop: 10, paddingBottom: Platform.OS === "ios" ? 30 : 20 }, composerHandle: { alignSelf: "center", height: 4, width: 42, borderRadius: 3, backgroundColor: "#C8D2CC", marginBottom: 15 }, composerHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }, composerTitle: { fontSize: 21, fontWeight: "900" }, composerSubtitle: { fontSize: 11, marginTop: 3 }, kindSwitch: { flexDirection: "row", gap: 7, marginTop: 18, marginBottom: 13 }, kindButton: { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 13, backgroundColor: "#EDF1EE" }, kindText: { fontSize: 12, fontWeight: "900" }, inputLabel: { fontSize: 10, fontWeight: "800", marginBottom: 6, marginTop: 8 }, amountInputWrap: { height: 57, borderRadius: 15, borderWidth: 1, flexDirection: "row", alignItems: "center", paddingHorizontal: 15 }, currencySymbol: { fontSize: 22, fontWeight: "900", marginRight: 8 }, amountInput: { flex: 1, fontSize: 25, fontWeight: "900" }, twoColumn: { flexDirection: "row", gap: 10 }, inputColumn: { flex: 1 }, textInput: { minHeight: 44, borderRadius: 13, borderWidth: 1, paddingHorizontal: 12, fontSize: 12 }, walletChoices: { flexDirection: "row", gap: 7 }, walletChoice: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 13, paddingVertical: 9 }, walletChoiceText: { fontSize: 11, fontWeight: "800" }, saveButton: { height: 50, borderRadius: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, marginTop: 19 }, saveButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "900", textTransform: "capitalize" },
});
