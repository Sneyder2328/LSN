import {useEffect, useState} from "react";
// @ts-ignore
import * as moment_shortformat from "moment-shortformat";
import {formatDistanceStrict} from "date-fns";

export const useTimeSincePublishedShort = (createdAt: string) => {
    const dateEntityCreated = new Date(createdAt).getTime();

    const getCurrentDiffInTime = (): number => new Date().getTime() - dateEntityCreated;

    const [timeSincePublished, setTimeSincePublished] = useState<string>(moment_shortformat(moment_shortformat() + getCurrentDiffInTime()).short(true));

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeSincePublished(moment_shortformat(moment_shortformat() + getCurrentDiffInTime()).short(true));
        }, 60_000);
        return () => clearInterval(interval);
    }, []);

    return timeSincePublished;
};

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