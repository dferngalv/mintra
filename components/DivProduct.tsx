import { globalStyles } from "@/styles/global-styles";
import { Image, Text, View } from 'react-native';

interface ProductData {
    image:number,
    altImage:string,
    name:string,
    prize:string,
    stars:number,
    altStars:string,
}

function DivProduct({image, altImage, name, prize, stars, altStars}:ProductData){
    return (
        <>
            <View style={globalStyles.prodcontainer}>
                <Image source={image} accessibilityLabel={altImage} style={globalStyles.imagenesProducto} resizeMode="contain"/>
                <Text style={[globalStyles.textSmall, globalStyles.regular, { marginTop: 2 }]}>{name}</Text>
                <View style={globalStyles.proddesccontainer}>
                    <Text style={[globalStyles.textMedium, globalStyles.bold]}>{prize}€</Text>
                    <Image source={stars} accessibilityLabel={altStars} style={globalStyles.imagenesRatingProducto}/>
                </View>
            </View>
        </>
    );
}

export default DivProduct;