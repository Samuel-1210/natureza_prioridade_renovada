import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo, useRef, useState } from "react";
import { Controller, FieldPath, useForm } from "react-hook-form";
import {
  Alert,
  Image,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardStickyView,
  type KeyboardAwareScrollViewRef,
} from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { lookupCep } from "../../api/cep";
import { CollectPointFormData } from "../../api/collect";
import { useCollect } from "../../hooks/useCollect";

const categories = [
  "Reciclagem",
  "Eletronicos",
  "Vidro",
  "Papel",
  "Plastico",
  "Metal",
  "Baterias",
];

const steps = [
  {
    title: "Dados do ponto",
    subtitle: "Foto principal, nome e categoria.",
  },
  {
    title: "Localizacao",
    subtitle: "CEP com preenchimento automatico e endereco.",
  },
  {
    title: "Detalhes",
    subtitle: "Descricao e imagens adicionais.",
  },
  {
    title: "Revisao",
    subtitle: "Confirme os dados antes de salvar.",
  },
];

const stepValidationFields: FieldPath<CollectPointFormData>[][] = [
  ["principal_image", "name", "category"],
  ["zip_code", "address", "city", "state"],
  [],
  [],
];

const normalizeZipCode = (value: string) => value.replace(/\D/g, "").slice(0, 8);

const formatZipCode = (value: string) => {
  const digits = normalizeZipCode(value);

  if (digits.length <= 5) {
    return digits;
  }

  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

type ZipLookupState = "idle" | "loading" | "success" | "error";

const ACTION_BUTTON_HEIGHT = 48;
const ACTION_BAR_TOP_PADDING = 12;
const ACTION_BAR_SIDE_PADDING = 16;
const MIN_ACTION_BAR_BOTTOM_PADDING = 12;
const INPUT_CLEARANCE = 36;
const EXTRA_KEYBOARD_SPACE = 40;

type ReviewRowProps = {
  label: string;
  value?: string;
};

function ReviewRow({ label, value }: ReviewRowProps) {
  return (
    <View className="flex-row items-center justify-between border-b border-emerald-50 py-3">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="text-sm font-semibold text-emerald-900">{value || "-"}</Text>
    </View>
  );
}

export default function NewCollectPoint() {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    trigger,
    getValues,
    formState: { errors, isDirty },
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
  const { mutate, isPending } = useCollect();

  const [currentStep, setCurrentStep] = useState(0);
  const [zipLookupState, setZipLookupState] = useState<ZipLookupState>("idle");
  const [zipLookupMessage, setZipLookupMessage] = useState("");

  const scrollRef = useRef<KeyboardAwareScrollViewRef>(null);
  const zipInputRef = useRef<TextInput>(null);
  const addressInputRef = useRef<TextInput>(null);
  const cityInputRef = useRef<TextInput>(null);
  const stateInputRef = useRef<TextInput>(null);
  const descriptionInputRef = useRef<TextInput>(null);

  const actionBarBottomPadding = Math.max(
    insets.bottom,
    MIN_ACTION_BAR_BOTTOM_PADDING,
  );
  const actionBarHeight =
    ACTION_BUTTON_HEIGHT + ACTION_BAR_TOP_PADDING + actionBarBottomPadding;
  const scrollBottomPadding = actionBarHeight + INPUT_CLEARANCE;

  const principalImage = watch("principal_image");
  const extraImages = watch("images") || [];

  const progress = useMemo(
    () => ((currentStep + 1) / steps.length) * 100,
    [currentStep],
  );

  const currentStepInfo = steps[currentStep];

  const ensureFocusedInputVisible = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.assureFocusedInputVisible();
    });
  };

  const handleAttemptClose = () => {
    if (!isDirty) {
      router.back();
      return;
    }

    Alert.alert(
      "Descartar alteracoes?",
      "Voce vai perder os dados preenchidos nesta tela.",
      [
        {
          text: "Continuar editando",
          style: "cancel",
        },
        {
          text: "Descartar",
          style: "destructive",
          onPress: () => router.back(),
        },
      ],
    );
  };

  const handleSelectPrincipalImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permissao", "Precisamos de permissao para acessar as fotos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
      aspect: [3, 3],
    });

    if (result.canceled) {
      return;
    }

    setValue("principal_image", result.assets[0].uri, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleAddImages = async (
    currentImages: string[],
    onChange: (images: string[]) => void,
  ) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permissao", "Precisamos de permissao para acessar as fotos.");
      return;
    }

    const remainingSlots = 5 - currentImages.length;

    if (remainingSlots <= 0) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      allowsMultipleSelection: true,
      selectionLimit: remainingSlots,
      quality: 0.8,
    });

    if (result.canceled) {
      return;
    }

    const newUris = result.assets.map((asset) => asset.uri);
    onChange([...currentImages, ...newUris]);
  };

  const handleLookupCep = async () => {
    const zipCode = normalizeZipCode(getValues("zip_code"));

    if (zipCode.length !== 8) {
      setZipLookupState("idle");
      setZipLookupMessage("");
      return;
    }

    setZipLookupState("loading");
    setZipLookupMessage("Buscando endereco pelo CEP...");

    try {
      const data = await lookupCep(zipCode);

      setValue("zip_code", formatZipCode(data.cep || zipCode), {
        shouldDirty: true,
        shouldValidate: true,
      });

      if (data.logradouro) {
        setValue("address", data.logradouro, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }

      if (data.localidade) {
        setValue("city", data.localidade, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }

      if (data.uf) {
        setValue("state", data.uf.toUpperCase().slice(0, 2), {
          shouldDirty: true,
          shouldValidate: true,
        });
      }

      setZipLookupState("success");
      setZipLookupMessage("Endereco preenchido com base no CEP.");
    } catch (error) {
      console.error("Falha no lookup de CEP:", error);
      setZipLookupState("error");
      setZipLookupMessage(
        error instanceof Error
          ? `${error.message} Preencha manualmente.`
          : "Nao foi possivel preencher automaticamente. Preencha manualmente.",
      );
    }
  };

  const validateCurrentStep = async () => {
    const fields = stepValidationFields[currentStep];

    if (!fields.length) {
      return true;
    }

    return trigger(fields, { shouldFocus: true });
  };

  const handleNextStep = async () => {
    const isStepValid = await validateCurrentStep();

    if (!isStepValid) {
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBackStep = () => {
    if (currentStep === 0) {
      handleAttemptClose();
      return;
    }

    setCurrentStep((prev) => Math.max(prev - 1, 0));
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
        const filename = uri.split("/").pop() || "principal.jpg";

        formData.append("principal_image", {
          uri,
          type: "image/jpeg",
          name: filename,
        } as never);
      }

      if (data.images && data.images.length > 0) {
        data.images.forEach((uri, index) => {
          const filename = uri.split("/").pop() || `image-${index}.jpg`;

          formData.append(`images[${index}]`, {
            uri,
            type: "image/jpeg",
            name: filename,
          } as never);
        });
      }

      mutate(formData as never, {
        onSuccess: () => {
          Alert.alert("Sucesso", "Ponto criado com sucesso!");
          router.back();
        },
        onError: (error) => {
          console.error("Erro ao enviar:", error);
          Alert.alert("Erro", "Nao foi possivel salvar os dados.");
        },
      });
    } catch (error) {
      console.error("Erro ao processar formulario:", error);
      Alert.alert("Erro", "Nao foi possivel salvar os dados.");
    }
  };

  const submitForm = handleSubmit(onSubmit);

  return (
    <View className="flex-1 bg-[#F5FAF6]" style={{ paddingTop: insets.top }}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <View className="border-b border-emerald-100 bg-white px-4 pb-4 pt-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={handleAttemptClose} activeOpacity={0.7}>
            <Text className="text-sm font-semibold text-emerald-600">Cancelar</Text>
          </TouchableOpacity>
          <Text className="text-xl text-emerald-700 font-riot">Novo Ponto</Text>
          <View className="w-16" />
        </View>

        <View className="mt-4">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
              Etapa {currentStep + 1} de {steps.length}
            </Text>
            <Text className="text-xs font-semibold text-emerald-700">
              {Math.round(progress)}%
            </Text>
          </View>
          <View className="h-2 overflow-hidden rounded-full bg-emerald-100">
            <View className="h-full rounded-full bg-emerald-500" style={{ width: `${progress}%` }} />
          </View>
          <Text className="mt-3 font-riot text-2xl text-emerald-800">
            {currentStepInfo.title}
          </Text>
          <Text className="mt-1 text-sm text-emerald-900/70">
            {currentStepInfo.subtitle}
          </Text>
        </View>
      </View>

      <KeyboardAwareScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          padding: 16,
          paddingBottom: scrollBottomPadding,
        }}
        keyboardShouldPersistTaps="handled"
        bottomOffset={actionBarHeight + INPUT_CLEARANCE}
        extraKeyboardSpace={EXTRA_KEYBOARD_SPACE}
      >
        <View className="gap-4">
          {currentStep === 0 && (
            <View className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm">
              <Text className="mb-4 text-xs font-semibold uppercase tracking-widest text-emerald-500">
                Foto principal
              </Text>

              <Controller
                control={control}
                name="principal_image"
                rules={{ required: "Foto principal e obrigatoria." }}
                render={({ field: { value } }) => (
                  <TouchableOpacity
                    onPress={handleSelectPrincipalImage}
                    className="items-center"
                    activeOpacity={0.8}
                  >
                    <View className="h-40 w-40 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50">
                      {value ? (
                        <Image source={{ uri: value }} className="h-full w-full" />
                      ) : (
                        <View className="items-center gap-2">
                          <Ionicons name="camera-outline" size={28} color="#059669" />
                          <Text className="text-sm font-medium text-emerald-700">
                            Adicionar foto
                          </Text>
                        </View>
                      )}
                    </View>
                    {value ? (
                      <Text className="mt-3 text-sm font-semibold text-emerald-600">
                        Alterar foto principal
                      </Text>
                    ) : null}
                  </TouchableOpacity>
                )}
              />
              {errors.principal_image ? (
                <Text className="mt-2 text-xs text-red-500">
                  {errors.principal_image.message}
                </Text>
              ) : null}

              <View className="mt-5">
                <Text className="mb-2 text-sm font-semibold text-gray-700">
                  Nome do ponto
                </Text>
                <Controller
                  control={control}
                  name="name"
                  rules={{ required: "Nome e obrigatorio." }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="h-12 rounded-xl border border-emerald-100 px-4 text-gray-900"
                      placeholder="Ex: Ecoponto Central"
                      placeholderTextColor="#9CA3AF"
                      onFocus={ensureFocusedInputVisible}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      returnKeyType="done"
                    />
                  )}
                />
                {errors.name ? (
                  <Text className="mt-2 text-xs text-red-500">{errors.name.message}</Text>
                ) : null}
              </View>

              <View className="mt-5">
                <Text className="mb-2 text-sm font-semibold text-gray-700">Categoria</Text>
                <Controller
                  control={control}
                  name="category"
                  rules={{ required: "Selecione uma categoria." }}
                  render={({ field: { onChange, value } }) => (
                    <View className="flex-row flex-wrap gap-2">
                      {categories.map((category) => {
                        const isSelected = value === category;

                        return (
                          <TouchableOpacity
                            key={category}
                            onPress={() => onChange(category)}
                            className={`rounded-full border px-4 py-2 ${
                              isSelected
                                ? "border-emerald-500 bg-emerald-100"
                                : "border-emerald-100 bg-white"
                            }`}
                            activeOpacity={0.7}
                          >
                            <Text
                              className={
                                isSelected
                                  ? "text-sm font-semibold text-emerald-700"
                                  : "text-sm text-gray-600"
                              }
                            >
                              {category}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                />
                {errors.category ? (
                  <Text className="mt-2 text-xs text-red-500">
                    {errors.category.message}
                  </Text>
                ) : null}
              </View>
            </View>
          )}

          {currentStep === 1 && (
            <View className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm">
              <View>
                <Text className="mb-2 text-sm font-semibold text-gray-700">CEP</Text>
                <Controller
                  control={control}
                  name="zip_code"
                  rules={{
                    required: "CEP e obrigatorio.",
                    validate: (value) =>
                      normalizeZipCode(value).length === 8 ||
                      "CEP precisa ter 8 digitos.",
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      ref={zipInputRef}
                      className="h-12 rounded-xl border border-emerald-100 px-4 text-gray-900"
                      placeholder="00000-000"
                      placeholderTextColor="#9CA3AF"
                      value={value}
                      keyboardType="number-pad"
                      onFocus={ensureFocusedInputVisible}
                      onChangeText={(text) => onChange(formatZipCode(text))}
                      onBlur={() => {
                        onBlur();
                        void handleLookupCep();
                      }}
                      returnKeyType="next"
                      onSubmitEditing={() => addressInputRef.current?.focus()}
                    />
                  )}
                />
                {errors.zip_code ? (
                  <Text className="mt-2 text-xs text-red-500">
                    {errors.zip_code.message}
                  </Text>
                ) : null}
                {zipLookupState === "loading" ? (
                  <Text className="mt-2 text-xs text-emerald-600">{zipLookupMessage}</Text>
                ) : null}
                {zipLookupState === "success" ? (
                  <Text className="mt-2 text-xs text-emerald-600">{zipLookupMessage}</Text>
                ) : null}
                {zipLookupState === "error" ? (
                  <Text className="mt-2 text-xs text-red-500">{zipLookupMessage}</Text>
                ) : null}
              </View>

              <View className="mt-4">
                <Text className="mb-2 text-sm font-semibold text-gray-700">Endereco</Text>
                <Controller
                  control={control}
                  name="address"
                  rules={{ required: "Endereco e obrigatorio." }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      ref={addressInputRef}
                      className="h-12 rounded-xl border border-emerald-100 px-4 text-gray-900"
                      placeholder="Rua, numero e complemento"
                      placeholderTextColor="#9CA3AF"
                      onFocus={ensureFocusedInputVisible}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      returnKeyType="next"
                      onSubmitEditing={() => cityInputRef.current?.focus()}
                    />
                  )}
                />
                {errors.address ? (
                  <Text className="mt-2 text-xs text-red-500">
                    {errors.address.message}
                  </Text>
                ) : null}
              </View>

              <View className="mt-4 flex-row gap-3">
                <View className="flex-1">
                  <Text className="mb-2 text-sm font-semibold text-gray-700">Cidade</Text>
                  <Controller
                    control={control}
                    name="city"
                    rules={{ required: "Cidade e obrigatoria." }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        ref={cityInputRef}
                        className="h-12 rounded-xl border border-emerald-100 px-4 text-gray-900"
                        placeholder="Sao Paulo"
                        placeholderTextColor="#9CA3AF"
                        onFocus={ensureFocusedInputVisible}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        returnKeyType="next"
                        onSubmitEditing={() => stateInputRef.current?.focus()}
                      />
                    )}
                  />
                  {errors.city ? (
                    <Text className="mt-2 text-xs text-red-500">{errors.city.message}</Text>
                  ) : null}
                </View>

                <View className="w-24">
                  <Text className="mb-2 text-sm font-semibold text-gray-700">UF</Text>
                  <Controller
                    control={control}
                    name="state"
                    rules={{
                      required: "UF e obrigatoria.",
                      minLength: {
                        value: 2,
                        message: "UF precisa ter 2 letras.",
                      },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        ref={stateInputRef}
                        className="h-12 rounded-xl border border-emerald-100 px-4 text-gray-900"
                        placeholder="SP"
                        placeholderTextColor="#9CA3AF"
                        onFocus={ensureFocusedInputVisible}
                        onBlur={onBlur}
                        onChangeText={(text) =>
                          onChange(
                            text
                              .replace(/[^a-zA-Z]/g, "")
                              .toUpperCase()
                              .slice(0, 2),
                          )
                        }
                        value={value}
                        autoCapitalize="characters"
                        maxLength={2}
                        returnKeyType="done"
                      />
                    )}
                  />
                  {errors.state ? (
                    <Text className="mt-2 text-xs text-red-500">{errors.state.message}</Text>
                  ) : null}
                </View>
              </View>
            </View>
          )}

          {currentStep === 2 && (
            <View className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm">
              <View>
                <Text className="mb-2 text-sm font-semibold text-gray-700">
                  Descricao (opcional)
                </Text>
                <Controller
                  control={control}
                  name="description"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      ref={descriptionInputRef}
                      className="min-h-[120px] rounded-xl border border-emerald-100 px-4 py-3 text-gray-900"
                      placeholder="Fale sobre horarios, materiais aceitos e observacoes."
                      placeholderTextColor="#9CA3AF"
                      onFocus={ensureFocusedInputVisible}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      multiline
                      textAlignVertical="top"
                      returnKeyType="done"
                    />
                  )}
                />
              </View>

              <View className="mt-5">
                <Text className="mb-3 text-sm font-semibold text-gray-700">
                  Imagens adicionais (maximo 5)
                </Text>
                <Controller
                  control={control}
                  name="images"
                  render={({ field: { onChange, value } }) => (
                    <View className="flex-row flex-wrap gap-3">
                      {(value || []).map((uri, index) => (
                        <View key={`${uri}-${index}`} className="relative">
                          <Image source={{ uri }} className="h-24 w-24 rounded-xl" />
                          <TouchableOpacity
                            onPress={() =>
                              onChange((value || []).filter((_, i) => i !== index))
                            }
                            className="absolute -right-2 -top-2 h-6 w-6 items-center justify-center rounded-full bg-red-500"
                            activeOpacity={0.7}
                          >
                            <Ionicons name="close" size={14} color="#fff" />
                          </TouchableOpacity>
                        </View>
                      ))}

                      {(value || []).length < 5 ? (
                        <TouchableOpacity
                          onPress={() => handleAddImages(value || [], onChange)}
                          className="h-24 w-24 items-center justify-center rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50"
                          activeOpacity={0.8}
                        >
                          <Ionicons name="add" size={24} color="#059669" />
                          <Text className="mt-1 text-xs font-semibold text-emerald-700">
                            Adicionar
                          </Text>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  )}
                />
              </View>
            </View>
          )}

          {currentStep === 3 && (
            <View className="gap-4">
              <View className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm">
                <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-500">
                  Revisao final
                </Text>
                <Text className="text-sm text-gray-600">
                  Verifique os dados abaixo antes de salvar o ponto de coleta.
                </Text>
              </View>

              <View className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm">
                <Text className="mb-3 text-sm font-semibold text-emerald-800">
                  Foto principal
                </Text>
                {principalImage ? (
                  <Image source={{ uri: principalImage }} className="h-48 w-full rounded-2xl" />
                ) : (
                  <View className="h-32 items-center justify-center rounded-2xl border border-dashed border-red-300 bg-red-50">
                    <Text className="text-sm font-semibold text-red-500">
                      Foto principal ausente
                    </Text>
                  </View>
                )}
              </View>

              <View className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm">
                <Text className="mb-1 text-sm font-semibold text-emerald-800">Dados</Text>
                <ReviewRow label="Nome" value={watch("name")} />
                <ReviewRow label="Categoria" value={watch("category")} />
                <ReviewRow label="CEP" value={watch("zip_code")} />
                <ReviewRow label="Endereco" value={watch("address")} />
                <ReviewRow label="Cidade" value={watch("city")} />
                <ReviewRow label="UF" value={watch("state")} />
                <ReviewRow label="Descricao" value={watch("description")} />
              </View>

              <View className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm">
                <Text className="mb-3 text-sm font-semibold text-emerald-800">
                  Imagens adicionais ({extraImages.length}/5)
                </Text>
                {extraImages.length ? (
                  <View className="flex-row flex-wrap gap-2">
                    {extraImages.map((uri, index) => (
                      <Image
                        key={`${uri}-${index}`}
                        source={{ uri }}
                        className="h-20 w-20 rounded-xl"
                      />
                    ))}
                  </View>
                ) : (
                  <Text className="text-sm text-gray-500">Nenhuma imagem adicional.</Text>
                )}
              </View>
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>

      <KeyboardStickyView
        offset={{ closed: 0, opened: 0 }}
        style={{
          borderTopWidth: 1,
          borderTopColor: "#D1FAE5",
          backgroundColor: "#FFFFFF",
          paddingHorizontal: ACTION_BAR_SIDE_PADDING,
          paddingTop: ACTION_BAR_TOP_PADDING,
          paddingBottom: actionBarBottomPadding,
        }}
      >
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={handleBackStep}
            className="h-12 flex-1 items-center justify-center rounded-xl border border-emerald-200 bg-white"
          >
            <Text className="text-sm font-semibold text-emerald-700">
              {currentStep === 0 ? "Cancelar" : "Voltar"}
            </Text>
          </Pressable>

          <Pressable
            onPress={
              currentStep === steps.length - 1
                ? submitForm
                : () => {
                    void handleNextStep();
                  }
            }
            disabled={isPending}
            className={`h-12 flex-1 items-center justify-center rounded-xl ${
              isPending ? "bg-emerald-300" : "bg-emerald-600"
            }`}
          >
            <Text className="text-sm font-semibold text-white">
              {currentStep === steps.length - 1
                ? isPending
                  ? "Salvando..."
                  : "Salvar ponto"
                : "Proximo"}
            </Text>
          </Pressable>
        </View>
      </KeyboardStickyView>
    </View>
  );
}
