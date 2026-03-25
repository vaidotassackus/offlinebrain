import NetInfo from '@react-native-community/netinfo';
import { useNetworkStore } from '../store/useNetworkStore';

export function subscribeToNetworkChanges(): () => void {
  const unsubscribe = NetInfo.addEventListener((state) => {
    const isOnline = state.isConnected === true && state.isInternetReachable !== false;
    useNetworkStore.getState().setOnline(isOnline);
  });
  return unsubscribe;
}
