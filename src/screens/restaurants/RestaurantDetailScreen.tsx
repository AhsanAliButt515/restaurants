import type { Comment } from '@/api/restaurants';
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useRestaurantDetailQuery,
  useUpdateCommentMutation,
} from '@/api/restaurants';
import { CustomStarRating } from '@/components/CustomStarRating';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/Button';
import { useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function RestaurantDetailScreen() {
  const route = useRoute();
  const id = (route.params as { id?: string })?.id ?? '';
  const { data: restaurant, isLoading, error } = useRestaurantDetailQuery(id);
  const createComment = useCreateCommentMutation(id);
  const deleteCommentMutation = useDeleteCommentMutation(id);

  const [rating, setRating] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [editingReview, setEditingReview] = useState<Comment | null>(null);

  const handleSubmitReview = () => {
    setValidationError(null);
    const comment = commentText.trim();
    if (rating < 1 || rating > 5) {
      setValidationError('Selecciona una valoración de 1 a 5 estrellas.');
      return;
    }
    if (comment.length < 10) {
      setValidationError('El comentario debe tener al menos 10 caracteres.');
      return;
    }
    if (comment.length > 255) {
      setValidationError('El comentario no puede superar 255 caracteres.');
      return;
    }
    createComment.mutate(
      { comment, rating },
      {
        onSuccess: () => {
          setRating(0);
          setCommentText('');
        },
        onError: (err: any) => {
          setValidationError(
            err?.response?.data?.message ?? err?.message ?? 'No se pudo enviar la reseña.'
          );
        },
      }
    );
  };

  const handleDelete = (commentId: string) => {
    deleteCommentMutation.mutate(commentId);
  };

  if (isLoading || !restaurant) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#264BEB" />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText>Error al cargar el restaurante</ThemedText>
      </ThemedView>
    );
  }

  const reviews = restaurant.reviews ?? [];

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Image source={{ uri: restaurant.image }} style={styles.heroImage} />

          <View style={styles.section}>
            <ThemedText type="title" style={styles.name}>
              {restaurant.name}
            </ThemedText>
            {restaurant.address ? (
              <ThemedText style={styles.address}>{restaurant.address}</ThemedText>
            ) : null}
            <ThemedText style={styles.description}>{restaurant.description}</ThemedText>
            {restaurant.avgRating != null && (
              <View style={styles.avgRow}>
                <CustomStarRating rating={restaurant.avgRating} size={18} />
                <ThemedText style={styles.avgText}>{restaurant.avgRating.toFixed(1)}</ThemedText>
              </View>
            )}
          </View>

          {/* Create review form */}
          <View style={styles.reviewBox}>
            <ThemedText style={styles.reviewBoxTitle}>Deja tu opinión</ThemedText>
            <View style={styles.starsRow}>
              <CustomStarRating rating={rating} size={28} onRatingChange={setRating} />
            </View>
            <TextInput
              style={styles.commentInput}
              placeholder="Escribe tu comentario (10-255 caracteres)..."
              placeholderTextColor="#999"
              value={commentText}
              onChangeText={(t) => {
                setCommentText(t);
                if (validationError) setValidationError(null);
              }}
              multiline
              numberOfLines={3}
            />
            {validationError ? (
              <ThemedText style={styles.validationError}>{validationError}</ThemedText>
            ) : null}
            <Button
              title="Enviar"
              onPress={handleSubmitReview}
              loading={createComment.isPending}
              disabled={!rating || !commentText.trim()}
              style={styles.submitButton}
            />
          </View>

          {/* Reviews list */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.reviewsSectionTitle}>
              Reseñas ({reviews.length})
            </ThemedText>
            {reviews.length === 0 ? (
              <ThemedText style={styles.noReviews}>Aún no hay reseñas.</ThemedText>
            ) : (
              reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  isSelected={selectedReviewId === review._id}
                  onPress={() => setSelectedReviewId((id) => (id === review._id ? null : review._id))}
                  onEdit={() => setEditingReview(review)}
                  onDelete={() => handleDelete(review._id)}
                  isDeleting={deleteCommentMutation.isPending}
                />
              ))
            )}
          </View>

          {/* Edit review form (same UI as create, with Update button) */}
          {editingReview && (
            <EditReviewForm
              review={editingReview}
              restaurantId={id}
              onClose={() => setEditingReview(null)}
              onSuccess={() => setEditingReview(null)}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

function ReviewCard({
  review,
  isSelected,
  onPress,
  onEdit,
  onDelete,
  isDeleting,
}: {
  review: Comment;
  isSelected: boolean;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const displayName = review.name ?? review.userName ?? 'Anónimo';
  const displayComment = review.comment ?? review.text ?? '';
  const displayDate = review.date ?? review.createdAt ?? '';
  const dateStr = displayDate
    ? new Date(displayDate).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';

  return (
    <TouchableOpacity style={styles.reviewCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.reviewCardHeader}>
        <ThemedText style={styles.reviewAuthor}>{displayName}</ThemedText>
        <CustomStarRating rating={review.rating} size={14} />
      </View>
      {dateStr ? <ThemedText style={styles.reviewDate}>{dateStr}</ThemedText> : null}
      <ThemedText style={styles.reviewComment}>{displayComment}</ThemedText>
      {isSelected && (
        <View style={styles.reviewActions}>
          <Button title="Editar" variant="outline" onPress={onEdit} style={styles.reviewActionBtn} />
          <Button
            title="Eliminar"
            variant="outline"
            onPress={onDelete}
            loading={isDeleting}
            style={styles.reviewActionBtn}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}

function EditReviewForm({
  review,
  restaurantId,
  onClose,
  onSuccess,
}: {
  review: Comment;
  restaurantId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const updateComment = useUpdateCommentMutation(restaurantId, review._id);
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState((review.comment ?? review.text) ?? '');
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = () => {
    setError(null);
    const trimmedComment = comment.trim();
    if (rating < 1 || rating > 5) {
      setError('Selecciona una valoración de 1 a 5 estrellas.');
      return;
    }
    if (trimmedComment.length < 10) {
      setError('El comentario debe tener al menos 10 caracteres.');
      return;
    }
    if (trimmedComment.length > 255) {
      setError('El comentario no puede superar 255 caracteres.');
      return;
    }
    updateComment.mutate(
      { rating, comment: trimmedComment },
      {
        onSuccess: () => {
          onSuccess();
          onClose();
        },
        onError: (err: any) => {
          setError(err?.response?.data?.message ?? err?.message ?? 'No se pudo guardar.');
        },
      }
    );
  };

  return (
    <View style={styles.reviewBox}>
      <ThemedText style={styles.reviewBoxTitle}>Editar reseña</ThemedText>
      <View style={styles.starsRow}>
        <CustomStarRating rating={rating} size={28} onRatingChange={setRating} />
      </View>
      <TextInput
        style={styles.commentInput}
        placeholder="Comentario (10-255 caracteres)"
        placeholderTextColor="#999"
        value={comment}
        onChangeText={(t) => { setComment(t); if (error) setError(null); }}
        multiline
        numberOfLines={3}
      />
      {error ? <ThemedText style={styles.validationError}>{error}</ThemedText> : null}
      <View style={styles.editFormActions}>
        <Button title="Cancelar" variant="outline" onPress={onClose} style={styles.editFormBtn} />
        <Button
          title="Actualizar comentario"
          onPress={handleUpdate}
          loading={updateComment.isPending}
          style={styles.editFormBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  heroImage: {
    width: '100%',
    height: 220,
    backgroundColor: '#eee',
  },
  section: { paddingHorizontal: 16, paddingTop: 20 },
  name: { marginBottom: 4 },
  address: { fontSize: 14, color: '#666', marginBottom: 12 },
  description: { fontSize: 15, lineHeight: 22, marginBottom: 8 },
  avgRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  avgText: { fontSize: 15, fontWeight: '600' },
  reviewBox: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fafafa',
  },
  reviewBoxTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  starsRow: { marginBottom: 12 },
  nameInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    minHeight: 88,
    textAlignVertical: 'top',
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  submitButton: { alignSelf: 'stretch' },
  validationError: { color: '#c00', fontSize: 13, marginBottom: 8 },
  reviewsSectionTitle: { marginBottom: 12 },
  noReviews: { fontSize: 14, color: '#888' },
  reviewCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 8,
  },
  reviewCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewAuthor: { fontSize: 15, fontWeight: '600' },
  reviewDate: { fontSize: 12, color: '#888', marginBottom: 6 },
  reviewComment: { fontSize: 14, lineHeight: 20, color: '#333', marginBottom: 12 },
  reviewActions: { flexDirection: 'row', gap: 10 },
  reviewActionBtn: { flex: 1 },
  editFormActions: { flexDirection: 'row', gap: 10 },
  editFormBtn: { flex: 1 },
});
