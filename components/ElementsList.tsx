import { router } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import DivProduct from "./DivProduct";
import { globalStyles } from "@/styles/global-styles";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeProvider";

interface Data {
    productosData: any[],
    filteredMessage: string
}

export default function ElementsList({productosData, filteredMessage} : Data){

    const {theme, toggleTheme} = useTheme();
    const isDark = theme === "dark";

    return(
        <FlatList
            data={productosData}
            renderItem={({item}) =>
                <View style={{flex: 1, alignItems: 'center'}}>
                    <Pressable
                        onPress={() =>
                            router.navigate({
                                pathname: '../item',
                                params: {
                                    id: item.id,
                                    page: 'List'
                                },
                            })
                        }
                    >
                        <DivProduct 
                            image={item.image}
                            altImage={item.altImage}
                            name={item.name}
                            prize={item.prize}
                            stars={item.stars}
                            altStars={item.altStars}
                        />
                    </Pressable>
                </View>}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={    
                <Text style={[globalStyles.textMedium, globalStyles.regular, {color: isDark ? Colors.white : Colors.black, backgroundColor: isDark ? Colors.black : Colors.white, paddingBottom: 10, textAlign: 'center'}]}>{filteredMessage}</Text>
            }
        />
    );
}