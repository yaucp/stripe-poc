"use client";
import { useEffect, useState } from "react";
import useSWRImmutable from 'swr/immutable'

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SessionSuccess({session_id} : {session_id: string}) {
    const [customerDetails, setCustomerDetails] = useState({});
    const { data, error, isLoading } = useSWRImmutable(`/api/checkout_session?session_id=${session_id}`, fetcher)

    console.log(data, isLoading)
    useEffect(() => {
        if (!isLoading){
            setCustomerDetails(data.customer_details)
        }
    }, [isLoading])

    if(isLoading) {
        return (
            <span>
                Loading...
            </span>)
    }

    return (
        <main>
            <div className="p-4">
                <h1>Landing page!</h1>
                <h2><span>Simple Checkout Success! Your details are {JSON.stringify(customerDetails)}</span></h2>
            </div>
        </main>
    );
}
