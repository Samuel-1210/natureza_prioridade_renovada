import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CollectPointFormData } from "../../api/collect";
import { useCollect } from "../../hooks/useCollect";

const categories = [
  "Reciclagem",
  "Eletrônicos",
  "Vidro",
  "Papel",
  "Plástico",
  "Metal",
  "Baterias",
];

export default function NewCollectPoint() {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CollectPointFormData>({
    defaultValues: {
      name: "",
      category: "",
      zip_code: "",
      address: "",
      city: "",
      state: "",
      description: "",
      principal_image: "",
      images: [],
    },
  });

  const insets = useSafeAreaInsets();
  const { mutate } = useCollect();

  const handleSelectPrincipalImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted")
      return Alert.alert("Ops", "Precisamos de permissão para fotos.");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.7,
      aspect: [3, 3],
    });

    if (!result.canceled) {
      setValue("principal_image", result.assets[0].uri);
    }
  };

  const handleAddImages = async (
    currentImages: string[],
    onChange: (imgs: string[]) => void,
  ) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted")
      return Alert.alert("Ops", "Precisamos de permissão para fotos.");

    const remainingSlots = 5 - currentImages.length;
    if (remainingSlots <= 0) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      allowsMultipleSelection: true,
      selectionLimit: remainingSlots,
      quality: 0.7,
    });

    if (!result.canceled) {
      const newUris = result.assets.map((asset) => asset.uri);
      onChange([...currentImages, ...newUris]);
    }
  };

  const onSubmit = (data: CollectPointFormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("category", data.category);
      formData.append("address", data.address);
      formData.append("city", data.city);
      formData.append("state", data.state);
      formData.append("zip_code", data.zip_code);
      formData.append("description", data.description);

      if (data.principal_image) {
        const uri = data.principal_image;
        const filename = uri.split("/").pop();
        const type = "image/jpeg";
        formData.append("principal_image", {
          uri,
          type,
          name: filename,
        } as any);
      }

      if (data.images && data.images.length > 0) {
        data.images.forEach((uri, index) => {
          const filename = uri.split("/").pop();
          const type = "image/jpeg";
          formData.append(`images[${index}]`, {
            uri,
            type,
            name: filename,
          } as any);
        });
      }

      mutate(formData as any, {
        onSuccess: () => {
          Alert.alert("Sucesso", "Ponto criado com sucesso!");
          router.back();
        },
        onError: (error) => {
          console.error("Erro ao enviar:", error.cause);

          Alert.alert("Erro", "Erro ao salvar os dados.");
        },
      });
    } catch (error) {
      console.error("Erro ao processar formulário:", error);
      Alert.alert("Erro", "Erro ao salvar os dados.");
    }
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-green-500 text-base">Cancelar</Text>
        </TouchableOpacity>
        <Text className="text-lg text-green-600 font-riot">Novo Ponto</Text>
        <TouchableOpacity onPress={handleSubmit(onSubmit)}>
          <Text className="text-green-500 text-base font-semibold">Salvar</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView
        className="bg-white"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={50}
        alwaysBounceVertical={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="p-4 space-y-4">
          <View className="items-center mb-4">
            <TouchableOpacity
              onPress={handleSelectPrincipalImage}
              className="items-center"
            >
              <View className="w-32 h-32 rounded-lg bg-gray-200 overflow-hidden items-center justify-center border border-gray-300">
                {watch("principal_image") ? (
                  <Image
                    source={{ uri: watch("principal_image") }}
                    className="w-full h-full"
                  />
                ) : (
                  <Text className="text-gray-400">Selecionar</Text>
                )}
              </View>
              <Text className="text-blue-500 mt-2 font-medium">
                {watch("principal_image") ? "Alterar Foto" : "Adicionar Foto"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Name */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2">Nome do Ponto</Text>
            <Controller
              control={control}
              name="name"
              rules={{ required: "Nome é obrigatório" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3"
                  placeholder="Ex: Ecoponto Central"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.name && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.name.message}
              </Text>
            )}
          </View>

          {/* Category */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2">Categoria</Text>
            <Controller
              control={control}
              name="category"
              rules={{ required: "Selecione uma categoria" }}
              render={({ field: { onChange, value } }) => (
                <View className="flex-row flex-wrap gap-2">
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => onChange(cat)} // Atualiza o form
                      className={`px-4 py-2 rounded-full border ${
                        value === cat
                          ? "bg-green-100 border-green-500"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <Text
                        className={
                          value === cat
                            ? "text-green-700 font-medium"
                            : "text-gray-600"
                        }
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
            {errors.category && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.category.message}
              </Text>
            )}
          </View>

          {/* CEP */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2">CEP</Text>
            <Controller
              control={control}
              name="zip_code"
              rules={{ required: "CEP é obrigatório" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3"
                  placeholder="00000-000"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="numeric"
                />
              )}
            />
            {errors.zip_code && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.zip_code.message}
              </Text>
            )}
          </View>

          {/* Address Row */}
          <View className="flex-row gap-2 mb-4">
            <View className="flex-1">
              <Text className="text-sm font-medium mb-2">Cidade</Text>
              <Controller
                control={control}
                name="city"
                rules={{ required: "Cidade é obrigatória" }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3"
                    placeholder="São Paulo"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.city && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.city.message}
                </Text>
              )}
            </View>

            <View className="w-20">
              <Text className="text-sm font-medium mb-2">UF</Text>
              <Controller
                control={control}
                name="state"
                rules={{ required: "UF é obrigatório" }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3"
                    placeholder="SP"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    maxLength={2}
                  />
                )}
              />
              {errors.state && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.state.message}
                </Text>
              )}
            </View>
          </View>

          {/* Address */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2">Endereço</Text>
            <Controller
              control={control}
              name="address"
              rules={{ required: "Endereço é obrigatório" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3"
                  placeholder="Rua, número, complemento"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.address && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.address.message}
              </Text>
            )}
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2">Descrição</Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3"
                  placeholder="Descreva o ponto de coleta..."
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              )}
            />
          </View>

          {/* Images */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2">Imagens</Text>
            <Controller
              control={control}
              name="images"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row flex-wrap gap-2">
                  {(value || []).map((uri, index) => (
                    <View key={index} className="relative">
                      <Image
                        source={{ uri }}
                        className="w-24 h-24 rounded-lg"
                      />
                      <TouchableOpacity
                        onPress={() => {
                          const newImages = (value || []).filter(
                            (_, i) => i !== index,
                          );
                          onChange(newImages);
                        }}
                        className="absolute top-1 right-1 bg-red-500 rounded-full  h-5 w-5 items-center justify-center"
                      >
                        <Text className="text-white text-xs">X</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                  {(value || []).length < 5 && (
                    <TouchableOpacity
                      onPress={() => handleAddImages(value || [], onChange)}
                      className="w-24 h-24 rounded-lg bg-gray-200 items-center justify-center border border-gray-300"
                    >
                      <Text className="text-gray-400">+</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
