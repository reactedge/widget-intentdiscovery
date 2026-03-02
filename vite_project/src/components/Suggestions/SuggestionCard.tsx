import {formatPrice} from "../../lib/price.ts";

export const SuggestionCard: React.FC<{ suggestion: any }> = ({ suggestion }) => {
    const content = (
        <>
            <a
                key={suggestion.title}
                href={suggestion.productUrl}
                className="re-intent-card-item"
            >
                {suggestion.imageUrl && (
                    <img
                        src={suggestion.imageUrl}
                        alt={suggestion.title}
                        loading="lazy"
                        className="re-intent-image"
                    />
                )}

                <div className="re-intent-card-body">
                    <div className="re-intent-product-title">
                        {suggestion.title}
                    </div>

                    <div className="re-intent-meta-row">
                        <span className="re-intent-pill">
                          {Math.round(suggestion.confidence * 100)}% match
                        </span>

                        {suggestion.price && (
                            <span className="re-intent-price">
                            {formatPrice(suggestion.price.value, suggestion.price.currency)}
                          </span>
                        )}
                    </div>

                    <div className="re-intent-reason">
                        {suggestion.reason}
                    </div>
                </div>
            </a>
        </>
    )

    // Link only if provided (Magento-safe)
    // Link only if provided (Magento-safe)
    return suggestion.productUrl ? (
        <a
            href={suggestion.productUrl}
            className="re-intent-card-item"
            aria-label={suggestion.title}
        >
            {content}
        </a>
    ) : (
        <div className="re-intent-card-item">
            {content}
        </div>
    )
}