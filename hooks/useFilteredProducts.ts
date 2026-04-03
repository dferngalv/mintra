import { useState } from "react";

function useFilteredProducts(productos : any[]){

    //El estado del listado mostrará todos los videos.
    const [productosData, setProductosData] = useState(productos);
    const [filteredMessage, setFilteredMessage] = useState("NO SE HA REALIZADO NINGUNA BÚSQUEDA");

    //Esta función será llamada cada vez que el usuario inserta un valor en el input
    function searchProducto(event: { nativeEvent: { text: string } }){

        let searchItem = event.nativeEvent.text.toLowerCase();
        let filteredProductos = productos.filter(producto => producto.name.toLowerCase().includes(searchItem));
                                            //ESPECIFICAMOS LA CONDICIÓN QUE SE DEBE CUMPLIR PARA OBTENER LOS VIDEOS QUE COINCIDEN CON LA BÚSQUEDA
        setProductosData(filteredProductos);
        changeFilteredMessage(filteredProductos.length);
    }

    function changeFilteredMessage(counterFilteredProductos:number){

        if(counterFilteredProductos === 0){
            setFilteredMessage("No se han encontrado productos");
            return;
        }

        setFilteredMessage("Se han encontrado " + counterFilteredProductos + " productos");
    }

    return{
        productosData,
        filteredMessage,
        searchProducto
    };
}

export default useFilteredProducts;