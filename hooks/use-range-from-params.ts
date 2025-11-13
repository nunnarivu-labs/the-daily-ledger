import { useSearchParams } from 'next/navigation';
import { Range } from '@/types/range';

export const useRangeFromParams = (): Range => {
  const searchParams = useSearchParams();

  if (!searchParams.has('from') || !searchParams.has('to')) {
    throw new Error('Invalid range');
  }

  return {
    from: new Date(parseInt(searchParams.get('from')!)),
    to: new Date(parseInt(searchParams.get('to')!)),
  };
};
