import { StyleSheet } from "react-native";

export const commonStyles = StyleSheet.create({
  // Contenedores generales
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerInner: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },

  // Iconos y logos
  iconContainer: {
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 40,
  },
  iconBox: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  iconImage: {
    width: 100,
    height: 100,
  },

  // Títulos
  title: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 40,
    color: "#000",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center"
  },

  // Grupos de input
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#000",
  },
  required: {
    color: "#e74c3c",
    fontWeight: "700",
  },

  // Inputs
  input: {
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
  },
  passwordInputContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
    paddingRight: 44,
  },
   passwordInputLarge: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 100,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
    paddingRight: 44,
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
  },

  // Enlaces
  link: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  linkContainer: {
    marginBottom: 32,
  },

  // Botones
  button: {
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 2,
    borderColor: "#000",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  formButton: {
    borderWidth: 1,
    padding: 5,
    backgroundColor: "#ededed"
  },

  // Contenedores de texto con enlaces
  textLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  textLinkText: {
    fontSize: 14,
    color: "#666",
  },
  textLinkLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
    textDecorationLine: "underline",
  },

  //Footers
  footer: {
    marginBottom: 30,
  },
});
