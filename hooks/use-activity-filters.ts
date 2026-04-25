import { Category, Transaction } from '@/model';
import { endOfDay, format, isWithinInterval, startOfDay } from 'date-fns';
import { useMemo, useState } from 'react';
import { DateRange } from '@/components/activity/date-range-picker';
import { TypeFilter } from '@/components/activity/activity-filter-dialog';

export function useActivityFilters(
  transactions: Transaction[],
) {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('expense');
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = useMemo(() => {
    let list = [...transactions];

    if (typeFilter !== 'all') {
      list = list.filter(t => t.type === typeFilter);
    }

    if (dateRange.start && dateRange.end) {
      const start = startOfDay(dateRange.start);
      const end = endOfDay(dateRange.end);
      list = list.filter(t =>
        isWithinInterval(new Date(t.date), { start, end })
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter(
        t =>
          t.description?.toLowerCase().includes(query) ||
          t.category?.toLowerCase().includes(query)
      );
    }

    return list.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [transactions, typeFilter, dateRange, searchQuery]);

  const totalFilteredSpend = useMemo(
    () => filteredTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0),
    [filteredTransactions]
  );

  const groupedByCategory = useMemo(() => {
    return filteredTransactions.reduce<Record<string, Transaction[]>>(
      (acc, t) => {
        const name = t.category || 'Uncategorized';
        if (!acc[name]) acc[name] = [];
        acc[name].push(t);
        return acc;
      },
      {}
    );
  }, [filteredTransactions]);

  const sortedCategoryNames = useMemo(() => {
    return Object.keys(groupedByCategory).sort((a, b) => {
      const totalA = groupedByCategory[a].reduce((s, t) => s + Math.abs(t.amount), 0);
      const totalB = groupedByCategory[b].reduce((s, t) => s + Math.abs(t.amount), 0);
      return totalB - totalA;
    });
  }, [groupedByCategory]);

  const historyByDate = useMemo(() => {
    return filteredTransactions.reduce<Record<string, Transaction[]>>(
      (acc, t) => {
        const dateStr = format(new Date(t.date), 'yyyy-MM-dd');
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(t);
        return acc;
      },
      {}
    );
  }, [filteredTransactions]);

  return {
    // State
    typeFilter,
    setTypeFilter,
    dateRange,
    setDateRange,
    searchQuery,
    setSearchQuery,

    // Derived data
    filteredTransactions,
    totalFilteredSpend,
    groupedByCategory,
    sortedCategoryNames,
    historyByDate,
  };
}
