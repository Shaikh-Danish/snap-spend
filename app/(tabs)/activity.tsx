import { Link } from 'expo-router';
import { View, Text } from 'react-native';

export default function Spends() {
    return (
        <View>
            <Text>Spends</Text>
            <Link href="/" style={{ color: 'blue' }}>Go to Home</Link>
        </View>
    );
}