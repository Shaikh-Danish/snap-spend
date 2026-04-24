import { ArrowUp, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function ChatInput({
  onSend,
  disabled = false,
}: {
  onSend: (text: string) => void | Promise<void>;
  disabled?: boolean;
}) {
  const [text, setText] = useState('');
  const insets = useSafeAreaInsets();

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <View
      className="px-6 pt-3 bg-background border-t border-border mt-auto"
      style={{ paddingBottom: Math.max(insets.bottom, 16) }}
    >
      <View className="flex-row items-center gap-3">
        <Pressable
          disabled={disabled}
          className={`w-12 h-12 items-center justify-center bg-card rounded-md border border-border shadow-sm active:opacity-80 ${
            disabled ? 'opacity-50' : ''
          }`}
        >
          <Plus size={20} className="text-primary" strokeWidth={2.5} />
        </Pressable>

        <View className="flex-1 flex-row items-center bg-card border border-border rounded-md px-4 py-1.5 min-h-[52px] shadow-sm">
          <TextInput
            placeholder="Ask AI Assistant..."
            placeholderTextColor="#A6A095"
            className={`flex-1 text-foreground text-[16px] py-1 ${
              disabled ? 'opacity-50' : ''
            }`}
            value={text}
            onChangeText={setText}
            multiline
            editable={!disabled}
          />

          <Pressable
            onPress={handleSend}
            disabled={disabled || !text.trim()}
            className={`w-9 h-9 items-center justify-center rounded-md ml-1 active:scale-95 transition-all ${
              text.trim() && !disabled ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <ArrowUp
              size={18}
              className={
                text.trim() && !disabled
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground'
              }
              strokeWidth={3}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
