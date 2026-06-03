import { useState } from "react";

function useFilteredUsers(users : any[]){

    const [useruData, setUseruData] = useState(users);
    const [filteredMessage, setFilteredMessage] = useState("ANY SEARCH HAS BEEN MADE");

    function searchUser(event: { nativeEvent: { text: string } }){

        let searchItem = event.nativeEvent.text.toLowerCase();
        let filtered = users.filter(user => user.uname.toLowerCase().includes(searchItem));
        setUseruData(filtered);
        changeFilteredMessage(filtered.length);
    }

    function changeFilteredMessage(counterFiltered:number){

        if(counterFiltered === 0){
            setFilteredMessage("Any users found");
            return;
        }

        setFilteredMessage("Found " + counterFiltered + " users");
    }

    return{
        useruData,
        setUseruData,
        filteredMessage,
        searchUser
    };
}

export default useFilteredUsers;
