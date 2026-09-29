import ScreenHeader from "@/components/ScreenHeader";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FavoriteButton from "../components/FavoriteButton";
import { useFavoritesList } from "../hooks/useFavorites";
import type { FavoriteItem } from "../types";

function FavoriteCard({ item }: { item: FavoriteItem }) {
  const router = useRouter();
  const { service } = item;
  const price = service.price ? `₹${Number(service.price)}` : null;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.88}
      onPress={() =>
        router.push({
          pathname: "/(user)/service/[id]" as any,
          params: { id: item.itemId, astroId: service.astrologerId },
        })
      }
    >
      <View style={styles.thumbnail}>
        {service.coverImage ? (
          <Image source={{ uri: service.coverImage }} style={styles.thumbImg} />
        ) : (
          <Text style={{ fontSize: 28 }}>{service.isBasic ? "🔮" : "✨"}</Text>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {service.title}
        </Text>
        {service.astrologerName ? (
          <Text style={styles.astro} numberOfLines={1}>
            with {service.astrologerName}
          </Text>
        ) : null}
        <Text style={styles.meta}>
          ⏱ {service.durationMinutes} min{price ? `  ·  ${price}` : ""}
        </Text>
      </View>

      {/* Yahin se un-favourite — list se turant hat jaata hai */}
      <FavoriteButton itemId={item.itemId} style={styles.heart} />
    </TouchableOpacity>
  );
}

export default function FavoritesScreen() {
  const { data, isLoading, isError, refetch, isRefetching } =
    useFavoritesList("service");

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <ScreenHeader
        title="Favourites"
        subtitle="Jo aapko pasand aaya"
        fallbackHref="/(user)/(tabs)/feed"
      />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#9d0399" size="large" />
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Favourites load nahi hue</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>Dobara try karo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => <FavoriteCard item={item} />}
          contentContainerStyle={[
            styles.list,
            (data?.length ?? 0) === 0 && { flexGrow: 1 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={["#9d0399"]}
              tintColor="#9d0399"
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <View style={styles.emptyIcon}>
                <Feather name="heart" size={30} color="#9d0399" />
              </View>
              <Text style={styles.emptyTitle}>Abhi kuch favourite nahi hai</Text>
              <Text style={styles.emptyText}>
                Koi consultation pasand aaye to uspe heart dabao, wo yahin jama
                ho jaayegi.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F0FF" },
  list: { padding: 16, gap: 12 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 8,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EDE9FF",
    padding: 12,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: "#F3E8FF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  thumbImg: { width: 64, height: 64 },
  info: { flex: 1, gap: 2 },
  title: { fontSize: 15, fontWeight: "700", color: "#1A1A2E" },
  astro: { fontSize: 13, color: "#6B7280" },
  meta: { fontSize: 12, color: "#4A4468", marginTop: 2 },
  heart: { elevation: 0, shadowOpacity: 0, backgroundColor: "#F5F0FF" },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F3E8FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 16, fontWeight: "800", color: "#1A1A2E" },
  emptyText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 19,
  },
  retryBtn: {
    marginTop: 4,
    borderWidth: 1.5,
    borderColor: "#9d0399",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  retryText: { color: "#9d0399", fontWeight: "700", fontSize: 14 },
});
