import { useParams } from 'next/navigation';
import { useMemo } from 'react';

export const useChat = () => {
    const param = useParams();
    const chatId = useMemo(() => param?.chatId || '', [param?.chatId]);
    const isActive = useMemo(() => !!chatId, [chatId]);
    return { isActive, chatId };
};

export const useCall = () => {
    const param = useParams();
    const callId = useMemo(() => param?.callId || '', [param?.callId]); // Corrected `callId`
    const callActive = useMemo(() => !!callId, [callId]);
    return { callActive, callId };
};
