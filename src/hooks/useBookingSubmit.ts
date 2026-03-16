import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { type QuizData } from "@/components/quiz/StyleQuiz";

export interface BookingData {
  name: string;
  email: string;
  phone: string;
  idea: string;
  placement: string;
  size: string;
  budget: string;
  artist: string;
  style: string;
  preferredDate?: Date;
  quizData?: QuizData | null;
  gdpr_consented?: boolean;
  id?: string;
}

export const useBookingSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];
    
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `refs/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('tattoo-references')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('tattoo-references')
        .getPublicUrl(filePath);

      urls.push(publicUrl);
    }
    
    return urls;
  };

  const submitBooking = async (data: BookingData, images: File[]) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Upload Images
      const imageUrls = images.length > 0 ? await uploadImages(images) : [];

      // 2. Prepare Style Quiz Data for JSONB
      // We merge everything into one object for the artist's reference
      const styleQuizData = {
        ...(data.quizData || {}),
        tattooIdea: data.idea,
        size: data.size,
        placement: data.placement,
        budget: data.budget,
        artistPreference: data.artist,
        phoneNumber: data.phone
      };

      // 3. Update or Insert into Supabase
      const insertData: any = {
        full_name: data.name,
        email: data.email,
        phone: data.phone,
        instagram_handle: '', // Future field
        style_quiz_data: styleQuizData,
        preferred_date: data.preferredDate?.toISOString(),
        reference_images: imageUrls,
        status: 'pending_scheduling',
        gdpr_consented: data.gdpr_consented
      };

      if (data.id) {
        insertData.id = data.id;
      }

      const { data: record, error: insertError } = await supabase
        .from('bookings')
        .upsert(insertData)
        .select()
        .single();

      if (insertError) throw insertError;

      return record;
    } catch (err: any) {
      console.error("Booking submission error:", err);
      setError(err.message || "Something went wrong saving your booking.");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const finalizeBooking = async (bookingId: string, eventData: any) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const updateData: Record<string, any> = {
        status: 'scheduled',
        calendly_event_uri: eventData?.event?.uri || null,
        calendly_invitee_uri: eventData?.invitee?.uri || null,
        calendly_payload: eventData
      };

      // Only set scheduled_at if the payload actually contains a start_time
      // (possible on paid Calendly tiers)
      if (eventData?.event?.start_time) {
        updateData.scheduled_at = eventData.event.start_time;
      }

      const { error: updateError } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', bookingId);

      if (updateError) throw updateError;
      return true;
    } catch (err: any) {
      console.error("Error finalizing booking:", err);
      setError(err.message || "Failed to sync your appointment.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const softSave = async (data: Partial<BookingData>, existingId?: string | null) => {
    // We don't set isSubmitting for softSave to avoid blocking the UI flow
    try {
      const payload = {
        full_name: data.name,
        email: data.email,
        phone: data.phone,
        gdpr_consented: data.gdpr_consented,
        status: 'lead'
      };

      if (existingId) {
        const { error: updateError } = await supabase
          .from('bookings')
          .update(payload)
          .eq('id', existingId);
        
        if (updateError) throw updateError;
        return { id: existingId };
      } else {
        const { data: record, error: insertError } = await supabase
          .from('bookings')
          .insert(payload)
          .select()
          .single();

        if (insertError) throw insertError;
        return record;
      }
    } catch (err: any) {
      console.error("Soft save error:", err);
      // We fail silently for soft saves as they are non-critical optimizations
      return null;
    }
  };

  return { submitBooking, finalizeBooking, softSave, isSubmitting, error };
};
