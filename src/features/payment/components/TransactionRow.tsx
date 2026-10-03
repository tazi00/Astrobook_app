import UserAvatar from "@/components/UserAvatar";
import { AstroColors, AstroRadius, AstroShadow, AstroType } from "@/constants/astro-theme";
import { StyleSheet, Text, View } from "react-native";
import type { Transaction } from "../service";
import { dayLabel, inr, timeLabel } from "../utils/transactions";

type Props = {
  item: Transaction;
  /** "time" = sirf samay (grouped list), "date" = dashboard jaisa chhota context */
  sub?: "time" | "service";
  card?: boolean;
};

export default function TransactionRow({ item, sub = "time", card }: Props) {
  const name = item.clientName || "Client";
  return (
    <View style={[styles.row, card && styles.card]}>
      <UserAvatar name={name} id={item.id} size={40} />
      <View style={styles.flex}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.sub} numberOfLines={1}>
          {item.serviceTitle}
          {sub === "time" ? ` · ${timeLabel(item.createdAt)}` : ` · ${dayLabel(item.createdAt)}`}
        </Text>
      </View>
      <Text style={styles.amount}>{inr(Number(item.amount))}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, paddingHorizontal: 14 },
  card: { backgroundColor: AstroColors.surface, borderRadius: AstroRadius.lg, ...AstroShadow.soft },
  name: { ...AstroType.body, fontWeight: "700", color: AstroColors.text },
  sub: { ...AstroType.caption, color: AstroColors.textSecondary, marginTop: 2 },
  amount: { ...AstroType.heading, color: AstroColors.successDark },
});
