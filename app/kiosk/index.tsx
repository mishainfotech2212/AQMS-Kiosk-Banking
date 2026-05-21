import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { KioskHeader } from '@/components/kiosk/KioskHeader';
import { Stepper } from '@/components/kiosk/Stepper';
import { StepBranch } from '@/components/kiosk/steps/StepBranch';
import { StepCustomer } from '@/components/kiosk/steps/StepCustomer';
import { StepLanguage } from '@/components/kiosk/steps/StepLanguage';
import { StepService } from '@/components/kiosk/steps/StepService';
import { StepSuccess } from '@/components/kiosk/steps/StepSuccess';
import { StepSummary } from '@/components/kiosk/steps/StepSummary';
import { StepTicketType } from '@/components/kiosk/steps/StepTicketType';
import { StepWelcome } from '@/components/kiosk/steps/StepWelcome';
import { KioskColors } from '@/constants/kiosk-theme';
import { KioskProvider, useKiosk } from '@/context/kiosk-context';

function KioskScreens() {
  const { step } = useKiosk();
  const showStepper = step >= 1 && step <= 7;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <KioskHeader />
      {showStepper ? <Stepper current={step} /> : null}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {step === 1 && <StepWelcome />}
          {step === 2 && <StepBranch />}
          {step === 3 && <StepLanguage />}
          {step === 4 && <StepService />}
          {step === 5 && <StepTicketType />}
          {step === 6 && <StepCustomer />}
          {step === 7 && <StepSummary />}
          {step === 8 && <StepSuccess />}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

export default function KioskScreen() {
  return (
    <KioskProvider>
      <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
        <KioskScreens />
      </SafeAreaView>
    </KioskProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: KioskColors.paleBg,
  },
  root: {
    flex: 1,
    backgroundColor: KioskColors.paleBg,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
});
