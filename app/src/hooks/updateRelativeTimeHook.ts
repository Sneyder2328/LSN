import {useEffect, useState} from "react";
import {formatDistanceStrict} from "date-fns";

export const useTimeSincePublished = (createdAt: string) => {
    const dateEntityCreated = new Date(createdAt).getTime();
    const options = {
        addSuffix: true
    }
    const [timeSincePublished, setTimeSincePublished] = useState<string>(formatDistanceStrict(new Date(dateEntityCreated), new Date(), options));

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeSincePublished(formatDistanceStrict(new Date(dateEntityCreated), new Date(), options));
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    return timeSincePublished;
};