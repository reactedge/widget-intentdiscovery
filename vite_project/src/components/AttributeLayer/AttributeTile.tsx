import type {MagentoAggregation} from "../../hooks/infra/useProductAttributeLayer.tsx";
import {Icon} from "./Icon.tsx";
import {decodeHtmlEntities} from "../../lib/string.ts";

type AttributeTileProps = {
    attr: MagentoAggregation;
    isSelected: boolean;
    value?: string;
    onClick: () => void;
};

export const AttributeTile = ({ attr, isSelected, value, onClick }: AttributeTileProps) => (
    <div
        className="choice-tile"
        data-intent-card={attr.attribute_code}
        data-intent-active={isSelected}
        data-intent-activated={value !== ''}
        onClick={onClick}
    >
        <span className={`choice-tile__label ${isSelected ? 'choice-tile__label--selected' : ''}`}>
            {attr.label}
        </span>

        {value && <span className="choice-tile__info">{decodeHtmlEntities(value)}</span>}

        <Icon attribute_code={attr.attribute_code} />
    </div>
);