import { useEffect, useState } from "react";

export function useFetch(uri) {
    const [data, setData] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
        console.log(`${uri}`);
        if(!uri) return;

        fetch(uri)
        .then(response => response.json())
        .then(setData)
        .then(setLoading(false))
        .catch(setError);

       

    }, [uri]);

    

    return {
        loading,
        data,
        error
    };
}
