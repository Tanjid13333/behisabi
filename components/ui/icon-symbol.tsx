import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";
import { FinanceIcon } from "@/components/finance-icon";

type IconMapping = Partial<Record<Extract<SymbolViewProps["name"], string>, ComponentProps<typeof MaterialIcons>["name"]>>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING = {
  "house.fill": "home",
  "clock.arrow.circlepath": "history",
  "chart.bar.fill": "bar-chart",
  "doc.text.fill": "receipt-long",
  "gearshape.fill": "settings",
  "bell.fill": "notifications-none",
  "plus": "add",
  "chevron.right": "chevron-right",
  "chevron.down": "keyboard-arrow-down",
  "wallet.pass.fill": "account-balance-wallet",
  "book.fill": "menu-book",
  "hand.raised.fill": "handshake",
  "chart.pie.fill": "pie-chart",
  "banknote.fill": "payments",
  "building.columns.fill": "account-balance",
  "calendar": "event",
  "flag.fill": "flag",
  "target": "track-changes",
  "arrow.up.right": "north-east",
  "arrow.down.left": "south-west",
  "arrow.left.arrow.right": "swap-horiz",
  "moon.fill": "dark-mode",
  "sun.max.fill": "light-mode",
  "xmark": "close",
  "checkmark": "check",
} satisfies IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <FinanceIcon color={String(color)} size={size} name={MAPPING[name] ?? "circle"} style={style as TextStyle} />;
}
