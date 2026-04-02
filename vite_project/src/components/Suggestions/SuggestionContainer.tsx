import {SuggestionCard} from "./SuggestionCard.tsx";
import type {EnrichedSuggestion} from "../../types/infra/magento/product.types.ts";

type Props = {
    recommendations?: EnrichedSuggestion[] | null
    onClose?: () => void
    title?: string
}

export const SuggestionContainer: React.FC<Props> = ({
     recommendations,
     onClose,
     title = "Suggestions",
    }) => {
    if (!recommendations?.length) return null

    return (
        <section className="re-intent-card">
            <header className="re-intent-header">
                <div className="re-intent-header-left">
                    <div className="re-intent-title">{title}</div>
                </div>

                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="re-intent-close-btn"
                    >
                        ×
                    </button>
                )}
            </header>

            <div className="re-intent-grid">
                {recommendations.map((s) => (
                    <SuggestionCard key={s.sku} suggestion={s}/>
                ))}
            </div>
        </section>
    )
}


