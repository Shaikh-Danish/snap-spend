import { database } from '@/model';
import Category from '@/model/category';
import withObservables from '@nozbe/with-observables';
import { Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

type CategoryPickerProps = {
  selectedId: string;
  onSelect: (id: string) => void;
  categories: Category[];
};

const TAILWIND_500_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', // Red, Orange, Amber, Yellow, Lime
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', // Green, Emerald, Teal, Cyan, Sky
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', // Blue, Indigo, Violet, Purple, Fuchsia
  '#ec4899', '#f43f5e' // Pink, Rose
];

const CategoryPickerComponent = ({ selectedId, onSelect, categories }: CategoryPickerProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryColor, setCategoryColor] = useState(TAILWIND_500_COLORS[0]);

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) return;

    try {
      await database.write(async () => {
        await database.collections.get<Category>('categories').create((c) => {
          c.name = categoryName.trim();
          c.icon = '';
          c.color = categoryColor;
          c.usageCount = 0;
        });
      });

      setCategoryName('');
      setIsModalVisible(false);
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  const sortedCategories = [...categories].sort((a, b) => b.usageCount - a.usageCount);

  return (
    <View className="h-[42px]">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 8, alignItems: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Add Button - Borderless & Clean */}
        <Pressable
          onPress={() => setIsModalVisible(true)}
          className="h-[40px] px-5 flex-row items-center justify-center rounded-md bg-secondary/15"
        >
          <Plus size={18} color="#8c8273" />
        </Pressable>

        {sortedCategories.map(cat => (
          <Pressable
            key={cat.id}
            onPress={() => onSelect(cat.id)}
            className="h-[40px] items-center justify-center"
          >
            <View
              style={{
                backgroundColor: selectedId === cat.id ? cat.color : `${cat.color}15`,
              }}
              className="px-6 py-2 rounded-md"
            >
              <Text
                className="text-xs font-bold tracking-tight"
                style={{ color: selectedId === cat.id ? 'white' : cat.color }}
              >
                {cat.name}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* New Category Modal */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View className="bg-card rounded-t-3xl p-6 pb-12">
            <View className="flex-row justify-between items-center mb-8">
              <Text className="text-xl font-bold">New Category</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} className="px-2 py-1">
                <Text className="text-muted-foreground font-bold">Cancel</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Enter category name"
              placeholderTextColor="#999"
              className="bg-secondary/10 p-5 rounded-md mb-8 text-lg font-medium"
              value={categoryName}
              onChangeText={setCategoryName}
              autoFocus
            />

            <Text className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Select Color</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-10">
              <View className="flex-row gap-3">
                {TAILWIND_500_COLORS.map(c => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setCategoryColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-10 h-10 rounded-md ${categoryColor === c ? 'border-4 border-white' : ''}`}
                  />
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity
              onPress={handleCreateCategory}
              className="bg-primary py-4 rounded-md items-center"
            >
              <Text className="text-primary-foreground font-bold text-lg">Create Category</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export const CategoryPicker = withObservables([], () => ({
  categories: database.collections.get<Category>('categories').query(),
}))(CategoryPickerComponent);
