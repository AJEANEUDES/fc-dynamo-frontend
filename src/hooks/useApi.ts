import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export function useGet<T>(key: string | string[], url: string) {
  return useQuery<T>({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: () => api.get(url).then((r) => r.data),
  });
}

export function usePost<TData, TBody>(url: string, invalidateKey?: string) {
  const qc = useQueryClient();
  return useMutation<TData, Error, TBody>({
    mutationFn: (body) => api.post(url, body).then((r) => r.data),
    onSuccess: () => {
      if (invalidateKey) qc.invalidateQueries({ queryKey: [invalidateKey] });
    },
  });
}
