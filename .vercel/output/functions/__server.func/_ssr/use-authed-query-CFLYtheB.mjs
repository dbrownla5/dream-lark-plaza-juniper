import { n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CNRHZ6ay.mjs";
import { n as createSsrRpc } from "./router-BFD3Z3wa.mjs";
import { n as useCurrentUserState } from "./use-current-user-C1gy_R6G.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-authed-query-CFLYtheB.js
var loadHome = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("61c3a9cf505ce555f011a9cd99afbb4af90e267a1e8cec70f021b4735bc4e5a7"));
var loadAgents = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("b21cd5edb8910bdfe12b817bef301c381d23e67f1ae09bd26a96bb531a007c31"));
var loadWork = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("49dbb9cc84a771efe63a804262f28f0469037b5be608d2f6202845781efd93b1"));
var loadMedia = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("a0e3bcf60955ab12a4fea42f06c8f2bca64a6f226b0f8363b016d4371001640b"));
var loadDocuments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("839a34b74e283c8b886bea7b8bf9fa49b60030bdaf4c78ef936721d23b2cb91a"));
var loadReview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("1ead7bebe510b535aac00ff4b3b9533bc0cfbe5a21b8b0c7f34e89888c9a76cb"));
var loadContext = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("8f908008f69067becaa467cf1cda9b45b8ac424976d53bc3f7550ac61474c633"));
var loadOutputs = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("ba43822caf69b3d104990edbffec74bb34b1791094fc04be50b77168013fccba"));
var loadSystem = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("1c48f574f87ad3548a64672122efa9570b10da1617e5fb73a3540da9b16c66ff"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("16507f8bc426157025e34b8f8ad6fdf77c134329ac997343a75f22d46bca30e8"));
var submitCorrection = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("d777d437ff4236b21d4b8a1cd8d18ccb1a2811222dd2e0b943f967eaed2e65ca"));
var sealVoicePillar = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("e7c83328a975ca6e581baf536aee68ab2179c77a1180acae9516ed261d146f30"));
var postApproval = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("46bf51134ce78b33668719ee7dcf437d3f5ed4ba13c524de8523e1da6319b823"));
var postResume = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("963a868fc0e00f5e51b64a4ead60c1d48439fd948e3cdc97cda63eeb3ec546ef"));
var postStartChain = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("8a37e85ec985d189858e2d8e9ce54a200fedaca4eae363102ae222a560e4455c"));
var postSelfTest = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("9dbd7b3d567614fe256f408032ea34664545414bd3e1adcb2f4dee475943f68c"));
var postQualify = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("9d570e9ad256269e593fabca6ee6775bd87698190af132fffd9c008a8af64a14"));
var postMcpToken = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("5d229e8c07a0d04251625a870c90e170625dc6f4cafa1592f4632a6200ef8f61"));
var postRunRole = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("15a572260f3181072141430b95a290dbd8bcaa447a35f973c08e61fda94d25f9"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("bae63bd1258a5008e9aa479cb1eb8266bca7bed682b7aea91c80f5d20e0ffe26"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("68b4864f0c3545d6898a5fdc318d88187819f8d15b153bdbe5f9dd3af966555d"));
function useAuthedQuery(key, fn) {
	const { user, isPending } = useCurrentUserState();
	return useQuery({
		queryKey: [key],
		queryFn: fn,
		enabled: Boolean(user) && !isPending
	});
}
//#endregion
export { sealVoicePillar as _, loadMedia as a, loadSystem as c, postMcpToken as d, postQualify as f, postStartChain as g, postSelfTest as h, loadHome as i, loadWork as l, postRunRole as m, loadContext as n, loadOutputs as o, postResume as p, loadDocuments as r, loadReview as s, loadAgents as t, postApproval as u, submitCorrection as v, useAuthedQuery as y };
