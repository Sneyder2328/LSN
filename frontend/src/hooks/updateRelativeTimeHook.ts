import {useEffect, useState} from "react";
// @ts-ignore
import * as moment_shortformat from "moment-shortformat";
import moment from "moment";

export const useTimeSincePublishedShort = (createdAt: string) => {
    const dateEntityCreated = new Date(createdAt).getTime();

    const getCurrentDiffInTime = (): number => new Date().getTime() - dateEntityCreated;

    const [timeSincePublished, setTimeSincePublished] = useState<string>(moment_shortformat(moment_shortformat() + getCurrentDiffInTime()).short(true));

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeSincePublished(moment_shortformat(moment_shortformat() + getCurrentDiffInTime()).short(true));
            console.log('updating useTimeSincePublishedShort');
        }, 60_000);
        return () => clearInterval(interval);
    }, []);

    return timeSincePublished;
};

export const useTimeSincePublished = (createdAt: string) => {
    const dateEntityCreated = new Date(createdAt).getTime();

    const [timeSincePublished, setTimeSincePublished] = useState<string>(moment(dateEntityCreated).fromNow());

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeSincePublished(moment(dateEntityCreated).fromNow());
            console.log('updating useTimeSincePublished');
        }, 60_000);
        return () => clearInterval(interval);
    }, []);

    return timeSincePublished;
};