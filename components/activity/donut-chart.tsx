import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

type DataItem = {
  name: string;
  value: number;
  color: string;
};

type DonutChartProps = {
  data: DataItem[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
  centerSubValue?: string;
};

export function DonutChart({
  data,
  size = 240,
  strokeWidth = 24,
  centerLabel,
  centerValue,
  centerSubValue,
}: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((acc, item) => acc + item.value, 0);

  let currentAngle = -90; // Start from top

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <G rotation={currentAngle} origin={`${size / 2}, ${size / 2}`}>
          {/* Background Track - Theme Sync */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f0e9d9"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {total > 0 && data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const strokeDasharray = circumference;
            // Add a small gap between segments by reducing strokeDashoffset slightly
            const gap = 2;
            const strokeDashoffset = circumference - (percentage / 100) * circumference + gap;

            const rotate = (data.slice(0, index).reduce((acc, i) => acc + i.value, 0) / total) * 360;

            return (
              <Circle
                key={item.name}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                transform={`rotate(${rotate}, ${size / 2}, ${size / 2})`}
              />
            );
          })}
        </G>
      </Svg>
      <View className="absolute items-center justify-center">
        {centerLabel && (
          <Text className="text-muted-foreground text-sm font-medium mb-1">
            {centerLabel}
          </Text>
        )}
        {centerValue && (
          <Text className="text-4xl font-bold text-foreground">
            {centerValue}
          </Text>
        )}
        {centerSubValue && (
          <View className="flex-row items-center mt-1">
            <Text className="text-muted-foreground text-sm font-medium">
              {centerSubValue}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
