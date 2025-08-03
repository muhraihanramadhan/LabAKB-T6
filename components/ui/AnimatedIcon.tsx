import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

// Menentukan tipe untuk props komponen
type AnimatedIconProps = {
  icon: { name: keyof typeof Ionicons.glyphMap; color: string };
  style: StyleProp<ViewStyle>;
  index: number;
};

export const ICON_SIZE = 50; // Ekspor ukuran untuk digunakan di file lain

export function AnimatedIcon({ icon, style }: AnimatedIconProps) {
  // Menggunakan useRef untuk menyimpan nilai animasi
  const scaleValue = useRef(new Animated.Value(1)).current;
  const rotationValue = useRef(new Animated.Value(0)).current;

  // Fungsi yang dipanggil saat ikon ditekan
  const handlePress = () => {
    // Reset animasi ke posisi awal sebelum memulai yang baru
    scaleValue.setValue(1);
    rotationValue.setValue(0);

    // Memulai dua animasi secara paralel (bersamaan)
    Animated.parallel([
      // Animasi 1: Skala (efek pop)
      Animated.timing(scaleValue, {
        toValue: 1.5,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      // Animasi 2: Rotasi
      Animated.timing(rotationValue, {
        toValue: 1, // 1 merepresentasikan satu putaran penuh
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Setelah animasi selesai, kembalikan ke ukuran normal
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  // Interpolasi nilai rotasi dari 0-1 menjadi '0deg'-'360deg'
  const spin = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={[style, { transform: [{ scale: scaleValue }, { rotate: spin }] }]}
    >
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon.name} size={ICON_SIZE} color={icon.color} />
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: ICON_SIZE + 20,
    height: ICON_SIZE + 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: (ICON_SIZE + 20) / 2,
    backgroundColor: "#2c2c2c",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
