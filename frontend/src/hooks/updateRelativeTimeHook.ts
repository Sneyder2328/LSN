import {useEffect, useState} from "react";
import {formatDistanceStrict} from "date-fns";

/**
 * Hook for updating the relative time of an entity every 60 seconds
 * @param createdAt milliseconds since epoch time when the entity was created
 */
export const useTimeSincePublishedShort = (createdAt: string) => {
    const dateEntityCreated = new Date(createdAt).getTime();
    const options = {
        addSuffix: false
    }
    const [timeSincePublished, setTimeSincePublished] = useState<string>(formatDistanceStrict(new Date(dateEntityCreated), new Date(), options));

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeSincePublished(formatDistanceStrict(new Date(dateEntityCreated), new Date(), options));
        }, 60_000);
        return () => clearInterval(interval);
    }, []);

    return timeSincePublished;
};

/**
 * Hook for updating the relative time of an entity every 60 seconds
 * @param createdAt milliseconds since epoch time when the entity was created
 */
export const useTimeSincePublished = (createdAt: string) => {
    const dateEntityCreated = new Date(createdAt).getTime();
    const options = {
        addSuffix: true
    }
    const [timeSincePublished, setTimeSincePublished] = useState<string>(formatDistanceStrict(new Date(dateEntityCreated), new Date(), options));

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeSincePublished(formatDistanceStrict(new Date(dateEntityCreated), new Date(), options));
        }, 60_000);
        return () => clearInterval(interval);
    }, []);

    return timeSincePublished;
};