import { Brain, Cpu, Download, ShieldCheck } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface ModelLoaderProps {
  onDownload: () => void;
  isDownloading: boolean;
  progress: number;
  size: string;
  name: string;
  description: string;
}

export function ModelLoader({
  onDownload,
  isDownloading,
  progress,
  size,
  name,
  description,
}: ModelLoaderProps) {
  const pct = Math.round(progress * 100);

  if (isDownloading) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-8 gap-6">
        <View className="w-16 h-16 items-center justify-center bg-primary/10 rounded-md border border-primary/20">
          <Download size={32} className="text-primary" />
        </View>
        <View className="items-center gap-1">
          <Text className="text-xl font-bold text-foreground">
            Downloading {name}
          </Text>
          <Text className="text-sm text-muted-foreground text-center">
            {description}
          </Text>
        </View>

        <View className="w-full gap-3 mt-4">
          <View className="flex-row justify-between items-end">
            <Text className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Retrieving Weights
            </Text>
            <Text className="text-sm font-bold text-primary">{pct}%</Text>
          </View>
          <View className="w-full h-2 bg-muted rounded-md overflow-hidden">
            <View className="h-full bg-primary" style={{ width: `${pct}%` }} />
          </View>
          <Text className="text-[10px] text-muted-foreground/60 text-center uppercase tracking-tighter">
            Total Size: ~{size} • High-Speed Transfer Required
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background px-8 pt-14 pb-10 justify-between">
      <View className="items-center">
        {/* Top Section */}
        <View className="items-center gap-3 mb-4">
          <View className="w-16 h-16 items-center justify-center bg-card rounded-md border border-border shadow-sm">
            <Brain size={32} className="text-primary" strokeWidth={1.5} />
          </View>
          <View className="items-center gap-0.5">
            <Text className="text-2xl font-black text-foreground text-center tracking-tighter uppercase">
              {name}
            </Text>
            <Text className="text-[13px] text-muted-foreground text-center leading-5 px-4 font-medium opacity-80">
              {description}
            </Text>
          </View>
        </View>

        {/* Feature Cards */}
        <View className="w-full flex-row gap-3 mt-4">
          <View className="flex-1 bg-card p-4 rounded-md border border-border items-start gap-1.5 shadow-xs">
            <Cpu size={16} className="text-primary" strokeWidth={2.5} />
            <View>
              <Text className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Engine</Text>
              <Text className="text-[11px] font-bold text-foreground">{name}</Text>
            </View>
          </View>
          <View className="flex-1 bg-card p-4 rounded-md border border-border items-start gap-1.5 shadow-xs">
            <ShieldCheck size={16} className="text-primary" strokeWidth={2.5} />
            <View>
              <Text className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Security</Text>
              <Text className="text-[11px] font-bold text-foreground">100% Local</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Section */}
      <View className="w-full gap-4">
        <Pressable
          onPress={onDownload}
          className="bg-primary h-14 rounded-md items-center justify-center shadow-lg shadow-primary/20 active:opacity-95"
        >
          <View className="flex-row items-center gap-3">
            <Download
              size={18}
              className="text-primary-foreground"
              strokeWidth={3}
            />
            <Text className="text-primary-foreground font-bold text-base uppercase tracking-tight">
              Activate Engine ({size})
            </Text>
          </View>
        </Pressable>
        <Text className="text-[10px] text-muted-foreground text-center uppercase font-black tracking-[0.1em] opacity-40">
          Secure Wi-Fi Connection Recommended
        </Text>
      </View>
    </View>
  );
}
