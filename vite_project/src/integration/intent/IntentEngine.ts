import type {IntentSignal, IntentState} from "./types.ts";

type Listener = (state: IntentState) => void;

export class IntentEngine {
    private state: IntentState = {
        intentText: '',
        categoryScore: {},
        attributeScore: {},
        productScore: {},
        priceAffinity: {},
        status: 'idle'
    };

    private listeners = new Set<Listener>();

    constructor() {
        this.resolveUrl()
    }

    private resolveUrl() {
        const path = window.location.pathname;
        const segments = path.split("/").filter(Boolean);
        let lastSegment = segments[segments.length - 1];
        if (lastSegment?.endsWith(".html")) {
            lastSegment = lastSegment.replace(".html", "");
        }
        this.state.currentUrl = lastSegment
    }

    subscribe(listener: Listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notify() {
        // IMPORTANT: emit a new reference so React state updates reliably
        const snapshot: IntentState = {
            intentText: this.state.intentText,
            categoryScore: { ...this.state.categoryScore },
            attributeScore: Object.fromEntries(
                Object.entries(this.state.attributeScore).map(([k, v]) => [k, { ...(v as any) }])
            ),
            productScore: { ...this.state.productScore },
            priceAffinity: { ...this.state.priceAffinity },
            status: this.state.status
        };

        for (const listener of this.listeners) listener(snapshot);
    }

    handle(signal: IntentSignal) {
        switch (signal.type) {
            case "category_view":
                this.bump(this.state.categoryScore, signal.id)
                break;
            case "filter_select":
                if (!this.state.attributeScore[signal.attribute]) {
                    this.state.attributeScore[signal.attribute] = {};
                }
                this.bump(
                    this.state.attributeScore[signal.attribute] as Record<string, number>,
                    signal.value
                );
                break;

            case "filter_deselect":
                if (!this.state.attributeScore[signal.attribute]) {
                    this.state.attributeScore[signal.attribute] = {};
                }
                this.lower(
                    this.state.attributeScore[signal.attribute] as Record<string, number>,
                    signal.value
                );
                break;

            case "product_view":
                this.bump(this.state.productScore, signal.sku);
                break;

            case "add_to_cart":
                this.bump(this.state.productScore, signal.sku);
                this.updatePriceAffinity(signal.price);
                break;
        }

        this.notify();
    }

    registerUrl() {
        const path = window.location.pathname;
        const segments = path.split("/").filter(Boolean);
        const lastSegment = segments[segments.length - 1];

        return {
            path,
            lastSegment
        };
    }

    getState() {
        return this.state;
    }

    private bump(map: Record<string, number>, key: string) {
        map[key] = (map[key] || 0) + 1;
    }

    private lower(map: Record<string, number>, key: string) {
        const next = (map[key] || 0) - 1;
        if (next <= 0) {
            delete map[key];
        } else {
            map[key] = next;
        }
    }

    private updatePriceAffinity(price: number) {
        const { min, max, avg } = this.state.priceAffinity as any;

        (this.state.priceAffinity as any).min =
            min === undefined ? price : Math.min(min, price);

        (this.state.priceAffinity as any).max =
            max === undefined ? price : Math.max(max, price);

        (this.state.priceAffinity as any).avg =
            avg === undefined ? price : (avg + price) / 2;
    }
}

export const createIntentEngine = () => new IntentEngine();