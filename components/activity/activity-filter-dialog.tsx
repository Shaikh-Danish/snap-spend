import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { Calendar, Check, SlidersHorizontal, ChevronRight } from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, View } from 'react-native';

export type DateFilter = 'all' | 'today' | 'week' | 'month' | 'custom';
export type TypeFilter = 'all' | 'expense' | 'income';

const DATE_OPTIONS = [
  { label: 'All Time', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'Custom Range', value: 'custom' },
];

const TYPE_OPTIONS = [
  { label: 'All Transactions', value: 'all' },
  { label: 'Spending Only', value: 'expense' },
  { label: 'Income Only', value: 'income' },
];

type ActivityFilterProps = {
  dateFilter: DateFilter;
  onDateFilterChange: (filter: DateFilter) => void;
  typeFilter: TypeFilter;
  onTypeFilterChange: (filter: TypeFilter) => void;
  startDate?: Date;
  endDate?: Date;
  onDateRangeChange: (start: Date, end: Date) => void;
};

export function ActivityFilterDialog({
  dateFilter,
  onDateFilterChange,
  typeFilter,
  onTypeFilterChange,
  startDate,
  endDate,
  onDateRangeChange,
}: ActivityFilterProps) {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleStartDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (date) onDateRangeChange(date, endDate || new Date());
  };

  const handleEndDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (date) onDateRangeChange(startDate || new Date(), date);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Pressable className={`w-12 h-12 rounded-2xl items-center justify-center border ${
          dateFilter !== 'all' || typeFilter !== 'all' 
            ? 'bg-primary border-primary shadow-sm shadow-primary/20' 
            : 'bg-secondary/40 border-border/50'
        }`}>
          <SlidersHorizontal size={20} color={dateFilter !== 'all' || typeFilter !== 'all' ? 'white' : 'currentColor'} className={dateFilter !== 'all' || typeFilter !== 'all' ? '' : 'text-foreground'} />
        </Pressable>
      </DialogTrigger>
      <DialogContent className="rounded-3xl w-[92%] bg-card border-border/50 shadow-2xl p-0 overflow-hidden">
        <ScrollView className="max-h-[85vh]" showsVerticalScrollIndicator={false} bounces={false}>
          <View className="p-6 gap-6">
            <DialogHeader className="mb-2">
              <DialogTitle className="text-2xl font-black">Filters</DialogTitle>
              <Text className="text-sm text-muted-foreground">Select how you want to view your activity</Text>
            </DialogHeader>

            <View className="gap-6">
              {/* Date Filter - Professional Vertical List */}
              <View className="gap-3">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[1.5px] ml-1">Time Period</Label>
                <View className="gap-1.5">
                  {DATE_OPTIONS.map((opt) => {
                    const isSelected = dateFilter === opt.value;
                    return (
                      <Pressable
                        key={opt.value}
                        onPress={() => onDateFilterChange(opt.value as DateFilter)}
                        className={`flex-row items-center justify-between px-5 py-4 rounded-2xl border ${
                          isSelected ? 'bg-primary/5 border-primary/20' : 'bg-secondary/20 border-transparent'
                        }`}
                      >
                        <Text className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                          {opt.label}
                        </Text>
                        {isSelected ? (
                          <Check size={18} className="text-primary" />
                        ) : (
                          <ChevronRight size={16} className="text-muted-foreground/30" />
                        )}
                      </Pressable>
                    );
                  })}
                </View>

                {dateFilter === 'custom' && (
                  <View className="mt-2 flex-row gap-3 bg-secondary/10 p-4 rounded-3xl border border-border/30">
                    <View className="flex-1 gap-1">
                      <Text className="text-[9px] font-black text-muted-foreground ml-1">FROM</Text>
                      <Pressable onPress={() => setShowStartPicker(true)} className="bg-background border border-border/50 rounded-xl px-4 py-3 flex-row items-center justify-between">
                        <Text className="text-xs font-bold">{startDate ? format(startDate, 'MMM d, yy') : 'Set'}</Text>
                        <Calendar size={12} className="text-muted-foreground" />
                      </Pressable>
                    </View>
                    <View className="flex-1 gap-1">
                      <Text className="text-[9px] font-black text-muted-foreground ml-1">TO</Text>
                      <Pressable onPress={() => setShowEndPicker(true)} className="bg-background border border-border/50 rounded-xl px-4 py-3 flex-row items-center justify-between">
                        <Text className="text-xs font-bold">{endDate ? format(endDate, 'MMM d, yy') : 'Set'}</Text>
                        <Calendar size={12} className="text-muted-foreground" />
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>

              {/* Separator */}
              <View className="h-px bg-border/40 mx-1" />

              {/* Type Filter - Horizontal Choice */}
              <View className="gap-4">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[1.5px] ml-1">Transaction Type</Label>
                <View className="flex-row gap-2">
                  {TYPE_OPTIONS.map((opt) => {
                    const isSelected = typeFilter === opt.value;
                    return (
                      <Pressable
                        key={opt.value}
                        onPress={() => onTypeFilterChange(opt.value as TypeFilter)}
                        className={`flex-1 items-center justify-center py-4 rounded-2xl border ${
                          isSelected ? 'bg-primary border-primary shadow-md shadow-primary/20' : 'bg-secondary/20 border-transparent'
                        }`}
                      >
                        <Text className={`text-[11px] font-bold ${isSelected ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                          {opt.label.split(' ')[0]}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View className="mt-2 gap-3">
                <DialogClose asChild>
                  <Button className="rounded-[24px] h-14 bg-primary shadow-lg shadow-primary/20">
                    <Text className="text-primary-foreground font-black text-base">Apply Filters</Text>
                  </Button>
                </DialogClose>
              </View>
            </View>
          </View>
        </ScrollView>

        {showStartPicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display="default"
            onChange={handleStartDateChange}
          />
        )}
        {showEndPicker && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            display="default"
            onChange={handleEndDateChange}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
