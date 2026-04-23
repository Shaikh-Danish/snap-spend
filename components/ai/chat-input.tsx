import { Plus, ArrowUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, TextInput, View, KeyboardAvoidingView, Platform } from 'react-native';

export function ChatInput({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <View className="px-6 py-4 bg-background">
      <View className="flex-row items-center gap-3">
        <Pressable className="w-11 h-11 items-center justify-center bg-muted/40 rounded-full active:scale-90 transition-transform">
          <Plus size={20} className="text-foreground" strokeWidth={2.5} />
        </Pressable>
        
        <View className="flex-1 flex-row items-center bg-muted/20 border border-border/40 rounded-[24px] px-4 py-2 min-h-[48px]">
          <TextInput
            placeholder="Ask Anything"
            placeholderTextColor="#A6A095"
            className="flex-1 text-foreground text-[16px] py-1"
            value={text}
            onChangeText={setText}
            multiline
          />
          
          {text.length > 0 && (
            <Pressable 
              onPress={handleSend}
              className="bg-foreground w-8 h-8 items-center justify-center rounded-full ml-2 active:opacity-80"
            >
              <ArrowUp size={18} className="text-background" strokeWidth={3} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
