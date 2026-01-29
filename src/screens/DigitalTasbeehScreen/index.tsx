import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Bluetooth, Devices, WifiHigh, CircleNotch, BluetoothConnected } from 'phosphor-react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const DigitalTasbeehScreen: React.FC = () => {
    const { theme } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.colors.text }]}>Digital Connection</Text>
                    <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                        Connect your smart tasbeeh ring or device
                    </Text>
                </View>

                <View style={styles.connectionArea}>
                    <View style={[styles.pulseContainer, { borderColor: `${theme.colors.primary}30` }]}>
                        <LinearGradient
                            colors={[`${theme.colors.primary}40`, `${theme.colors.secondary}10`]}
                            style={styles.pulseCircle}
                        >
                            <BluetoothConnected size={60} color={theme.colors.primary} weight="duotone" />
                        </LinearGradient>
                    </View>
                    <Text style={[styles.statusText, { color: theme.colors.primary }]}>Searching for devices...</Text>
                </View>

                <View style={styles.infoSection}>
                    <View style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
                        <View style={styles.infoIcon}>
                            <Bluetooth size={24} color={theme.colors.primary} />
                        </View>
                        <View>
                            <Text style={[styles.infoTitle, { color: theme.colors.text }]}>Bluetooth Required</Text>
                            <Text style={[styles.infoDesc, { color: theme.colors.textSecondary }]}>
                                Ensure your device bluetooth is turned on.
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
                        <View style={styles.infoIcon}>
                            <Devices size={24} color={theme.colors.accent} />
                        </View>
                        <View>
                            <Text style={[styles.infoTitle, { color: theme.colors.text }]}>Supported Devices</Text>
                            <Text style={[styles.infoDesc, { color: theme.colors.textSecondary }]}>
                                Zikr Ring, iQibla, and other smart tasbeehs.
                            </Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.connectButton, { backgroundColor: theme.colors.primary }]}
                    activeOpacity={0.8}
                >
                    <Text style={styles.connectButtonText}>Scan for Devices</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'space-between',
    },
    header: {
        marginTop: 20,
    },
    title: {
        fontSize: 28,
        fontFamily: 'Poppins-Bold',
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        marginTop: 5,
    },
    connectionArea: {
        alignItems: 'center',
        marginVertical: 40,
    },
    pulseContainer: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    pulseCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusText: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
    },
    infoSection: {
        gap: 15,
    },
    infoCard: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        gap: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    infoIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
    },
    infoDesc: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
    },
    connectButton: {
        height: 60,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    connectButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontFamily: 'Poppins-Bold',
    },
});

export default DigitalTasbeehScreen;
