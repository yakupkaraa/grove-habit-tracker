import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Polygon, Rect } from "react-native-svg";

import { colors } from "@/theme/colors";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

const HABITS: {
  name: string;
  icon: IconName;
  sub: string;
  streak: number;
  done: boolean;
}[] = [
  {
    name: "Su iç",
    icon: "water-outline",
    sub: "Her gün · 08:00",
    streak: 12,
    done: true,
  },
  {
    name: "Kitap oku",
    icon: "book-outline",
    sub: "Her gün · 21:30",
    streak: 5,
    done: false,
  },
  {
    name: "Yürüyüş",
    icon: "walk-outline",
    sub: "Her gün · 07:30",
    streak: 21,
    done: true,
  },
  {
    name: "Meditasyon",
    icon: "leaf-outline",
    sub: "Hafta içi · 07:00",
    streak: 3,
    done: true,
  },
  {
    name: "İngilizce çalış",
    icon: "chatbubble-outline",
    sub: "Hafta içi · 19:00",
    streak: 8,
    done: false,
  },
];

export default function Index() {
  const insets = useSafeAreaInsets();
  const doneCount = HABITS.filter((h) => h.done).length;
  const pct = Math.round((doneCount / HABITS.length) * 100);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 130, // alttaki nav'ın altında kalmasın
          gap: 10,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Header streak={21} />
        <Text style={styles.title}>{"Küçük\nadımlar"}</Text>

        <View style={styles.chips}>
          {["Tümü", "Sabah", "Öğle", "Akşam"].map((label, i) => (
            <Chip key={label} label={label} active={i === 0} />
          ))}
        </View>

        <SummaryCard done={doneCount} total={HABITS.length} pct={pct} />

        <View style={{ gap: 6 }}>
          {HABITS.map((h) => (
            <HabitRow key={h.name} {...h} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function Header({ streak }: { streak: number }) {
  return (
    <View style={styles.header}>
      <Text style={styles.greeting}>Günaydın</Text>
      <View style={styles.headerRight}>
        <View style={styles.streakPill}>
          <Ionicons name="flame" size={18} color={colors.ink} />
          <Text style={styles.streakText}>{streak} gün</Text>
        </View>
        <Pressable style={styles.roundBtn}>
          <Ionicons name="settings-outline" size={20} color={colors.ink} />
        </Pressable>
      </View>
    </View>
  );
}

function Chip({ label, active }: { label: string; active: boolean }) {
  return (
    <Pressable style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

function SummaryCard({
  done,
  total,
  pct,
}: {
  done: number;
  total: number;
  pct: number;
}) {
  return (
    <View style={styles.summary}>
      <RingScene pct={pct} size={140} />
      <View style={{ flex: 1 }}>
        <Text style={styles.summaryCount}>
          {done}/{total}
        </Text>
        <Text style={styles.summaryLabel}>tamamlandı</Text>
        <View style={styles.remainingPill}>
          <Text style={styles.remainingText}>
            {total - done} alışkanlık kaldı
          </Text>
        </View>
      </View>
    </View>
  );
}

// Dış halka (ilerleme) + ortasında çam manzarası
function RingScene({ pct, size }: { pct: number; size: number }) {
  const sw = 8;
  const r = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  const c = size / 2;
  const inner = size - 2 * sw - 8;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke={colors.track}
          strokeWidth={sw}
        />
        <Circle
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke={colors.deep}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={`${(circ * pct) / 100} ${circ}`}
          rotation={-90}
          origin={`${c}, ${c}`}
        />
      </Svg>
      <View
        style={[
          styles.sceneClip,
          { left: sw + 4, top: sw + 4, width: inner, height: inner },
        ]}
      >
        <PineScene size={inner} />
      </View>
    </View>
  );
}

function Tree({
  x,
  y,
  s,
  fill,
}: {
  x: number;
  y: number;
  s: number;
  fill: string;
}) {
  return (
    <>
      <Rect
        x={x - 2 * s}
        y={y}
        width={4 * s}
        height={6 * s}
        fill={colors.deep}
      />
      <Polygon
        points={`${x},${y - 36 * s} ${x - 14 * s},${y - 14 * s} ${x + 14 * s},${y - 14 * s}`}
        fill={fill}
      />
      <Polygon
        points={`${x},${y - 24 * s} ${x - 19 * s},${y + 2 * s} ${x + 19 * s},${y + 2 * s}`}
        fill={fill}
      />
    </>
  );
}

function PineScene({ size }: { size: number }) {
  const s = size / 120; // 120 birimlik tasarım alanını gerçek boyuta ölçekle
  return (
    <Svg width={size} height={size}>
      <Rect width={size} height={size} fill={colors.track} />
      <Circle cx={88 * s} cy={28 * s} r={12 * s} fill={colors.lime} />
      <Tree x={34 * s} y={92 * s} s={s} fill={colors.treeA} />
      <Tree x={86 * s} y={94 * s} s={s} fill={colors.treeA} />
      <Tree x={60 * s} y={98 * s} s={1.25 * s} fill={colors.treeB} />
      <Rect y={98 * s} width={size} height={22 * s} fill={colors.treeA} />
    </Svg>
  );
}

function HabitRow({ name, icon, sub, streak, done }: (typeof HABITS)[number]) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={20} color={colors.ink} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowName}>{name}</Text>
        <Text style={styles.rowSub}>
          {sub} · {streak} gün
        </Text>
      </View>
      <Pressable style={[styles.check, done && styles.checkDone]}>
        {done && <Ionicons name="checkmark" size={18} color={colors.lime} />}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greeting: { fontSize: 17, fontWeight: "600", color: colors.ink },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  streakPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: colors.card,
  },
  streakText: { fontSize: 16, fontWeight: "700", color: colors.ink },
  roundBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 42,
    lineHeight: 44,
    fontWeight: "500",
    letterSpacing: -0.8,
    color: colors.ink,
  },

  chips: { flexDirection: "row", gap: 8 },
  chip: {
    height: 40,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: "center",
  },
  chipActive: { backgroundColor: colors.deep },
  chipText: { fontSize: 14, fontWeight: "600", color: colors.ink },
  chipTextActive: { color: colors.lime },

  summary: {
    height: 160,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    padding: 10,
    paddingRight: 24,
    borderRadius: 40,
    backgroundColor: colors.card,
  },
  summaryCount: {
    fontSize: 44,
    lineHeight: 46,
    fontWeight: "600",
    color: colors.ink,
  },
  summaryLabel: { fontSize: 15, color: colors.muted, marginTop: 2 },
  remainingPill: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.deep,
  },
  remainingText: { fontSize: 13, fontWeight: "600", color: colors.lime },
  sceneClip: { position: "absolute", borderRadius: 999, overflow: "hidden" },

  row: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingLeft: 8,
    paddingRight: 10,
    borderRadius: 28,
    backgroundColor: colors.card,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.iconBg,
    alignItems: "center",
    justifyContent: "center",
  },
  rowName: { fontSize: 16, fontWeight: "600", color: colors.ink },
  rowSub: { fontSize: 12, color: colors.muted },
  check: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.ring,
    alignItems: "center",
    justifyContent: "center",
  },
  checkDone: { backgroundColor: colors.deep, borderColor: colors.deep },
});
