'use client'
import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";

export default function Success() {
    const params = useSearchParams()
    const session_id = params.get('session_id')!
    const [data, setData] = useState('');

    useEffect( () => {
        fetch(`/api/success?session_id=${session_id}`)
          .then((res) => res.json())
          .then((json) => {
            setData(json.customer_details.name);
              console.log(json.customer_details.name)
          });
    }, []);


    return (
        <main>
            <div className="p-4">
                <h1>
                    Success!
                </h1>
                <h2>
                    Your name is {data}
                </h2>
            </div>
        </main>
    )
}
