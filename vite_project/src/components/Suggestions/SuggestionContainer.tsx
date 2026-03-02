import type {AiRecommendationResponse} from "../../hooks/infra/useAiRecommendations.tsx";
import {SuggestionCard} from "./SuggestionCard.tsx";

type Props = {
    data?: AiRecommendationResponse | null
    loading?: boolean
    error?: string | null
    onClose?: () => void
    title?: string
}

export const SuggestionContainer: React.FC<Props> = ({
     data,
     loading = false,
     error = null,
     onClose,
     title = "Suggestions",
    }) => {
    if (loading) {
        return (
            <section className="re-intent-card" aria-busy="true">
                <header className="re-intent-header">
                    <div className="re-intent-header-left">
                        <div className="re-intent-title">{title}</div>
                    </div>
                </header>

                <div className="re-intent-body">Finding matches…</div>
            </section>
        )
    }

    if (error) {
        return (
            <section className="re-intent-card" role="status">
                <header className="re-intent-header">
                    <div className="re-intent-header-left">
                        <div className="re-intent-title">{title}</div>
                    </div>
                </header>

                <div className="re-intent-body">
                    <div className="re-intent-message">Unable to load suggestions.</div>
                    <div className="re-intent-subtle">{error}</div>
                </div>
            </section>
        )
    }

    if (!data?.suggestions?.length) return null

    return (
        <section className="re-intent-card">
            <header className="re-intent-header">
                <div className="re-intent-header-left">
                    <div className="re-intent-title">{title}</div>
                    <div className="re-intent-subtitle">{data.message}</div>
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
                {data.suggestions.map((s) => (
                    <SuggestionCard key={s.title} suggestion={s}/>
                ))}
            </div>
        </section>
    )
}


