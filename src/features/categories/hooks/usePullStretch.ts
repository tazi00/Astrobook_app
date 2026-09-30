import { useRef } from "react";
import { Animated, type GestureResponderEvent, type NativeScrollEvent, type NativeSyntheticEvent } from "react-native";

// "Rubber band" banner: scroll ke top pe neeche kheencho → `pull` value badhti
// hai (resistance ke saath), chhodte hi spring se wapas 0.
//
// Native bounce pe depend nahi karte (Android pe negative offset milta hi
// nahi), isliye touch events se khud handle karte hain — dono platform pe
// same feel. ScrollView pe `bounces={false}` rakho warna iOS pe double effect.
const MAX_PULL = 140;
const START_SLOP = 6;

// dy jitna zyada, utna kam response — MAX_PULL ke paas asymptote
const rubber = (dy: number) => MAX_PULL * (1 - Math.exp(-dy / (MAX_PULL * 1.6)));

// Native pe nativeEvent.pageX/pageY milta hai; web (touch events) pe touches[0]
function point(e: GestureResponderEvent) {
  const n: any = e.nativeEvent;
  const t = n.touches?.[0] ?? n;
  return { x: t.pageX as number, y: t.pageY as number };
}

export function usePullStretch() {
  const pull = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(0);
  const start = useRef<{ x: number; y: number; atTop: boolean } | null>(null);
  const active = useRef(false);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollY.current = e.nativeEvent.contentOffset.y;
  };

  const release = () => {
    start.current = null;
    if (!active.current) return;
    active.current = false;
    Animated.spring(pull, {
      toValue: 0,
      useNativeDriver: false,
      tension: 90,
      friction: 7, // thoda bounce — rubber band feel
    }).start();
  };

  const onTouchStart = (e: GestureResponderEvent) => {
    const { x, y } = point(e);
    start.current = { x, y, atTop: scrollY.current <= 0 };
  };

  const onTouchMove = (e: GestureResponderEvent) => {
    const s = start.current;
    if (!s || !s.atTop) return;
    const p = point(e);
    const dy = p.y - s.y;
    const dx = Math.abs(p.x - s.x);
    if (!active.current && (dy < START_SLOP || dx > dy)) return; // horizontal swipe / upar ki taraf
    active.current = true;
    pull.setValue(rubber(Math.max(0, dy)));
  };

  return {
    pull,
    maxPull: MAX_PULL,
    scrollProps: {
      onScroll,
      scrollEventThrottle: 16,
      bounces: false,
      overScrollMode: "never" as const,
      onTouchStart,
      onTouchMove,
      onTouchEnd: release,
      onTouchCancel: release,
    },
  };
}
