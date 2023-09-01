import { useFetch } from "hooks/useFetch";


export default function Fetch({uri, renderSuccess = f => f,
    loadingFallBack = <p>loading...</p>,
    renderError = ({err}) => (<pre>{JSON.stringify(err, null, 2)}</pre>)}) {

    const {loading, data , error} = useFetch(uri);

        
    if(loading) return loadingFallBack;
    if(error) return renderError({error});
    if(data) {
        if (Array.isArray(data)){
            data.map();
            return;
        }
        return renderSuccess(data);
    }
}