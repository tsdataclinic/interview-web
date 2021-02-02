import { useState, useEffect } from 'react';
import { useOnlineStatus } from './useOnlineStatus';
import { ResponseData } from '@dataclinic/interview';
import { v4 as uuidv4 } from 'uuid';

type ResponseUpload = {
    data: ResponseData;
    uploaded: boolean;
    id: string;
    completedAt: Date;
};
export function useSubmitResults(result: ResponseData | null) {
    const [resultQueue, setResultQueue] = useState<ResponseUpload[]>([]);
    const online = useOnlineStatus();

    useEffect(() => {
        if (result) {
            setResultQueue([
                ...resultQueue,
                {
                    data: result,
                    uploaded: false,
                    id: uuidv4(),
                    completedAt: new Date(),
                },
            ]);
        }
    }, [result]);

    const attemptUpload = (result: ResponseUpload) => {
        fetch(process.env.REACT_APP_API_SERVER + '/interviews/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: result.data,
                completedAt: result.completedAt,
                id: result.id,
            }),
        })
            .then((resp) => {
                setResultQueue(
                    resultQueue.map((res) =>
                        res.id === result.id ? { ...res, uploaded: true } : res
                    )
                );
            })
            .catch((error) => {
                console.log('FAILED TO upload result ', result);
            });
    };

    useEffect(() => {
        if (online) {
            resultQueue
                .filter((result: any) => !result.uploaded)
                .forEach((result) => attemptUpload(result));
        }
    }, [online, resultQueue]);
}
