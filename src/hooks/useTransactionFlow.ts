import { useEffect } from "react";
import { useWaitForTransactionReceipt } from "wagmi";

export function useTransactionFlow({
  hash,
  onSuccess,
  onError,
}: {
  hash?: `0x${string}`;
  onSuccess?: () => void;
  onError?: (err: any) => void;
}) {
  const {
    isLoading: isConfirming,
    isSuccess,
    error,
  } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess) onSuccess?.();
  }, [isSuccess]);

  useEffect(() => {
    if (error) onError?.(error);
  }, [error]);

  return { isConfirming, isSuccess, error };
}
