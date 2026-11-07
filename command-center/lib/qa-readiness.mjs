/**
 * Read-only QA diagnostics are restricted to the distinct, SSO-protected Vercel QA
 * project. The Founder workspace must never expose this route, even if an
 * unrelated feature flag is accidentally set.
 */
export const ISOLATED_QA_PROJECT_ID = "prj_mLYAX9Ivg7FyIuaWNNw6yxOnyEB2";
export function qaReadinessAllowed(env) {
 return env.CC_QA_ISOLATED === "true" &&
        env.VERCEL_PROJECT_ID === ISOLATED_QA_PROJECT_ID &&
        (env.VERCEL_ENV === "preview" || env.VERCEL_ENV === "production");
}
