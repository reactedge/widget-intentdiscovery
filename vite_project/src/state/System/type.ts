import type {GraphqlClient} from "../../lib/graphql.ts";
import type {IntentEngine} from "../../integration/intent/IntentEngine.ts";

export interface SystemState {
    graphqlClient: GraphqlClient;
    intentEngine: IntentEngine;
}