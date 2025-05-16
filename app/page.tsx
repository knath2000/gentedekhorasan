import { Redirect } from "expo-router";

export default function Index() {
  // Redirect to the (tabs) group, which will default to the 'index' screen (HomeScreen)
  return <Redirect href="/(tabs)" />;
}
