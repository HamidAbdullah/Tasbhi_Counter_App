import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenWrapper from '../../components/ScreenWrapper';
import { useTheme } from '../../contexts/ThemeContext';
import { Bluetooth, Devices, BluetoothConnected, ChartBar, CaretRight } from 'phosphor-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { DigitalStackParamList } from '../../types';
import Card from '../../components/ui/Card';

const { width } = Dimensions.get('window');

type DigitalTasbeehNavProp = StackNavigationProp<DigitalStackParamList, 'Tasbeeh'>;

const DigitalTasbeehScreen: React.FC = () => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<DigitalTasbeehNavProp>();

    return (
        <ScreenWrapper withPadding={false}>
            <ScrollView
                style={[styles.scrollView, { backgroundColor: theme.colors.background }]}
                contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: 100 }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.colors.text }]}>Tasbeeh</Text>
                    <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                        Your progress and digital connection
                    </Text>
                </View>

                {/* Dashboard entry - consistent card design */}
                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate('Dashboard')}
                    style={styles.dashboardCardWrap}
                >
                    <Card variant="elevated" padding="medium" style={[styles.dashboardCard, { backgroundColor: theme.colors.surface }]}>
                        <LinearGradient
                            colors={[`${theme.colors.primary}18`, `${theme.colors.secondary}08`]}
                            style={[styles.dashboardCardInner, { borderRadius: theme.borderRadius.lg }]}
                        >
                            <View style={[styles.dashboardIconWrap, { backgroundColor: `${theme.colors.primary}20` }]}>
                                <ChartBar size={28} color={theme.colors.primary} weight="duotone" />
                            </View>
                            <View style={styles.dashboardTextWrap}>
                                <Text style={[styles.dashboardTitle, { color: theme.colors.text }]}>Dashboard</Text>
                                <Text style={[styles.dashboardSubtitle, { color: theme.colors.textSecondary }]}>
                                    View stats, daily goal & streaks
                                </Text>
                            </View>
                            <CaretRight size={22} color={theme.colors.textTertiary} weight="bold" />
                        </LinearGradient>
                    </Card>
                </TouchableOpacity>

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
                        <View style={[styles.infoIcon, { backgroundColor: `${theme.colors.primary}18` }]}>
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
                        <View style={[styles.infoIcon, { backgroundColor: `${theme.colors.accent}20` }]}>
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
                    onPress={() => {}}
                >
                    <Text style={styles.connectButtonText}>Scan for Devices</Text>
                </TouchableOpacity>
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 26,
        fontFamily: 'Poppins-Bold',
    },
    subtitle: {
        fontSize: 15,
        fontFamily: 'Poppins-Regular',
        marginTop: 4,
    },
    dashboardCardWrap: {
        marginBottom: 24,
    },
    dashboardCard: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    dashboardCardInner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    dashboardIconWrap: {
        width: 52,
        height: 52,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    dashboardTextWrap: {
        flex: 1,
    },
    dashboardTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
    },
    dashboardSubtitle: {
        fontSize: 13,
        fontFamily: 'Poppins-Regular',
        marginTop: 2,
    },
    connectionArea: {
        alignItems: 'center',
        marginVertical: 32,
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
