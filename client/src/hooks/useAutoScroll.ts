import { useState, useEffect, useRef, useCallback } from "react";

export const useAutoScroll = () => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [initialScrollDone, setInitialScrollDone] = useState(false);

  const isNearBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return false;
    const threshold = 100;
    const position = container.scrollTop + container.clientHeight;
    return container.scrollHeight - position < threshold;
  };

  const handleScroll = useCallback(() => {
    setAutoScroll(isNearBottom());
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToBottom = (smooth: boolean) => {
    if (smooth) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      const container = messagesContainerRef.current;
      if (container) container.scrollTop = container.scrollHeight;
    }
  };

  const handleMessagesUpdate = (messagesLength: number) => {
    const container = messagesContainerRef.current;
    if (!container) return;

    if (messagesLength && !initialScrollDone) {
      scrollToBottom(false);
      setInitialScrollDone(true);
      setAutoScroll(true);
    } else if (messagesLength && initialScrollDone) {
      if (isNearBottom()) {
        scrollToBottom(true);
        setAutoScroll(true);
      } else {
        setAutoScroll(false);
      }
    }
  };

  return {
    messagesContainerRef,
    messagesEndRef,
    autoScroll,
    setAutoScroll,
    initialScrollDone,
    handleMessagesUpdate,
    scrollToBottom,
  };
};
