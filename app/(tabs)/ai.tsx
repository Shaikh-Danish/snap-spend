import { Link } from 'expo-router';
import { View, Text } from 'react-native';

export default function AI() {
    return (
        <View>
            <Text>AI</Text>
            <Link href="/" style={{ color: 'blue' }}>Go to Home</Link>
        </View>
    );
}