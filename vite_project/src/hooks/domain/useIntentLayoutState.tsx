import {useState} from "react";

export const useIntentLayoutState = () => {

    const [showRightColumn, setShowRightColumn] = useState(false)
    const [isSearching, setIsSearching] = useState(false)

    return {
        showRightColumn,
        setShowRightColumn,
        isSearching,
        setIsSearching
    }
}