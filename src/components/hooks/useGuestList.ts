"use client";

import { useCallback, useEffect, useState } from "react";

import type { Guest } from "@/types";

interface UseGuestListReturn {
  guests: Guest[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useGuestList(): UseGuestListReturn {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGuests = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const res: Response = await fetch("/api/guests");

      if (!res.ok) {
        throw new Error(`Failed to fetch guests: ${res.statusText}`);
      }

      const data: { docs: Guest[] } = await res.json();
      setGuests(data.docs);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error fetching guests";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchGuests();
  }, [fetchGuests]);

  return { guests, loading, error, refetch: fetchGuests };
}
