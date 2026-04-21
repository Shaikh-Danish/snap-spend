import { Text } from '@/components/ui/text';
import { Clock, MoreHorizontal } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';
import { TypeFilter } from './activity-filter-dialog';

type ActivityHeaderProps = {
  typeFilter: TypeFilter;
  onTypeFilterChange: (filter: TypeFilter) => void;
};

export function ActivityHeader({
  typeFilter,
  onTypeFilterChange,
}: ActivityHeaderProps) {
  return (
    <View className="bg-background pb-2 pt-2 px-5">
      <View className="flex-row items-center justify-between h-12">
        <Pressable className="w-10 h-10 items-center justify-center rounded-full bg-secondary/20">
          <MoreHorizontal size={20} className="text-foreground" />
        </Pressable>

        <View className="flex-row bg-muted/50 p-1 rounded-xl">
          <Pressable
            onPress={() => onTypeFilterChange('expense')}
            className={`px-4 py-1.5 rounded-lg ${typeFilter === 'expense' ? 'bg-background shadow-sm' : ''}`}
          >
            <Text className={`text-sm font-semibold ${typeFilter === 'expense' ? 'text-foreground' : 'text-muted-foreground'}`}>
              Expense
            </Text>
          </Pressable>
          <Pressable
            onPress={() => onTypeFilterChange('income')}
            className={`px-4 py-1.5 rounded-lg ${typeFilter === 'income' ? 'bg-background shadow-sm' : ''}`}
          >
            <Text className={`text-sm font-semibold ${typeFilter === 'income' ? 'text-foreground' : 'text-muted-foreground'}`}>
              Income
            </Text>
          </Pressable>
        </View>

        <Pressable className="w-10 h-10 items-center justify-center rounded-full bg-secondary/20">
          <Clock size={20} className="text-foreground" />
        </Pressable>
      </View>
    </View>
  );
}

