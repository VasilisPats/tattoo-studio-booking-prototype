import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, Upload, X, Image } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { el as elLocale } from "date-fns/locale";
import { enUS as enLocale } from "date-fns/locale";
import "react-day-picker/dist/style.css";
import { useScrollAnimation } from "./useScrollAnimation";
import InkSplash from "./InkSplash";
import TextReveal from "./TextReveal";
import StyleQuiz, { type QuizData } from "./quiz/StyleQuiz";
import { useLanguage } from "@/i18n/LanguageContext";

const TOTAL_FORM_STEPS = 5; // 0:Contact, 1:Date, 2:Idea+Photos, 3:Details, 4:Review

interface BookingFormProps {
  variant?: "default" | "hero";
  className?: string;
}

const BookingForm = ({ variant = "default", className = "" }: BookingFormProps) => {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [preferredDate, setPreferredDate] = useState<Date | undefined>(undefined);
  const [referenceImages, setReferenceImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    idea: "", placement: "", size: "", budget: "", artist: "",
    style: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { ref, isVisible } = useScrollAnimation();
  const { t, language } = useLanguage();
  const dateLocale = language === "el" ? elLocale : enLocale;

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
      if (!preferredDate) errs.date = t.booking.errors.dateRequired;
    }
    if (step === 2) {
      if (!form.idea.trim()) errs.idea = t.booking.errors.ideaRequired;
      if (!form.placement) errs.placement = t.booking.errors.placementRequired;
    }
    if (step === 3) {
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
  const submit = () => { if (validateStep()) setSubmitted(true); };

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
      <div className={`${isHero ? "" : "max-w-2xl mx-auto"} text-center space-y-6`}>
        <div className="w-20 h-20 mx-auto border border-primary flex items-center justify-center">
          <Check className="w-10 h-10 text-primary" />
        </div>
        <h2 className="font-serif text-3xl text-foreground">{t.booking.successTitle}</h2>
        <p className="text-muted-foreground">{t.booking.successMessage}</p>
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

              {/* Step 1: Preferred Date */}
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="font-serif text-xl text-foreground mb-6">{t.booking.dateTitle}</h3>
                  <div className="flex justify-center">
                    <DayPicker
                      mode="single"
                      selected={preferredDate}
                      onSelect={setPreferredDate}
                      locale={dateLocale}
                      disabled={[
                        { before: new Date() },
                        { dayOfWeek: [0] },
                      ]}
                      modifiersClassNames={{
                        selected: "rdp-day_selected",
                        today: "rdp-day_today",
                      }}
                      styles={{
                        caption: { fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" },
                        head_cell: { fontSize: "0.75rem", color: "hsl(var(--muted-foreground))", fontWeight: 400 },
                        cell: { fontSize: "0.85rem" },
                        day: {
                          borderRadius: "0",
                          transition: "all 0.2s",
                        },
                      }}
                    />
                  </div>
                  {preferredDate && (
                    <p className="text-center text-sm text-foreground">
                      {t.booking.dateSelection} <span className="font-serif text-base">{format(preferredDate, "EEEE, d MMMM yyyy", { locale: dateLocale })}</span>
                    </p>
                  )}
                  {errors.date && <p className={`${errorCls} text-center`}>{errors.date}</p>}
                </div>
              )}

              {/* Step 2: Idea + Reference Photos */}
              {step === 2 && (
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

              {/* Step 3: Details */}
              {step === 3 && (
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

              {/* Step 4: Review */}
              {step === 4 && (
                <div className="space-y-6">
                  <h3 className="font-serif text-xl text-foreground mb-6">{t.booking.reviewTitle}</h3>
                  <div className="space-y-3 text-sm">
                    {[
                      [t.booking.reviewLabels.name, form.name],
                      [t.booking.reviewLabels.email, form.email],
                      [t.booking.reviewLabels.phone, form.phone],
                      ...(form.style ? [[t.booking.reviewLabels.style, form.style]] : []),
                      [t.booking.reviewLabels.date, preferredDate ? format(preferredDate, "d MMMM yyyy", { locale: dateLocale }) : "—"],
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

              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className={`flex justify-between ${isHero ? "mt-8" : "mt-10"}`}>
              {step > 0 || quizData ? (
                <motion.button
                  onClick={prev}
                  className="flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <ChevronLeft size={16} /> {t.booking.back}
                </motion.button>
              ) : <div />}
              {step < TOTAL_FORM_STEPS - 1 ? (
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
                  className="px-8 py-3 bg-primary text-primary-foreground text-sm tracking-[0.1em] uppercase hover:opacity-90 transition-opacity"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {t.booking.submit}
                </motion.button>
              )}
            </div>
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
