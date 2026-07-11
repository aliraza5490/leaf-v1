"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getConversationStats,
  getConversationTrends,
  getRecentConversations,
  getAnalyticsChannels,
  getAnalyticsHeatmap,
  getAnalyticsTopProducts,
  getAnalyticsKpiSummary,
  getAnalyticsGeography,
  getAnalyticsSatisfaction,
  getAnalyticsIntents,
  getAnalyticsAiPerformance,
  getAnalyticsVisitorActivity,
} from "@/lib/conversations/api";

import type { ConversationStats, TrendsResponse, ChannelsResponse, TopProductsResponse } from "@/lib/conversations/types";
import type { Conversation } from "@/types/conversation";

export function useConversationStats() {
  const [stats, setStats] = useState<ConversationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(() => {
    setLoading(true);
    getConversationStats()
      .then((data) => {
        setStats(data);
        setError(null);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Failed to load stats";
        setError(message);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchStats, 0);
    return () => clearTimeout(timer);
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

export function useConversationTrends(rangeDays: number = 7) {
  const [trends, setTrends] = useState<TrendsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      getConversationTrends(rangeDays)
        .then((data) => {
          setTrends(data);
          setError(null);
        })
        .catch((err: unknown) => {
          const message = err instanceof Error ? err.message : "Failed to load trends";
          setError(message);
        })
        .finally(() => setLoading(false));
    }, 0);
    return () => clearTimeout(timer);
  }, [rangeDays]);

  return { trends, loading, error };
}

export function useRecentConversations(limit: number = 5, pollInterval?: number) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(() => {
    setLoading(true);
    getRecentConversations(limit)
      .then((data) => {
        setConversations(data.conversations);
        setError(null);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Failed to load recent conversations";
        setError(message);
      })
      .finally(() => setLoading(false));
  }, [limit]);

  useEffect(() => {
    const timer = setTimeout(fetchConversations, 0);
    return () => clearTimeout(timer);
  }, [fetchConversations]);

  useEffect(() => {
    if (!pollInterval || pollInterval <= 0) return;
    const interval = setInterval(fetchConversations, pollInterval);
    return () => clearInterval(interval);
  }, [fetchConversations, pollInterval]);

  return { conversations, loading, error, refetch: fetchConversations };
}

export function useAnalyticsChannels() {
  const [channels, setChannels] = useState<ChannelsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      getAnalyticsChannels()
        .then((data) => {
          setChannels(data);
          setError(null);
        })
        .catch((err: unknown) => {
          const message = err instanceof Error ? err.message : "Failed to load channels";
          setError(message);
        })
        .finally(() => setLoading(false));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return { channels, loading, error };
}

export function useAnalyticsHeatmap() {
  const [heatmap, setHeatmap] = useState<Record<string, Record<string, number>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      getAnalyticsHeatmap()
        .then((data) => {
          setHeatmap(data.heatmap);
          setError(null);
        })
        .catch((err: unknown) => {
          const message = err instanceof Error ? err.message : "Failed to load heatmap";
          setError(message);
        })
        .finally(() => setLoading(false));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return { heatmap, loading, error };
}

export function useAnalyticsTopProducts(limit: number = 10) {
  const [products, setProducts] = useState<TopProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      getAnalyticsTopProducts(limit)
        .then((data) => {
          setProducts(data);
          setError(null);
        })
        .catch((err: unknown) => {
          const message = err instanceof Error ? err.message : "Failed to load top products";
          setError(message);
        })
        .finally(() => setLoading(false));
    }, 0);
    return () => clearTimeout(timer);
  }, [limit]);

  return { products, loading, error };
}

export function useAnalyticsKpiSummary() {
  const [kpis, setKpis] = useState<{ total: number; resolved: number; csat: number; sessionDuration: string; productClicks: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getAnalyticsKpiSummary()
      .then((data) => {
        if (active) {
          setKpis(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          const message = err instanceof Error ? err.message : "Failed to load KPIs";
          setError(message);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { kpis, loading, error };
}

export function useAnalyticsGeography() {
  const [geography, setGeography] = useState<{ name: string; visitors: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getAnalyticsGeography()
      .then((data) => {
        if (active) {
          setGeography(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          const message = err instanceof Error ? err.message : "Failed to load geography";
          setError(message);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { geography, loading, error };
}

export function useAnalyticsSatisfaction() {
  const [satisfaction, setSatisfaction] = useState<{ name: string; csat: number; responses: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getAnalyticsSatisfaction()
      .then((data) => {
        if (active) {
          setSatisfaction(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          const message = err instanceof Error ? err.message : "Failed to load CSAT trends";
          setError(message);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { satisfaction, loading, error };
}

export function useAnalyticsIntents() {
  const [intents, setIntents] = useState<{ name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getAnalyticsIntents()
      .then((data) => {
        if (active) {
          setIntents(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          const message = err instanceof Error ? err.message : "Failed to load intents";
          setError(message);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { intents, loading, error };
}

export function useAnalyticsAiPerformance() {
  const [performance, setPerformance] = useState<{ subject: string; score: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getAnalyticsAiPerformance()
      .then((data) => {
        if (active) {
          setPerformance(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          const message = err instanceof Error ? err.message : "Failed to load AI performance";
          setError(message);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { performance, loading, error };
}

export function useAnalyticsVisitorActivity() {
  const [activity, setActivity] = useState<{ name: string; visitors: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getAnalyticsVisitorActivity()
      .then((data) => {
        if (active) {
          setActivity(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          const message = err instanceof Error ? err.message : "Failed to load visitor activity";
          setError(message);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { activity, loading, error };
}

