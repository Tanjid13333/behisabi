import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { formatMoney } from "@/lib/finance";

const bars = [
  { label: "Sat", value: 38 },
  { label: "Sun", value: 62 },
  { label: "Mon", value: 44 },
  { label: "Tue", value: 76 },
  { label: "Wed", value: 53 },
  { label: "Thu", value: 88 },
  { label: "Fri", value: 66 },
];

function ProgressCard({ icon, iconColor, iconBackground, title, value, detail, fill, colors }: { icon: React.ComponentProps<typeof MaterialIcons>["name"]; iconColor: string; iconBackground: string; title: string; value: `${number}%`; detail: string; fill: string; colors: ReturnType<typeof useColors> }) {
  return (
    <View style={[styles.progressCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.roundIcon, { backgroundColor: iconBackground }]}><MaterialIcons name={icon} size={20} color={iconColor} /></View>
      <View style={styles.progressCopy}>
        <View style={styles.progressTop}><Text style={[styles.itemTitle, { color: colors.foreground }]}>{title}</Text><Text style={[styles.itemValue, { color: colors.foreground }]}>{value}</Text></View>
        <Text style={[styles.muted, { color: colors.muted }]}>{detail}</Text>
        <View style={[styles.track, { backgroundColor: colors.border }]}><View style={[styles.fill, { width: value, backgroundColor: fill }]} /></View>
      </View>
    </View>
  );
}

export default function InsightsScreen() {
  const colors = useColors();
  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View><Text style={[styles.kicker, { color: colors.primary }]}>Small steps, big picture</Text><Text style={[styles.title, { color: colors.foreground }]}>Insights</Text></View>
          <View style={[styles.iconBox, { backgroundColor: colors.surface, borderColor: colors.border }]}><MaterialIcons name="auto-graph" size={20} color={colors.primary} /></View>
        </View>
        <View style={[styles.chartCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeader}><View><Text style={[styles.cardTitle, { color: colors.foreground }]}>Spending this week</Text><Text style={[styles.muted, { color: colors.muted }]}>Compared with last week</Text></View><Text style={[styles.percent, { color: colors.success }]}>−8.2%</Text></View>
          <View style={styles.chart}>
            <View style={styles.axis}><Text style={[styles.axisText, { color: colors.muted }]}>৳ 2k</Text><Text style={[styles.axisText, { color: colors.muted }]}>৳ 1k</Text><Text style={[styles.axisText, { color: colors.muted }]}>৳ 0</Text></View>
            <View style={styles.bars}>{bars.map((bar) => <View key={bar.label} style={styles.barColumn}><View style={styles.barTrack}><View style={[styles.bar, { height: `${bar.value}%`, backgroundColor: bar.value > 80 ? colors.primary : colors.success }]} /></View><Text style={[styles.axisText, { color: colors.muted }]}>{bar.label}</Text></View>)}</View>
          </View>
        </View>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Your plans</Text>
        <ProgressCard icon="pie-chart" iconColor="#D64B4B" iconBackground="#FCE3E3" title="Monthly budget" value="68%" detail={`${formatMoney(6_800)} of ${formatMoney(10_000)}`} fill={colors.primary} colors={colors} />
        <ProgressCard icon="flag" iconColor="#159A6C" iconBackground="#DDF5E8" title="Emergency fund" value="42%" detail={`${formatMoney(12_500, true)} of ${formatMoney(30_000, true)}`} fill={colors.success} colors={colors} />
        <ProgressCard icon="account-balance" iconColor="#954BBE" iconBackground="#E9D9F6" title="DPS maturity" value="31%" detail="৳ 31,000 saved so far" fill="#954BBE" colors={colors} />
        <View style={{ height: 28 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { width: "100%", maxWidth: 520, alignSelf: "center", padding: 20, paddingTop: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 21 },
  kicker: { fontSize: 12, fontWeight: "800", marginBottom: 4 },
  title: { fontSize: 30, fontWeight: "900", letterSpacing: -1 },
  iconBox: { width: 42, height: 42, borderRadius: 15, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  chartCard: { borderWidth: 1, borderRadius: 22, padding: 17, marginBottom: 24 },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardTitle: { fontSize: 15, fontWeight: "900" },
  muted: { fontSize: 10, marginTop: 4 },
  percent: { fontSize: 13, fontWeight: "900" },
  chart: { height: 185, flexDirection: "row", marginTop: 17 },
  axis: { justifyContent: "space-between", paddingBottom: 18 },
  axisText: { fontSize: 9 },
  bars: { flex: 1, flexDirection: "row", justifyContent: "space-around", alignItems: "flex-end", marginLeft: 10 },
  barColumn: { flex: 1, alignItems: "center", height: "100%", justifyContent: "flex-end", gap: 6 },
  barTrack: { height: 142, width: 13, borderRadius: 8, backgroundColor: "#E9EFEC", justifyContent: "flex-end", overflow: "hidden" },
  bar: { width: "100%", borderRadius: 8 },
  sectionTitle: { fontSize: 17, fontWeight: "900", marginBottom: 11 },
  progressCard: { borderWidth: 1, borderRadius: 19, padding: 14, flexDirection: "row", alignItems: "center", marginBottom: 10 },
  roundIcon: { width: 42, height: 42, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  progressCopy: { flex: 1, marginLeft: 11 },
  progressTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  itemTitle: { fontSize: 13, fontWeight: "800" },
  itemValue: { fontSize: 13, fontWeight: "900" },
  track: { height: 7, borderRadius: 5, overflow: "hidden", marginTop: 9 },
  fill: { height: "100%", borderRadius: 5 },
});
