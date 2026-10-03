import UserAvatar from "@/components/UserAvatar";
import {
  AstroColors,
  AstroRadius,
  AstroShadow,
  AstroType,
  MIN_TOUCH,
} from "@/constants/astro-theme";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type ProfileStat = {
  label: string;
  value: number;
  onPress: () => void;
};

// User aur Astrologer dono ka profile upar ka card — banner, avatar, naam,
// contact, (optional) role badge, stats aur Edit Profile. Dono views isi ko
// use karte hain taaki look hamesha same rahe.
export default function ProfileHeroCard({
  id,
  name,
  email,
  phone,
  bio,
  avatarUrl,
  badge,
  stats,
  onEdit,
}: {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  /** e.g. "Astrologer" — plain user ke liye nahi dikhta */
  badge?: string;
  stats: ProfileStat[];
  onEdit: () => void;
}) {
  return (
    <View style={[styles.card, AstroShadow.card]}>
      <LinearGradient
        colors={[AstroColors.brandLight, AstroColors.brandDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.banner}
      >
        <View style={[styles.ring, styles.ringA]} />
        <View style={[styles.ring, styles.ringB]} />
      </LinearGradient>

      <View style={styles.avatarRing}>
        <UserAvatar uri={avatarUrl} name={name} id={id} size={92} />
      </View>

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {name ?? "User"}
        </Text>

        {badge ? (
          <View style={styles.badge}>
            <Feather name="star" size={12} color={AstroColors.brand} />
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}

        {email ? (
          <View style={styles.contactRow}>
            <Feather name="mail" size={13} color={AstroColors.textMuted} />
            <Text style={styles.contact} numberOfLines={1}>
              {email}
            </Text>
          </View>
        ) : null}
        {phone ? (
          <View style={styles.contactRow}>
            <Feather name="phone" size={13} color={AstroColors.textMuted} />
            <Text style={styles.contact}>{phone}</Text>
          </View>
        ) : null}

        {bio ? <Text style={styles.bio}>{bio}</Text> : null}

        <View style={styles.stats}>
          {stats.map((s, i) => (
            <TouchableOpacity
              key={s.label}
              style={[styles.stat, i > 0 && styles.statDivider]}
              onPress={s.onPress}
              activeOpacity={0.7}
              accessibilityLabel={`${s.label}: ${s.value}`}
            >
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={onEdit}
          activeOpacity={0.8}
          accessibilityLabel="Edit Profile"
        >
          <Feather name="edit-2" size={15} color={AstroColors.brand} />
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AstroColors.surface,
    borderRadius: AstroRadius.xl,
  },
  banner: {
    height: 84,
    borderTopLeftRadius: AstroRadius.xl,
    borderTopRightRadius: AstroRadius.xl,
    overflow: "hidden",
  },
  ring: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  ringA: { width: 150, height: 150, borderRadius: 75, right: -40, top: -70 },
  ringB: { width: 90, height: 90, borderRadius: 45, left: -26, bottom: -48 },
  avatarRing: {
    alignSelf: "center",
    marginTop: -52,
    padding: 4,
    borderRadius: 60,
    backgroundColor: AstroColors.surface,
    ...AstroShadow.soft,
  },
  body: { alignItems: "center", paddingHorizontal: 20, paddingBottom: 20 },
  name: { ...AstroType.title, color: AstroColors.ink, marginTop: 10 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: AstroRadius.pill,
    backgroundColor: AstroColors.brandTint,
  },
  badgeText: { ...AstroType.micro, color: AstroColors.brand },
  contactRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
  contact: { ...AstroType.body, color: AstroColors.textSecondary },
  bio: {
    ...AstroType.body,
    color: AstroColors.text,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 12,
  },
  stats: {
    flexDirection: "row",
    alignSelf: "stretch",
    marginTop: 18,
    paddingVertical: 12,
    borderRadius: AstroRadius.lg,
    backgroundColor: AstroColors.canvas,
  },
  stat: { flex: 1, alignItems: "center", minHeight: MIN_TOUCH - 8, justifyContent: "center" },
  statDivider: { borderLeftWidth: 1, borderLeftColor: AstroColors.border },
  statValue: { ...AstroType.heading, color: AstroColors.ink },
  statLabel: { ...AstroType.caption, color: AstroColors.textSecondary, marginTop: 2 },
  editBtn: {
    alignSelf: "stretch",
    minHeight: MIN_TOUCH,
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: AstroRadius.pill,
    borderWidth: 1.5,
    borderColor: AstroColors.brand,
  },
  editText: { ...AstroType.button, color: AstroColors.brand },
});
