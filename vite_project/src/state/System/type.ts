import type {GraphqlClient} from "../../lib/graphql.ts";
import type {IntentEngine} from "../../integration/intent/IntentEngine.ts";
import type {IntentState} from "../../integration/intent/types.ts";

export interface SystemState {
    graphqlClient: GraphqlClient;
    intentEngine: IntentEngine;
    intentState: IntentState
}