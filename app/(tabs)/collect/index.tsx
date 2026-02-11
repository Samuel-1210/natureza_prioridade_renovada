import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Divider, Select } from "heroui-native";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDebounce } from "use-debounce";
import { CollectPointCard } from "../../../components/collectPointCard";
import { indexCollect, indexCollectImage } from "../../../hooks/useCollect";
import { StatusBar } from "expo-status-bar";

type CollectPoint = {
  id: number;
  name: string;
  category: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  description?: string;
  principal_image: string;
  images?: string[];
};

const collectPointsMock: CollectPoint[] = [
  {
    id: 1,
    name: "Coletando",
    category: "Reciclagem",
    address: "Rua das Flores, 123",
    city: "São Paulo",
    state: "SP",
    zip_code: "01010-000",
    description: "Aceita papel, plástico e metal",
    principal_image: "https://picsum.photos/200/300",
    images: ["https://picsum.photos/200/300", "https://picsum.photos/200/300"],
  },
  {
    id: 2,
    name: "Reciclando",
    category: "Eletrônicos",
    address: "Av. Central, 456",
    city: "Rio de Janeiro",
    state: "RJ",
    zip_code: "20020-000",
    description: "Descarte de eletrônicos e baterias",
    principal_image: "https://picsum.photos/200/300",
  },
  {
    id: 3,
    name: "Cuidando",
    category: "Vidro",
    address: "Rua Verde, 789",
    city: "Belo Horizonte",
    state: "MG",
    zip_code: "30130-010",
    description: "Somente vidro limpo",
    principal_image: "https://picsum.photos/200/300",
    images: ["https://picsum.photos/200/300"],
  },
  {
    id: 4,
    name: "Ponto de Coleta 3",
    category: "Vidro",
    address: "Rua Verde, 789",
    city: "Belo Horizonte",
    state: "MG",
    zip_code: "30130-010",
    description: "Somente vidro limpo",
    principal_image: "https://picsum.photos/200/300",
    images: ["https://picsum.photos/200/300"],
  },
  {
    id: 5,
    name: "Ponto de Coleta 3",
    category: "Vidro",
    address: "Rua Verde, 789",
    city: "Belo Horizonte",
    state: "MG",
    zip_code: "30130-010",
    description: "Somente vidro limpo",
    principal_image: "https://picsum.photos/200/300",
    images: ["https://picsum.photos/200/300"],
  },
];

const categoriesMock = [
  {
    id: 1,
    name: "Papel",
    icon: "document-outline" as const,
  },
  {
    id: 2,
    name: "Plástico",
    icon: "bag-outline" as const,
  },
  {
    id: 3,
    name: "Metal",
    icon: "trash-outline" as const,
  },
  {
    id: 4,
    name: "Vidro",
    icon: "wine-outline" as const,
  },
  {
    id: 5,
    name: "Eletrônicos",
    icon: "desktop-outline" as const,
  },
  {
    id: 6,
    name: "Baterias",
    icon: "battery-dead-outline" as const,
  },
];

export default function Collect() {
  const { control, watch } = useForm({
    defaultValues: {
      search: "",
    },
  });
  const search = watch("search") || "";
  const insets = useSafeAreaInsets();
  const { data, isLoading, error } = indexCollect();
  const { data: image } = indexCollectImage(data?.data[0].principal_image);
  console.log(image);
  const [debouncedSearch] = useDebounce(search, 500);

  const filteredCollectPoints = data?.data?.filter((point: CollectPoint) =>
    point.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  useEffect(() => {
    console.log(search);
  }, [search]);

  return (
    <View className="flex-1 bg-white " style={{ paddingTop: insets.top }}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />

      <View className="flex flex-row items-center gap-2 mx-4">
        <Ionicons
          name="navigate-outline"
          size={24}
          color="green"
          className="bg-green-300/30 rounded-full p-1"
        />
        <View className="flex flex-row items-center justify-between w-full pr-8">
          <View className="flex flex-col ">
            <Text className="font-riot text-gray-800">LOCALIZAÇÃO ATUAL</Text>
            <Select>
              <Select.Trigger className="flex flex-row items-center gap-2">
                <Select.Value
                  className="font-riot text-green-600"
                  placeholder="Selecione sua localização"
                />
                <Ionicons name="chevron-down" size={16} color="gray" />
              </Select.Trigger>
              <Select.Portal>
                <Select.Overlay />
                <Select.Content
                  presentation="popover"
                  placement="bottom"
                  align="start"
                  className="w-full"
                >
                  <Select.Item value="sp" label="São Paulo" />
                  <Select.Item value="rj" label="Rio de Janeiro" />
                  <Select.Item value="mg" label="Minas Gerais" />
                </Select.Content>
              </Select.Portal>
            </Select>
          </View>
          <TouchableOpacity
            className="flex flex-row items-center rounded-full p-1 bg-green-300/30"
            activeOpacity={0.7}
            onPress={() => router.push("/collect/new")}
          >
            <Ionicons name="add-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="mx-4">
        <Divider className="w-full  bg-green-300/30 my-2  " />
        <Controller
          control={control}
          name="search"
          render={({ field: { onChange, value } }) => (
            <View className="flex-row items-center bg-green-200/10 rounded-full px-4  h-12">
              <Ionicons name="search-outline" size={20} color="green" />
              <TextInput
                placeholder="Buscar ponto de coleta"
                value={value}
                onChangeText={onChange}
                className="flex-1 ml-2 font-riot text-gray-800"
                placeholderTextColor="#9CA3AF"
              />
              {value?.length > 0 && (
                <Ionicons
                  name="close-circle"
                  size={20}
                  color="green"
                  onPress={() => onChange("")}
                />
              )}
            </View>
          )}
        />
      </View>
      <Text className=" mt-2 mx-6  font-riot  text-green-700">CATEGORIAS</Text>
      <ScrollView
        className="mt-2 flex-row gap-x-3 ml-4 pb-8 max-h-22 mb-1"
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        {categoriesMock.map((category) => (
          <View key={category.id} className="items-center mr-4 gap-2">
            <View className="rounded-full bg-white items-center justify-center w-16 h-16 border border-gray-100 ">
              <Ionicons name={category.icon} size={24} color="green" />
              <Text className="font-riot text-center text-gray-500 text-[10px]">
                {category.name}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <Divider className="w-full  bg-green-300/20 " />
      <FlatList<CollectPoint>
        data={filteredCollectPoints}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        className="py-2 px-2 bg-green-100/20 rounded-t-[20px] "
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ gap: 8 }}
        contentContainerStyle={{ gap: 8, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View className="flex-1">
            <TouchableOpacity
              onPress={() => {
                console.log(item);
              }}
              className=""
              activeOpacity={0.8}
            >
              <CollectPointCard
                name={item.name}
                zipCode={item.address}
                description={item.description}
                principalImage={"https://picsum.photos/200/300"}
                category={item.category}
              />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
