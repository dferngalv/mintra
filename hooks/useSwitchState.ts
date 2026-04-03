import { useState } from "react";

function useSwitchState(darkmode:boolean){

    //El estado del listado mostrará todos los videos.
    const [darkMode, setDarkMode] = useState(darkmode);

    //Esta función será llamada cada vez que el usuario inserta un valor en el input
    function cambiaModo(event: { nativeEvent: { text: string } }){
    
        setDarkMode(!darkMode);
    }

    return{
        darkMode,
        setDarkMode,
        cambiaModo
    };
}

export default useSwitchState;