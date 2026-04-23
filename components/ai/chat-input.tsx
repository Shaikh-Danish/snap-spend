import { ArrowUp, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function ChatInput({ onSend }: { onSend: (text: string) => void }) {
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
      className="px-6 pt-3 bg-background border-t border-border/5 shadow-2xl shadow-black/5"
      style={{ paddingBottom: Math.max(insets.bottom, 16) }}
    >
      <View className="flex-row items-center gap-3">
        <Pressable className="w-12 h-12 items-center justify-center bg-muted/30 rounded-full active:scale-95 transition-all">
          <Plus size={24} className="text-foreground" strokeWidth={2.5} />
        </Pressable>

        <View className="flex-1 flex-row items-center bg-muted/20 border border-border/10 rounded-[28px] px-5 py-1.5 min-h-[52px]">
          <TextInput
            placeholder="Ask Anything"
            placeholderTextColor="#A6A095"
            className="flex-1 text-foreground text-[16px] py-1"
            value={text}
            onChangeText={setText}
            multiline
          />

          <Pressable
            onPress={handleSend}
            disabled={!text.trim()}
            className={`w-9 h-9 items-center justify-center rounded-full ml-1 active:scale-90 transition-all ${text.trim() ? 'bg-foreground' : 'bg-muted/40'
              }`}
          >
            <ArrowUp size={20} className={text.trim() ? 'text-background' : 'text-muted-foreground'} strokeWidth={3} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
