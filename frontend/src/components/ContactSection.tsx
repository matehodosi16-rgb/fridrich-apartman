import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";

const ContactSection = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    houseNumber: "",
    city: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const recipient = "fridrichapartman@gmail.com";
    const subject = encodeURIComponent(
      `${t("contact.emailSubject")} – ${formData.name}`
    );

    const body = encodeURIComponent(
      `${t("contact.emailBody")}\\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n\\n` +
      `${t("contact.name")}: ${formData.name}\\n` +
      `E-mail: ${formData.email}\\n` +
      `${t("contact.phone")}: ${formData.phone}\\n` +
      `${t("contact.address")}: ${formData.street} ${formData.houseNumber}, ${formData.city}\\n\\n` +
      `${t("contact.message")}:\\n${formData.message || "—"}\\n`
    );

    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;

    setTimeout(() => {
      toast({
        title: t("contact.toastTitle"),
        description: t("contact.toastDesc"),
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section id="contact" className="bg-white px-6 py-20 md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[#C8956C]">
            {t("contact.label")}
          </p>
          <h2 className="font-script mb-4 text-4xl font-bold text-[#1B3A4B] md:text-5xl">
            {t("contact.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[#8A9BA8]">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-5">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name & Email */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#1B3A4B]">{t("contact.name")}</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t("contact.namePlaceholder")}
                    required
                    className="border-[#1B3A4B]/20 focus:border-[#C8956C] focus:ring-[#C8956C]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#1B3A4B]">{t("contact.email")}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t("contact.emailPlaceholder")}
                    required
                    className="border-[#1B3A4B]/20 focus:border-[#C8956C] focus:ring-[#C8956C]"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#1B3A4B]">{t("contact.phone")}</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t("contact.phonePlaceholder")}
                  required
                  className="border-[#1B3A4B]/20 focus:border-[#C8956C] focus:ring-[#C8956C]"
                />
              </div>

              {/* Address: Street, House Number, City */}
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="street" className="text-[#1B3A4B]">{t("contact.street")}</Label>
                  <Input
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder={t("contact.streetPlaceholder")}
                    required
                    className="border-[#1B3A4B]/20 focus:border-[#C8956C] focus:ring-[#C8956C]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="houseNumber" className="text-[#1B3A4B]">{t("contact.houseNumber")}</Label>
                  <Input
                    id="houseNumber"
                    name="houseNumber"
                    value={formData.houseNumber}
                    onChange={handleChange}
                    placeholder={t("contact.houseNumberPlaceholder")}
                    required
                    className="border-[#1B3A4B]/20 focus:border-[#C8956C] focus:ring-[#C8956C]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-[#1B3A4B]">{t("contact.city")}</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder={t("contact.cityPlaceholder")}
                    required
                    className="border-[#1B3A4B]/20 focus:border-[#C8956C] focus:ring-[#C8956C]"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-[#1B3A4B]">{t("contact.message")}</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t("contact.messagePlaceholder")}
                  rows={5}
                  className="border-[#1B3A4B]/20 focus:border-[#C8956C] focus:ring-[#C8956C]"
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-[#C8956C] py-6 text-base font-semibold text-white transition hover:bg-[#B07D56] sm:w-auto sm:px-12"
              >
                {isSubmitting ? t("contact.submitting") : t("contact.submit")}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-xl bg-[#F5F0EB] p-6">
              <h3 className="font-playfair mb-6 text-xl font-bold text-[#1B3A4B]">
                {t("contact.info")}
              </h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C8956C]/20">
                    <Mail className="h-5 w-5 text-[#C8956C]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1B3A4B]">E-mail</p>
                    <p className="text-sm text-[#8A9BA8]">fridrichapartman@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C8956C]/20">
                    <Phone className="h-5 w-5 text-[#C8956C]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1B3A4B]">{t("contact.phone")}</p>
                    <p className="text-sm text-[#8A9BA8]">+421 905 647 155</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C8956C]/20">
                    <MapPin className="h-5 w-5 text-[#C8956C]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1B3A4B]">{t("contact.address")}</p>
                    <p className="text-sm text-[#8A9BA8]">Čičovská 53, Veľký Meder</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="rounded-xl border border-[#C8956C]/20 bg-white p-6">
              <h4 className="mb-4 font-semibold text-[#1B3A4B]">{t("contact.whyUs")}</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#8A9BA8]">{t("contact.rating")}</span>
                  <span className="font-semibold text-[#1B3A4B]">⭐ 9.2/10</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#8A9BA8]">{t("contact.responseTime")}</span>
                  <span className="font-semibold text-[#1B3A4B]">{t("contact.responseTimeVal")}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#8A9BA8]">{t("contact.happyGuests")}</span>
                  <span className="font-semibold text-[#1B3A4B]">500+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#8A9BA8]">{t("contact.cancellation")}</span>
                  <span className="font-semibold text-[#1B3A4B]">{t("contact.cancellationVal")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;