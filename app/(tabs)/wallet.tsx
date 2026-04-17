import { Link } from 'expo-router';
import { View, Text } from 'react-native';

export default function Wallet() {
    return (
        <View>
            <Text>Wallet</Text>
            <Link href="/" style={{ color: 'blue' }}>Go to Home</Link>
        </View>
    );
}