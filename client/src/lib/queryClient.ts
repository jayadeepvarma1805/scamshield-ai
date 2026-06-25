import { type QueryKey } from "@tanstack/react-query";

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: {
      ...(data ? { "Content-Type": "application/json" } : {}),
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || res.statusText);
  }

  return res;
}

export const queryClient = new (await import("@tanstack/react-query")).QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }: { queryKey: QueryKey }) => {
        const res = await fetch(queryKey[0] as string);
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      },
    },
  },
});
