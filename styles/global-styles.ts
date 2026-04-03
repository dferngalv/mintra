import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
    prueba : {
        color : Colors.primaryColor
    },
    encabezado1 : {
        color: Colors.black,
        fontSize: 16
    },
    defaultcontainer : {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
    },
    textBiggest : {

        fontSize: 32
    },
    textBig : {

        fontSize: 25
    },
    textMedium : {

        fontSize: 20
    },
    textSmall : {

        fontSize: 16
    },
    bold : {

        fontFamily: 'Roboto',
        fontWeight: 700
    },
    regular : {
        fontFamily: 'Roboto',
        fontWeight: 400
    },
    imagenesProducto : {
        width: 150,
        height: 150,
        alignSelf: 'center'
    },
    imagenesRatingProducto : {
        maxWidth: 80,
        maxHeight: 70,
        alignSelf: 'flex-end',
        marginLeft: 'auto'
    },
    imagenDentroProducto : {
        width: 350,
        height: 350,
        alignSelf: 'center'
    },
    imagenesRatingDentroProducto : {
        maxWidth: 120,
        maxHeight: 110,
        alignSelf: 'flex-end',
        marginLeft: 20
    },
    textbox : {
        borderWidth: 3,
        borderColor: Colors.black,
        padding: 4,
        height: 30,
        margin: 20,
        backgroundColor: Colors.white,
        color: Colors.black,
        alignItems: 'center',
    },
    prodcontainer: {
        flexDirection: 'column',
        backgroundColor: Colors.white,
        borderRadius: 16,
        paddingHorizontal: 20,
        marginVertical: 25,
        marginHorizontal: 50,
        width: 250,
    },
    proddesccontainer:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    productlist: {
        flexDirection: 'column',
        alignContent: 'center',
        backgroundColor: Colors.white,
        flex: 1,
    },
    itemproductcontainer: {
        backgroundColor: Colors.white,
        marginHorizontal:50
    },
    backicontyle: {
        margin: 25
    },
    settingsandthemecontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    settingsoption: {
        backgroundColor: Colors.primaryColor,
        borderRadius: 16,
        padding: 20,
        marginVertical: 10,
    }
});