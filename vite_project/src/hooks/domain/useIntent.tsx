import {useEffect, useState} from "react";
import {createEmptyContext, loadContext, saveContext} from "../../state/Intent/intentContext.ts";

export function useIntent() {
    const [context, setContext] = useState(() => {
        return loadContext() || createEmptyContext()
    })

    // ← THIS is the only place persistence happens
    useEffect(() => {
        saveContext(context)
    }, [context])

    return { context, setContext }
}