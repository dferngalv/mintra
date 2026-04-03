import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const globalStylesDark = StyleSheet.create({
    defaultcontainer : {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.black,
    },
    textbox : {
        borderWidth: 3,
        borderColor: Colors.white,
        padding: 4,
        height: 30,
        margin: 20,
        backgroundColor: Colors.black,
        color: Colors.white,
        alignItems: 'center',
    },
    prodcontainer: {
        flexDirection: 'column',
        backgroundColor: Colors.black,
        borderRadius: 16,
        paddingHorizontal: 20,
        marginVertical: 25,
        marginHorizontal: 50,
        width: 250,
    },
    productlist: {
        flexDirection: 'column',
        alignContent: 'center',
        backgroundColor: Colors.black,
        flex: 1,
    },
    settingsandthemecontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
});