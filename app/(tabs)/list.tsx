import { StyleSheet, View } from 'react-native';
//import InputSearch from '@/components/InputSearch';
import { globalStyles } from '@/styles/global-styles';
//import useFilteredProducts from '@/hooks/useFilteredProducts';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
//import { PRODUCTS } from '@/constants/Products';
import { globalStylesDark } from '@/styles/global-styles-dark';
//import ElementsList from '@/components/ElementsList';
import { useTheme } from '@/contexts/ThemeProvider';

//En vez de view hay que usar uno que sirva para scrollear

export default function List() {

    const router = useRouter();

    const {theme, toggleTheme} = useTheme();
    const isDark = theme === "dark";

    //const{productosData, filteredMessage, searchProducto} = useFilteredProducts(PRODUCTS);

    return (
        <>
        
            <View style={isDark ? globalStylesDark.productlist : globalStyles.productlist}>
                
                {/*<InputSearch onChange={searchProducto}/>*/}        
                    
                <View style={{flex: 1, backgroundColor: Colors.primaryColor}}>
                    
                    {/*<ElementsList productosData={productosData} filteredMessage={filteredMessage}/>*/}

                </View>
            </View>
        
        </>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});