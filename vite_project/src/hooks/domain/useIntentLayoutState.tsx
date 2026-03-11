import {useState} from "react";

export const useIntentLayoutState = () => {

    const [showRightColumn, setShowRightColumn] = useState(false)
    const [isEvaluating, setIsEvaluating] = useState(false)

    return {
        showRightColumn,
        setShowRightColumn,
        isEvaluating,
        setIsEvaluating
    }
}