import { Text } from '@/components/ui/text';
import { Search } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';

type ActivityEmptyStateProps = {
  isSearching: boolean;
};

export function ActivityEmptyState({ isSearching }: ActivityEmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center pt-20 px-8">
      <View className="w-20 h-20 rounded-full bg-secondary/30 items-center justify-center mb-4">
        <Search size={32} className="text-muted-foreground" />
      </View>
      <Text className="text-lg font-bold text-center">No transactions found</Text>
      <Text className="text-muted-foreground text-center mt-1">
        {isSearching 
          ? "We couldn't find anything matching your search." 
          : "You haven't added any transactions yet."}
      </Text>
    </View>
  );
}
