import { useState, useEffect } from 'react';

const getOnlineStatus = () => navigator?.onLine;

export function useOnlineStatus() {
    const [status, setStatus] = useState(getOnlineStatus());

    const isOnline = () => setStatus(true);
    const isOffline = () => setStatus(false);
    useEffect(() => {
        window.addEventListener('online', isOnline);
        window.addEventListener('offline', isOffline);
        return () => {
            window.removeEventListener('online', isOnline);
            window.removeEventListener('online', isOffline);
        };
    }, []);
    return status;
}
