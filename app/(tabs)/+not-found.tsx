import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function AI() {
    return (
        <View>
            <Text>AI</Text>
            <Link href="/" style={{ color: 'blue' }}>Go to Home</Link>
        </View>
    );
}