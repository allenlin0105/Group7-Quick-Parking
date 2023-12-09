import React from "react";
import History from "./History"
import Plan from "../../components/Plan";

export default function Home() {
    return (
        <>
            {/* <h1>
                todo: 加上警衛主頁
            </h1> */}
            <Plan guard={true}/>
            {/* <History spaceId={4}/> */}
        </>
    )
}