import { Text } from '@/components/ui/text';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { Calendar, ChevronRight, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, Platform, Pressable, View } from 'react-native';

export type DateRange = {
  start: Date | null;
  end: Date | null;
};

type DateRangePickerProps = {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
};

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
}: DateRangePickerProps) {
  const [showModal, setShowModal] = useState(false);
  const [activePicker, setActivePicker] = useState<'start' | 'end' | null>(null);
  const [tempStart, setTempStart] = useState<Date>(dateRange.start || new Date());
  const [tempEnd, setTempEnd] = useState<Date>(dateRange.end || new Date());

  const hasRange = dateRange.start && dateRange.end;

  const openModal = () => {
    setTempStart(dateRange.start || new Date());
    setTempEnd(dateRange.end || new Date());
    setActivePicker(null);
    setShowModal(true);
  };

  const handleConfirm = () => {
    onDateRangeChange({
      start: tempStart,
      end: tempEnd,
    });
    setShowModal(false);
    setActivePicker(null);
  };

  const handleClear = () => {
    onDateRangeChange({ start: null, end: null });
    setShowModal(false);
    setActivePicker(null);
  };

  const handleDateChange = (
    _event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (Platform.OS === 'android') {
      setActivePicker(null);
    }
    if (!selectedDate) return;

    if (activePicker === 'start') {
      setTempStart(selectedDate);
      // Auto-fix if start is after end
      if (selectedDate > tempEnd) {
        setTempEnd(selectedDate);
      }
    } else if (activePicker === 'end') {
      setTempEnd(selectedDate);
      // Auto-fix if end is before start
      if (selectedDate < tempStart) {
        setTempStart(selectedDate);
      }
    }
  };

  // Render inline trigger chip
  const renderTrigger = () => {
    if (hasRange) {
      return (
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={openModal}
            className="flex-row items-center bg-primary/10 border border-primary/20 rounded-md px-3 py-2 gap-2"
          >
            <Calendar size={13} color="#f97316" />
            <Text className="text-[11px] font-bold text-primary tabular-nums">
              {format(dateRange.start!, 'dd MMM')}
            </Text>
            <ChevronRight size={10} color="#f97316" />
            <Text className="text-[11px] font-bold text-primary tabular-nums">
              {format(dateRange.end!, 'dd MMM')}
            </Text>
          </Pressable>
          <Pressable
            onPress={handleClear}
            className="w-7 h-7 rounded-md bg-destructive/10 items-center justify-center"
          >
            <X size={12} color="#ef4444" />
          </Pressable>
        </View>
      );
    }

    return (
      <Pressable
        onPress={openModal}
        className="flex-row items-center bg-secondary/10 border border-secondary/15 rounded-md px-3 py-2 gap-2"
      >
        <Calendar size={13} className="text-muted-foreground" />
        <Text className="text-[11px] font-semibold text-muted-foreground">
          Date Range
        </Text>
      </Pressable>
    );
  };

  return (
    <>
      {renderTrigger()}

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <Pressable className="flex-1" onPress={() => setShowModal(false)} />

          <View className="bg-background rounded-t-2xl px-6 pb-10 pt-5">
            {/* Modal Header */}
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-lg font-black text-foreground">
                Select Date Range
              </Text>
              <Pressable
                onPress={() => setShowModal(false)}
                className="w-8 h-8 rounded-md bg-muted items-center justify-center"
              >
                <X size={16} className="text-muted-foreground" />
              </Pressable>
            </View>

            {/* Date Selection Buttons */}
            <View className="flex-row gap-3 mb-5">
              <Pressable
                onPress={() => setActivePicker('start')}
                className={`flex-1 p-4 rounded-md border ${activePicker === 'start'
                  ? 'bg-primary/5 border-primary/30'
                  : 'bg-muted/30 border-border'
                  }`}
              >
                <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                  From
                </Text>
                <Text
                  className={`text-base font-black tabular-nums ${activePicker === 'start'
                    ? 'text-primary'
                    : 'text-foreground'
                    }`}
                >
                  {format(tempStart, 'dd MMM yyyy')}
                </Text>
              </Pressable>

              <View className="items-center justify-center">
                <ChevronRight size={16} className="text-muted-foreground" />
              </View>

              <Pressable
                onPress={() => setActivePicker('end')}
                className={`flex-1 p-4 rounded-md border ${activePicker === 'end'
                  ? 'bg-primary/5 border-primary/30'
                  : 'bg-muted/30 border-border'
                  }`}
              >
                <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                  To
                </Text>
                <Text
                  className={`text-base font-black tabular-nums ${activePicker === 'end'
                    ? 'text-primary'
                    : 'text-foreground'
                    }`}
                >
                  {format(tempEnd, 'dd MMM yyyy')}
                </Text>
              </Pressable>
            </View>

            {/* Inline DateTimePicker */}
            {activePicker && (
              <View className="bg-muted/20 rounded-md mb-5 overflow-hidden">
                <DateTimePicker
                  value={activePicker === 'start' ? tempStart : tempEnd}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  style={{ alignSelf: 'center' }}
                />
              </View>
            )}

            {/* Actions */}
            <View className="flex-row gap-3">
              <Pressable
                onPress={handleClear}
                className="flex-1 py-3.5 rounded-md border border-border items-center"
              >
                <Text className="text-sm font-bold text-muted-foreground">
                  Clear
                </Text>
              </Pressable>
              <Pressable
                onPress={handleConfirm}
                className="flex-1 py-3.5 rounded-md bg-primary items-center"
              >
                <Text className="text-sm font-bold text-primary-foreground">
                  Apply Range
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
