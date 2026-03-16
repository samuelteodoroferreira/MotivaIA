import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
  Pressable,
  Share,
  Image
} from "react-native";
import { getMotivationalMessage } from "../services/aiService";
import { getMotivationalImageUrl } from "../services/imageService";

export function HomeScreen() {
  const [mood, setMood] = useState("");
  const [response, setResponse] = useState("");
  const [goal, setGoal] = useState("");
  const [category, setCategory] = useState("geral");
  const [intensity, setIntensity] = useState("equilibrada");
  const [imageUrl, setImageUrl] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setError("");
    setResponse("");
    setImageUrl(null);

    if (!mood.trim()) {
      setError("Por favor, descreva como você está se sentindo.");
      return;
    }

    try {
      setIsLoading(true);
      const result = await getMotivationalMessage({
        moodDescription: mood.trim(),
        category,
        intensity,
        goal: goal.trim()
      });

      setResponse(result);

      const url = await getMotivationalImageUrl({
        category,
        intensity,
        moodDescription: mood.trim()
      });
      if (url) {
        setImageUrl(url);
      }
      setHistory((prev) => {
        const next = [
          {
            id: Date.now().toString(),
            mood: mood.trim(),
            goal: goal.trim(),
            category,
            intensity,
            message: result,
            imageUrl: url ?? null,
            createdAt: new Date().toLocaleString()
          },
          ...prev
        ];

        // mantém só as 10 últimas mensagens
        return next.slice(0, 10);
      });
    } catch (err) {
      setError(
        "Não foi possível gerar a mensagem agora. Verifique sua conexão e a chave da API."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleShare() {
    if (!response) return;

    try {
      await Share.share({
        message: `Mensagem motivacional do MotivaIA:\n\n"${response}"`
      });
    } catch {
      // ignora erros de compartilhamento
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.title}>MotivaIA</Text>
          <Text style={styles.subtitle}>
            Descreva como você está se sentindo e receba uma mensagem de
            incentivo gerada por inteligência artificial.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contexto do seu dia</Text>

            <Text style={styles.label}>Como você está hoje?</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Estou cansado, desanimado com os estudos..."
              placeholderTextColor="#6b7280"
              multiline
              value={mood}
              onChangeText={setMood}
            />

            <Text style={styles.label}>Qual é a sua meta de hoje?</Text>
            <TextInput
              style={styles.input}
              placeholder='Ex: Estudar 1 hora de React Native'
              placeholderTextColor="#6b7280"
              multiline
              value={goal}
              onChangeText={setGoal}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personalize sua motivação</Text>

            <Text style={styles.label}>Categoria</Text>
            <View style={styles.chipRow}>
              {["geral", "estudos", "trabalho", "autoestima", "saúde"].map(
                (item) => (
                  <Pressable
                    key={item}
                    onPress={() => setCategory(item)}
                    style={[
                      styles.chip,
                      category === item && styles.chipSelected
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        category === item && styles.chipTextSelected
                      ]}
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </Text>
                  </Pressable>
                )
              )}
            </View>

            <Text style={styles.label}>Intensidade da mensagem</Text>
            <View style={styles.chipRow}>
              {["suave", "equilibrada", "intensa"].map((level) => (
                <Pressable
                  key={level}
                  onPress={() => setIntensity(level)}
                  style={[
                    styles.chip,
                    intensity === level && styles.chipSelected
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      intensity === level && styles.chipTextSelected
                    ]}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[
              styles.button,
              !mood.trim() || isLoading ? styles.buttonDisabled : null
            ]}
            onPress={handleGenerate}
            disabled={!mood.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#e5e7eb" />
            ) : (
              <Text style={styles.buttonText}>Gerar mensagem</Text>
            )}
          </TouchableOpacity>

          {response ? (
            <View style={styles.card}>
              {imageUrl && (
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
              )}
              <Text style={styles.cardTitle}>Sua mensagem personalizada</Text>
              <Text style={styles.cardText}>{response}</Text>

              <TouchableOpacity
                style={styles.shareButton}
                onPress={handleShare}
              >
                <Text style={styles.shareButtonText}>Compartilhar</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {history.length > 0 && (
            <View style={styles.historySection}>
              <Text style={styles.sectionTitle}>Histórico recente</Text>
              {history.map((item) => (
                <View key={item.id} style={styles.historyItem}>
                  {item.imageUrl && (
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.historyImage}
                      resizeMode="cover"
                    />
                  )}
                  <View style={styles.historyHeader}>
                    <Text style={styles.historyDate}>{item.createdAt}</Text>
                    <Text style={styles.historyTag}>
                      {item.category} • {item.intensity}
                    </Text>
                  </View>
                  {item.goal ? (
                    <Text style={styles.historyGoal}>
                      Meta: {item.goal}
                    </Text>
                  ) : null}
                  <Text style={styles.historyMessage}>{item.message}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: "#f5f5f7"
  },
  scrollContent: {
    flexGrow: 1
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 32,
    gap: 16
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f2933",
    marginBottom: 4
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12
  },
  section: {
    gap: 8,
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151"
  },
  input: {
    minHeight: 100,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
    color: "#111827",
    textAlignVertical: "top"
  },
  error: {
    color: "#b91c1c",
    fontSize: 12
  },
  button: {
    marginTop: 8,
    borderRadius: 999,
    backgroundColor: "#6366f1",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonDisabled: {
    opacity: 0.5
  },
  buttonText: {
    color: "#f9fafb",
    fontWeight: "600",
    fontSize: 16
  },
  card: {
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2
  },
  cardImage: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    marginBottom: 12
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8
  },
  cardText: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20
  },
  shareButton: {
    marginTop: 12,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#6366f1",
    backgroundColor: "#eef2ff"
  },
  shareButtonText: {
    color: "#4f46e5",
    fontSize: 13,
    fontWeight: "500"
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff"
  },
  chipSelected: {
    borderColor: "#6366f1",
    backgroundColor: "#eef2ff"
  },
  chipText: {
    fontSize: 13,
    color: "#6b7280"
  },
  chipTextSelected: {
    color: "#111827",
    fontWeight: "600"
  },
  historySection: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    gap: 12
  },
  historyItem: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 4
  },
  historyImage: {
    width: "100%",
    height: 80,
    borderRadius: 10,
    marginBottom: 8
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  historyDate: {
    fontSize: 11,
    color: "#9ca3af"
  },
  historyTag: {
    fontSize: 11,
    color: "#4f46e5"
  },
  historyGoal: {
    fontSize: 12,
    color: "#374151"
  },
  historyMessage: {
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 18
  }
});

