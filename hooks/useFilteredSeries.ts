import { useState } from "react";

function useFilteredSeries(series : any[]){

    const [seriesData, setSeriesData] = useState(series);
    const [filteredMessage, setFilteredMessage] = useState("ANY SEARCH HAS BEEN MADE");

    function searchSeries(event: { nativeEvent: { text: string } }){

        let searchItem = event.nativeEvent.text.toLowerCase();
        let filtered = series.filter(seriesunit => seriesunit.title.toLowerCase().includes(searchItem));
        setSeriesData(filtered);
        changeFilteredMessage(filtered.length);
    }

    function changeFilteredMessage(counterFiltered:number){

        if(counterFiltered === 0){
            setFilteredMessage("Any series found");
            return;
        }

        setFilteredMessage("Found " + counterFiltered + " series");
    }

    return{
        seriesData,
        setSeriesData,
        filteredMessage,
        searchSeries
    };
}

export default useFilteredSeries;
