import { useState, useEffect } from "react";
import { subscriptionService } from "@/lib/subscription-service";

const SUBSCRIPTION_KEY = "subscription_data_v1";

export function useSubscription(token) {
  const [subscription, setSubscription] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [subscriptionError, setSubscriptionError] = useState(null);

  // Fetch subscription data from backend on mount or when token changes
  useEffect(() => {
    if (!token) {
      setSubscription(null);
      setSubscriptionLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      try {
        setSubscriptionLoading(true);
        setSubscriptionError(null);

        // Fetch both status and usage in parallel
        const [statusResponse, usageResponse] = await Promise.all([
          subscriptionService.getStatus(token),
          subscriptionService.getUsage(token),
        ]);

        if (statusResponse?.data) {
          const subData = {
            ...statusResponse.data,
            usage: usageResponse?.data || null,
          };

          // Cache in localStorage
          try {
            localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subData));
          } catch (e) {
            console.warn("Failed to cache subscription data", e);
          }

          setSubscription(subData);
        }
      } catch (error) {
        console.error("Failed to fetch subscription:", error);
        setSubscriptionError(error);

        // Try to restore from cache
        try {
          const cached = localStorage.getItem(SUBSCRIPTION_KEY);
          if (cached) {
            setSubscription(JSON.parse(cached));
          }
        } catch (e) {
          console.warn("Failed to restore cached subscription", e);
        }
      } finally {
        setSubscriptionLoading(false);
      }
    };

    fetchSubscription();
  }, [token]);

  // Refresh subscription data manually
  const refreshSubscription = async () => {
    if (!token) return;
    try {
      setSubscriptionLoading(true);
      const [statusResponse, usageResponse] = await Promise.all([
        subscriptionService.getStatus(token),
        subscriptionService.getUsage(token),
      ]);

      if (statusResponse?.data) {
        const subData = {
          ...statusResponse.data,
          usage: usageResponse?.data || null,
        };
        localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subData));
        setSubscription(subData);
      }
    } catch (error) {
      console.error("Failed to refresh subscription:", error);
      setSubscriptionError(error);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  return {
    subscription,
    subscriptionLoading,
    subscriptionError,
    refreshSubscription,
  };
}
