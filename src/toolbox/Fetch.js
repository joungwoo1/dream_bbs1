import { useFetch, usePost } from "hooks/UseFetch";
//uri에 있는 값을 renderSuccess로 값 받아오기
function Fetch({ uri, renderSuccess = f => f,
    loadingFallBack = <p>loading...</p>,
    renderError = ({ err }) => (<pre>{JSON.stringify(err, null, 2)}</pre>) }) {

    const { loading, data, error } = useFetch(uri);

    if (loading) return loadingFallBack;
    if (error) return renderError({ error });
    if (data) {
        return renderSuccess(data);
    };
}

function AxiosPost({ uri, body, renderSuccess = f => f,
    loadingFallBack = <p>loading...</p>,
    renderError = ({ err }) => (<pre>{JSON.stringify(err, null, 2)}</pre>) }) {

    const { loading, data, error } = usePost(uri, body);

    if (loading) return loadingFallBack;
    if (error) return renderError({ error });
    if (data) {
        return renderSuccess(body, data);
    }
}

export { Fetch, AxiosPost };