import axios, { AxiosRequestConfig } from "../../node_modules/axios/index";
import { useState, useEffect } from "react";

const api = axios.create({
    baseURL: 'http://localhost:8081/alunos'
})

export function useFetch<T = unknown>(url: string, options?: AxiosRequestConfig) {
    const [data, setData] = useState<T | null>(null);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    useEffect(() => {
        api.get(url, options)
            .then(response => {
                setData(response.data);
            })
            .catch(err => {
                setError(err);
            })
            .finally(() => {
                setIsFetching(false)
            })
    }, [])

    return { data, isFetching, error }
}