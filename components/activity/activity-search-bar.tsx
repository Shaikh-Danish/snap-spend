import {
  DateRange,
  DateRangePicker,
} from '@/components/activity/date-range-picker';
import { Search, X } from 'lucide-react-native';
import React from 'react';
import { Pressable, TextInput, View } from 'react-native';

type ActivitySearchBarProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
};

export function ActivitySearchBar({
  searchQuery,
  onSearchChange,
  dateRange,
  onDateRangeChange,
}: ActivitySearchBarProps) {
  return (
    <View className="px-6 py-3 bg-background border-y border-border/50">
      <View className="flex-row items-center gap-2">
        <View className="flex-row items-center flex-1 bg-muted/30 rounded-md px-3 h-10 border border-border/30">
          <Search size={14} className="text-muted-foreground" />
          <TextInput
            placeholder="Search..."
            className="flex-1 ml-2 text-sm font-medium text-foreground"
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholderTextColor="#a1a1aa"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => onSearchChange('')}>
              <X size={14} className="text-muted-foreground" />
            </Pressable>
          )}
        </View>

        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
        />
      </View>
    </View>
  );
}
