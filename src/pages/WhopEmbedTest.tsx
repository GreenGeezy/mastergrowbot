import { Navigate, useSearchParams } from "react-router-dom";

// Keep old diagnostic bookmarks, but use the same availability and destination
// checks as buyers. Never expose a superseded plan as a separate purchase route.
export default function WhopEmbedTest() {
  const [params] = useSearchParams();
  const routes: Record<string, string> = {
    scout: "scout-guide-bundle", soil: "soil-health-meter", tent: "grow-tent",
  };
  const product = routes[params.get("product") || ""];
  return <Navigate replace to={product ? `/grow-tech/checkout/${product}` : "/grow-tech"} />;
}
