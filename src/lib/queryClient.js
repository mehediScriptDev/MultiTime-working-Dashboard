import { QueryClient } from "@tanstack/react-query";
import { DUMMY_TIMEZONES } from "./dummy-data";

async function throwIfResNotOk(res) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(method, url, data) {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

export const getQueryFn = ({ on401 }) => async ({ queryKey }) => {
  const res = await fetch(queryKey[0], {
    credentials: "include",
  });

  if (on401 === "returnNull" && res.status === 401) {
    return null;
  }

  await throwIfResNotOk(res);
  return await res.json();
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        try {
          const fn = getQueryFn({ on401: "throw" });
          return await fn({ queryKey });
        } catch (e) {
          // In dev mode, return dummy data for known endpoints
          const isDev = import.meta.env.DEV;
          if (isDev) {
            if (queryKey[0] === "/api/timezones") {
              console.log("Using dummy timezones for development");
              return DUMMY_TIMEZONES;
            }
          }
          throw e;
        }
      },
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
