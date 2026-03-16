import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, Upload, X, Image, Loader2 } from "lucide-react";
import { useScrollAnimation } from "./useScrollAnimation";
import InkSplash from "./InkSplash";
import TextReveal from "./TextReveal";
import StyleQuiz, { type QuizData } from "./quiz/StyleQuiz";
import { useLanguage } from "@/i18n/LanguageContext";
import { useBookingSubmit } from "@/hooks/useBookingSubmit";
import { InlineWidget, useCalendlyEventListener } from "react-calendly";
import CalendlySkeleton from "./CalendlySkeleton";

const TOTAL_FORM_STEPS = 5; // 0:Contact, 1:Idea+Photos, 2:Details, 3:Review, 4:Scheduling

interface BookingFormProps {
  variant?: "default" | "hero";
  className?: string;
}

const BookingForm = ({ variant = "default", className = "" }: BookingFormProps) => {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [referenceImages, setReferenceImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    idea: "", placement: "", size: "", budget: "", artist: "",
    style: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [supabaseBookingId, setSupabaseBookingId] = useState<string | null>(null);
  const [calendlyLoaded, setCalendlyLoaded] = useState(false);
  const { submitBooking, finalizeBooking, isSubmitting } = useBookingSubmit();
  const { ref, isVisible } = useScrollAnimation();
  const { t, language } = useLanguage();

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  const validateStep = () => {
    const errs: Record<string, string> = {};
    if (step === 0) {
      if (!form.name.trim()) errs.name = t.booking.errors.nameRequired;
      if (!form.email.trim()) errs.email = t.booking.errors.emailRequired;
      else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = t.booking.errors.emailInvalid;
      if (!form.phone.trim()) errs.phone = t.booking.errors.phoneRequired;
    }
    if (step === 1) {
      if (!form.idea.trim()) errs.idea = t.booking.errors.ideaRequired;
      if (!form.placement) errs.placement = t.booking.errors.placementRequired;
    }
    if (step === 2) {
      if (!form.size) errs.size = t.booking.errors.sizeRequired;
      if (!form.budget) errs.budget = t.booking.errors.budgetRequired;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => { if (validateStep()) setStep((s) => s + 1); };
  const prev = () => {
    if (step === 0) {
      setQuizComplete(false);
      return;
    }
    setStep((s) => s - 1);
  };
  const submit = async () => { 
    if (!validateStep()) return;
    
    // Safety Save to Supabase
    const result = await submitBooking({
      ...form,
      quizData
    }, referenceImages);

    if (result) {
      setSupabaseBookingId(result.id);
      setStep(4); // Move to Calendly
    }
  };

  const handleQuizComplete = (data: QuizData) => {
    setQuizData(data);
    setForm((f) => ({
      ...f,
      style: data.style,
      placement: data.zones.join(", "),
      size: data.size,
    }));
    setQuizComplete(true);
    setStep(0);
  };

  // Calendly Event Listener
  useCalendlyEventListener({
    onProfilePageViewed: () => setCalendlyLoaded(true),
    onEventTypeViewed: () => setCalendlyLoaded(true),
    onDateAndTimeSelected: () => setCalendlyLoaded(true),
    onEventScheduled: async (e) => {
      console.log("Calendly Event Scheduled:", e.data.payload);
      // UX: Immediately transition to success screen
      setSubmitted(true);
      
      // Sync with database in the background
      if (supabaseBookingId) {
        await finalizeBooking(supabaseBookingId, e.data.payload);
      }
    },
  });

  // Abandonment protection
  useEffect(() => {
    if (step === 4 && !submitted) {
      const handler = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = ''; // Trigger browser confirm
      };
      window.addEventListener('beforeunload', handler);
      return () => window.removeEventListener('beforeunload', handler);
    }
  }, [step, submitted]);

  // File upload handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files).filter(
      (f) => f.type.startsWith("image/") && f.size <= 10 * 1024 * 1024
    );
    setReferenceImages((prev) => [...prev, ...newFiles].slice(0, 5));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(
      (f) => f.type.startsWith("image/") && f.size <= 10 * 1024 * 1024
    );
    setReferenceImages((prev) => [...prev, ...files].slice(0, 5));
  };

  const removeImage = (index: number) => {
    setReferenceImages((prev) => prev.filter((_, i) => i !== index));
  };

  const inputCls = "w-full bg-secondary border border-border px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder:text-muted-foreground";
  const selectCls = inputCls;
  const errorCls = "text-destructive text-xs mt-1";

  const isHero = variant === "hero";

  if (submitted) {
    const successContent = (
      <div className={`${isHero ? "" : "max-w-2xl mx-auto"} text-center space-y-8 py-10`}>
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-24 h-24 mx-auto border border-primary flex items-center justify-center relative"
        >
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute left-0 top-0 w-[1px] bg-primary"
          />
          <Check className="w-12 h-12 text-primary" />
        </motion.div>

        <div className="space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-serif text-3xl md:text-4xl text-foreground"
          >
            {t.booking.successTitle}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground"
          >
            {t.booking.successMessage}
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-secondary/30 border border-border p-8 text-left max-w-md mx-auto space-y-4"
        >
          {[
            t.booking.successChecklist.ideaSaved,
            t.booking.successChecklist.emailConfirm,
            t.booking.successChecklist.artistReady
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + (i * 0.1) }}
              className="flex items-start gap-3"
            >
              <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm text-foreground/80">{item}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-primary/60 text-sm italic pt-4"
        >
          {t.booking.successClosing}
        </motion.p>
      </div>
    );

    if (isHero) return <div className={className}>{successContent}</div>;

    return (
      <section id="booking" className="py-32 px-6" ref={ref}>
        {successContent}
      </section>
    );
  }

  const formContent = (
    <div className={isHero ? "" : "max-w-2xl mx-auto"}>
      {!isHero && (
        <div
          className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4">{t.booking.subtitle}</p>
          <TextReveal text={t.booking.title} className="font-serif text-4xl md:text-5xl font-light text-foreground justify-center" />
          <p className="text-muted-foreground mt-4">
            {!quizComplete ? t.booking.quizPrompt : t.booking.formPrompt}
          </p>
        </div>
      )}

      {/* Quiz phase */}
      {!quizComplete && (
        <div className={!isHero ? `transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}` : ""}>
          <StyleQuiz onComplete={handleQuizComplete} />
        </div>
      )}

      {quizComplete && (
        <>
          {/* Progress */}
          <div className={`flex items-center justify-center gap-2 ${isHero ? "mb-8 scale-75 md:scale-90" : "mb-12"}`}>
            {Array.from({ length: TOTAL_FORM_STEPS }).map((_, s) => (
              <div
                key={s}
                className={`h-0.5 w-10 transition-colors duration-300 ${s <= step ? "bg-primary" : "bg-border"}`}
              />
            ))}
          </div>

          <div className={!isHero ? `transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}` : ""}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
              {/* Step 0: Contact */}
              {step === 0 && (
                <div className="space-y-6">
                  <h3 className="font-serif text-xl text-foreground mb-6">{t.booking.contactTitle}</h3>
                  <div>
                    <input className={inputCls} placeholder={t.booking.namePlaceholder} value={form.name} onChange={(e) => update("name", e.target.value)} />
                    {errors.name && <p className={errorCls}>{errors.name}</p>}
                  </div>
                  <div>
                    <input className={inputCls} type="email" placeholder={t.booking.emailPlaceholder} value={form.email} onChange={(e) => update("email", e.target.value)} />
                    {errors.email && <p className={errorCls}>{errors.email}</p>}
                  </div>
                  <div>
                    <input className={inputCls} placeholder={t.booking.phonePlaceholder} value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                    {errors.phone && <p className={errorCls}>{errors.phone}</p>}
                  </div>
                </div>
              )}

              {/* Step 1: Idea + Reference Photos (Previously Step 2) */}
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="font-serif text-xl text-foreground mb-6">{t.booking.ideaTitle}</h3>
                  <div>
                    <textarea className={`${inputCls} min-h-[120px] resize-none`} placeholder={t.booking.ideaPlaceholder} value={form.idea} onChange={(e) => update("idea", e.target.value)} />
                    {errors.idea && <p className={errorCls}>{errors.idea}</p>}
                  </div>
                  {quizData ? (
                    <div className="px-4 py-3 bg-secondary/50 border border-border">
                      <p className="text-xs text-muted-foreground uppercase tracking-[0.15em] mb-1">{t.booking.bodyPoint}</p>
                      <p className="text-sm text-foreground">{form.placement}</p>
                    </div>
                  ) : (
                    <div>
                      <select className={selectCls} value={form.placement} onChange={(e) => update("placement", e.target.value)}>
                        <option value="">{t.booking.bodyPoint}</option>
                        {t.booking.placements.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                      {errors.placement && <p className={errorCls}>{errors.placement}</p>}
                    </div>
                  )}

                  {/* Reference image upload */}
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground uppercase tracking-[0.15em]">
                      {t.booking.referenceImages} <span className="normal-case tracking-normal">{t.booking.referenceImagesOptional}</span>
                    </p>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDrop={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                      className="border-2 border-dashed border-border hover:border-primary/40 bg-secondary/20 px-6 py-8 text-center cursor-pointer transition-colors duration-300"
                    >
                      <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {t.booking.dragImages} <span className="text-foreground underline">{t.booking.clickHere}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{t.booking.fileTypes}</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    {/* Thumbnails */}
                    {referenceImages.length > 0 && (
                      <div className="flex flex-wrap gap-3">
                        {referenceImages.map((file, i) => (
                          <div key={`${file.name}-${i}`} className="relative group w-20 h-20 border border-border bg-secondary/30 overflow-hidden">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => removeImage(i)}
                              className="absolute top-0.5 right-0.5 w-5 h-5 bg-foreground/80 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Details (Previously Step 3) */}
              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="font-serif text-xl text-foreground mb-6">{t.booking.detailsTitle}</h3>
                  {quizData ? (
                    <div className="px-4 py-3 bg-secondary/50 border border-border">
                      <p className="text-xs text-muted-foreground uppercase tracking-[0.15em] mb-1">{t.booking.sizeLabel}</p>
                      <p className="text-sm text-foreground">{form.size}</p>
                    </div>
                  ) : (
                    <div>
                      <select className={selectCls} value={form.size} onChange={(e) => update("size", e.target.value)}>
                        <option value="">{t.booking.approximateSize}</option>
                        {t.booking.sizes.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.size && <p className={errorCls}>{errors.size}</p>}
                    </div>
                  )}
                  <div>
                    <select className={selectCls} value={form.budget} onChange={(e) => update("budget", e.target.value)}>
                      <option value="">{t.booking.budgetLabel}</option>
                      {t.booking.budgets.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                    {errors.budget && <p className={errorCls}>{errors.budget}</p>}
                  </div>
                  <div>
                    <select className={selectCls} value={form.artist} onChange={(e) => update("artist", e.target.value)}>
                      <option value="">{t.booking.artistLabel}</option>
                      {t.booking.artistOptions.map((a) => <option key={a} value={a}>{a}</option>)}
                      <option value={t.booking.noPreference}>{t.booking.noPreference}</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 3: Review (Previously Step 4) */}
              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="font-serif text-xl text-foreground mb-6">{t.booking.reviewTitle}</h3>
                  <div className="space-y-3 text-sm">
                    {[
                      [t.booking.reviewLabels.name, form.name],
                      [t.booking.reviewLabels.email, form.email],
                      [t.booking.reviewLabels.phone, form.phone],
                      ...(form.style ? [[t.booking.reviewLabels.style, form.style]] : []),
                      [t.booking.reviewLabels.placement, form.placement],
                      [t.booking.reviewLabels.size, form.size],
                      [t.booking.reviewLabels.budget, form.budget],
                      [t.booking.reviewLabels.artist, form.artist || t.booking.noPreference],
                    ].map(([label, val]) => (
                      <div key={label} className="flex justify-between border-b border-border pb-2">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="text-foreground">{val}</span>
                      </div>
                    ))}
                    <div className="pt-2">
                      <p className="text-muted-foreground mb-1">{t.booking.reviewLabels.idea}</p>
                      <p className="text-foreground">{form.idea}</p>
                    </div>
                    {referenceImages.length > 0 && (
                      <div className="pt-2">
                        <p className="text-muted-foreground mb-2">{t.booking.reviewLabels.referenceImages}</p>
                        <div className="flex flex-wrap gap-2">
                          {referenceImages.map((file, i) => (
                            <div key={`review-${file.name}-${i}`} className="flex items-center gap-1.5 px-2.5 py-1 bg-secondary/50 border border-border text-xs text-foreground">
                              <Image className="w-3 h-3 text-muted-foreground" />
                              {file.name.length > 20 ? file.name.slice(0, 17) + "..." : file.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Scheduling (Calendly) (Previously Step 5) */}
              {step === 4 && (
                    <div className="space-y-6">
                      <div className="text-center space-y-2 mb-6">
                        <h3 className="font-serif text-2xl text-foreground">{t.booking.scheduleTitle || "Finalize Your Slot"}</h3>
                        <p className="text-sm text-muted-foreground">
                          {t.booking.scheduleSubtitle || "Your details are saved. Pick a specific time below to lock it in."}
                        </p>
                      </div>
                      
                      <div className="calendly-container relative min-h-[600px] border border-border bg-secondary/10 overflow-hidden shadow-2xl shadow-primary/5 transition-all duration-500">
                        <style>{`
                          .calendly-container {
                            animation: calendly-glow 3s ease-in-out infinite alternate;
                          }
                          @keyframes calendly-glow {
                            from { border-color: hsl(var(--border) / 1); }
                            to { border-color: hsl(var(--primary) / 0.4); }
                          }
                        `}</style>
                        
                        {!calendlyLoaded && (
                          <div className="absolute inset-0 z-10 bg-background">
                            <CalendlySkeleton />
                          </div>
                        )}

                        <div className={`transition-opacity duration-700 ${calendlyLoaded ? 'opacity-100' : 'opacity-0'}`}>
                          <InlineWidget 
                            url={import.meta.env.VITE_CALENDLY_URL || "https://calendly.com/patsialasvasilis/new-meeting"}
                            prefill={{
                              email: form.email,
                              name: form.name,
                            }}
                            pageSettings={{
                              backgroundColor: '121212',
                              hideEventTypeDetails: true,
                              hideLandingPageDetails: true,
                              primaryColor: 'c9a55a',
                              textColor: 'f5f5f5',
                            }}
                            utm={{
                              utmSource: "tattoo_studio_app",
                              utmMedium: "booking_flow",
                              utmCampaign: supabaseBookingId || "new_booking",
                              utmContent: `${window.location.origin}/ref/${supabaseBookingId}`
                            }}
                            styles={{
                              height: '600px'
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="text-center pt-6">
                        <button 
                          onClick={() => setSubmitted(true)}
                          className="text-muted-foreground hover:text-primary text-xs uppercase tracking-widest transition-colors duration-300 flex items-center gap-2 mx-auto"
                        >
                          <span className="w-12 h-px bg-border/50" />
                          {t.booking.skipScheduling || "I'll schedule later"}
                          <span className="w-12 h-px bg-border/50" />
                        </button>
                      </div>
                    </div>
                  )}

              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            {step < 4 && (
              <div className={`flex justify-between ${isHero ? "mt-8" : "mt-10"}`}>
                {step > 0 || quizData ? (
                  <motion.button
                    onClick={prev}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <ChevronLeft size={16} /> {t.booking.back}
                  </motion.button>
                ) : <div />}
                {step < TOTAL_FORM_STEPS - 2 ? (
                  <motion.button
                    onClick={next}
                    className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground text-sm tracking-[0.1em] uppercase hover:opacity-90 transition-opacity"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {t.booking.next} <ChevronRight size={16} />
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={submit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground text-sm tracking-[0.1em] uppercase hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t.booking.securingVision || "Securing your vision..."}
                      </>
                    ) : (
                      t.booking.submit
                    )}
                  </motion.button>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  if (isHero) {
    return (
      <div className={`relative ${className}`}>
        {formContent}
      </div>
    );
  }

  return (
    <section id="booking" className="py-32 px-6 relative overflow-hidden" ref={ref}>
      <InkSplash variant={1} className="w-[450px] h-[450px] top-0 -right-24" speed={0.3} opacity={0.035} flip />
      <InkSplash variant={3} className="w-[300px] h-[300px] -bottom-16 -left-16" speed={0.45} opacity={0.03} />
      {formContent}
    </section>
  );
};

export default BookingForm;
