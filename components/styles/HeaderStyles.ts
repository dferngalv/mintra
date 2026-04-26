import { StyleSheet } from "react-native";

export const headerStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingTop: 30,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: 48,
    height: 48,
  },
  brandName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    padding: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    paddingTop: 60,
    paddingRight: 12,
  },
  menuContainer: {
    position: "absolute",
    top: 60,
    right: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    overflow: "hidden",
    minWidth: 150,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
});
