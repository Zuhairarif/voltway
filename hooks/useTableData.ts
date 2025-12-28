
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useTableData<T>(tableName: string, primaryKey: string = 'id') {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['table', tableName],
    queryFn: async () => {
      const { data, error } = await supabase.from(tableName).select('*');
      if (error) throw error;
      return data as T[];
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async (item: Partial<T>) => {
      const { data, error } = await supabase.from(tableName).upsert(item).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['table', tableName] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: any) => {
      const { error } = await supabase.from(tableName).delete().eq(primaryKey, id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['table', tableName] });
    },
  });

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    upsert: upsertMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    isMutating: upsertMutation.isPending || deleteMutation.isPending
  };
}
