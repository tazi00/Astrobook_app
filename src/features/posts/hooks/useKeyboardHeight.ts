import { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";

// Keyboard ki height — sirf scroll content me neeche jagah chhodne ke liye
// (taaki input hamesha scroll karke dikh sake). Position par depend nahi karte,
// kyunki edge-to-edge Android par geometry bharosemand nahi.
export function useKeyboardHeight() {
  const [h, setH] = useState(0);
  useEffect(() => {
    const show = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => setH(e.endCoordinates?.height ?? 0),
    );
    const hide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setH(0),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return h;
}
