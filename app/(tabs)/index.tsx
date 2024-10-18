import { Link } from "expo-router";
import { Text, SafeAreaView, Pressable } from "react-native";

export default function Index() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link
        // will pass the fetched cafe data like this to prevent multiple fetches
        href={{
          pathname: "/cafe",
          params: {
            id: 1,
            name: "Cafe Oshima's",
            address:
              "2/37 Cao Thang, Ward 5, District 3, Ho Chi Minh City, Vietnam",
            topTags: [
              "🍵 Matcha",
              "🛜 Free Wifi",
              "🌱 Vegan",
              "🌳 Outdoor",
              "🐶 Pet Friendly",
              "🏠 Indoor",
              "🚗 Parking",
            ],
            hours: `8:00AM - 10:00PM Monday
                    8:00AM - 10:00PM Tuesday
                    8:00AM - 10:00PM Wednesday
                    8:00AM - 10:00PM Thursday
                    8:00AM - 10:00PM Friday
                    8:00AM - 10:00PM Saturday
                    8:00AM - 10:00PM Sunday`,
          },
        }}
        asChild
      >
        <Pressable>
          <Text>Open cafe view</Text>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
}
