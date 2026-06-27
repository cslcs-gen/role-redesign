import { useEffect } from 'react';
import { checkApproval } from '../lib/apiClient.js';

export function useApprovalPolling(sessionId, enabled, onStatusChange, onError) {
  useEffect(() => {
    if (!sessionId || !enabled) {
      return undefined;
    }

    let cancelled = false;

    const poll = async () => {
      try {
        const result = await checkApproval(sessionId);
        if (!cancelled) {
          onStatusChange(result.status);
        }
      } catch (error) {
        if (!cancelled) {
          onError(error.message);
        }
      }
    };

    poll();
    const timer = window.setInterval(poll, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [enabled, onError, onStatusChange, sessionId]);
}
