import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Image, User, Mail, Calendar, Info, Instagram, ArrowLeft, Loader2, Maximize2, Phone, Clock } from "lucide-react";

interface BookingRecord {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  instagram_handle: string;
  style_quiz_data: any;
  reference_images: string[];
  scheduled_at: string | null;
  status: string;
}

const ArtistGallery = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) return;
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (!error && data) {
        setBooking(data);
      }
      setLoading(false);
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground font-serif tracking-widest uppercase text-xs">Loading Reference Data...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-6">
        <h1 className="font-serif text-3xl">Booking Not Found</h1>
        <p className="text-muted-foreground max-w-md">The reference link might be old or the booking was removed.</p>
        <Link to="/" className="text-primary hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Studio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-8 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="font-serif text-3xl tracking-tight">{booking.full_name}</h1>
            <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-500 uppercase tracking-widest">
              <span className="flex items-center gap-1"><Mail size={12} /> {booking.email}</span>
              <span className="flex items-center gap-1"><Phone size={12} /> {booking.phone}</span>
              {booking.instagram_handle && (
                <span className="flex items-center gap-1"><Instagram size={12} /> {booking.instagram_handle}</span>
              )}
              {booking.scheduled_at && (
                <span className="flex items-center gap-1 text-primary"><Calendar size={12} /> {new Date(booking.scheduled_at).toLocaleDateString()} at {new Date(booking.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              )}
            </div>
          </div>
          <div className="bg-black text-white px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold">
            {booking.status.replace('_', ' ')}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-12 space-y-12">
        {/* The Brackets - Project Details */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
            <Info size={18} className="text-gray-400" />
            <h2 className="font-serif text-xl">Project Brackets</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Requested Style</label>
                <p className="text-lg font-medium">{booking.style_quiz_data.style || 'N/A'}</p>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Body Placement</label>
                <p className="text-lg font-medium">{booking.style_quiz_data.placement || 'N/A'}</p>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Approximate Size</label>
                <p className="text-lg font-medium">{booking.style_quiz_data.size || 'N/A'}</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Budget Range</label>
                <p className="text-lg font-medium">{booking.style_quiz_data.budget || 'N/A'}</p>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Artist Preference</label>
                <p className="text-lg font-medium">{booking.style_quiz_data.artistPreference || 'Any'}</p>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">The Idea</label>
                <p className="text-gray-700 leading-relaxed italic">"{booking.style_quiz_data.tattooIdea}"</p>
              </div>
            </div>
          </div>
        </section>

        {/* Reference Images Collection */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
            <Image size={18} className="text-gray-400" />
            <h2 className="font-serif text-xl">Reference Visuals</h2>
          </div>
          
          {booking.reference_images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {booking.reference_images.map((url, i) => (
                <motion.div 
                  key={i}
                  className="aspect-square bg-gray-100 relative group cursor-pointer overflow-hidden rounded-sm"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedImage(url)}
                >
                  <img src={url} alt={`Ref ${i+1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Maximize2 className="text-white w-6 h-6 drop-shadow-lg" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-12 border border-dashed border-gray-300 rounded-sm text-center">
              <p className="text-sm text-gray-400">No reference images uploaded</p>
            </div>
          )}
        </section>
      </main>

      {/* Lightbox / Zoom Overlay */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <motion.img 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={selectedImage} 
            alt="Reference preview" 
            className="max-w-full max-h-full object-contain shadow-2xl"
          />
          <button className="absolute top-6 right-6 text-white text-xs uppercase tracking-widest font-bold">Close</button>
        </div>
      )}
    </div>
  );
};

export default ArtistGallery;
