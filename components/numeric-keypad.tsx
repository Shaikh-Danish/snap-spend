import { Delete } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

type NumericKeypadProps = {
  onPress: (val: string) => void;
  onDelete: () => void;
};

const KeypadButton = ({ label, icon: Icon, onPress }: any) => (
  <Pressable 
    onPress={onPress}
    style={{ height: 60 }}
    className="flex-1 items-center justify-center rounded-md mx-0.5 bg-secondary/15 active:bg-secondary/30"
  >
    {Icon ? <Icon size={22} color="#000" /> : <Text className="text-xl font-bold text-foreground">{label}</Text>}
  </Pressable>
);

export const NumericKeypad = ({ onPress, onDelete }: NumericKeypadProps) => (
  <View className="px-6 gap-2">
    <View className="flex-row gap-2">
      <KeypadButton label="1" onPress={() => onPress('1')} />
      <KeypadButton label="2" onPress={() => onPress('2')} />
      <KeypadButton label="3" onPress={() => onPress('3')} />
    </View>
    <View className="flex-row gap-2">
      <KeypadButton label="4" onPress={() => onPress('4')} />
      <KeypadButton label="5" onPress={() => onPress('5')} />
      <KeypadButton label="6" onPress={() => onPress('6')} />
    </View>
    <View className="flex-row gap-2">
      <KeypadButton label="7" onPress={() => onPress('7')} />
      <KeypadButton label="8" onPress={() => onPress('8')} />
      <KeypadButton label="9" onPress={() => onPress('9')} />
    </View>
    <View className="flex-row gap-2">
      <KeypadButton label="." onPress={() => onPress('.')} />
      <KeypadButton label="0" onPress={() => onPress('0')} />
      <KeypadButton icon={Delete} onPress={onDelete} />
    </View>
  </View>
);
