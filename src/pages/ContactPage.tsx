import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { addContactMessage, getSettings } from '../services/storeService';

interface ContactPageProps {
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onShowToast }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const settings = getSettings();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      onShowToast('Please fill out all contact form fields', 'error');
      return;
    }

    addContactMessage({
      name,
      email,
      subject,
      message
    });

    setIsSubmitted(true);
    onShowToast('✓ Message sent successfully! Our concierge will respond within 24 hours.', 'success');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="pb-20 space-y-16">
      
      {/* Page Header */}
      <section className="bg-[#F5F1EB] py-16 border-b border-[#EAE4DC] text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#9E7D58]">
            Customer Care & Concierge
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif-luxury font-bold text-[#1C1917] mt-2">
            Get In Touch
          </h1>
          <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto mt-4 leading-relaxed">
            Have questions about ingredients, custom routines, or orders? Our skincare specialists are here to guide you.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Contact Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-[#EAE4DC] shadow-xs space-y-6">
              <h3 className="text-xl font-serif-luxury font-bold text-[#1C1917] border-b border-stone-100 pb-4">
                LUMÉRA Headquarters
              </h3>

              <div className="space-y-5 text-xs text-stone-600">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] text-[#9E7D58] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block text-sm">Laboratory & Store</span>
                    <p className="mt-0.5 leading-relaxed">{settings.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] text-[#9E7D58] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block text-sm">Toll-Free Phone</span>
                    <p className="mt-0.5">{settings.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] text-[#9E7D58] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block text-sm">Concierge Email</span>
                    <p className="mt-0.5">{settings.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] text-[#9E7D58] flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block text-sm">Business Hours</span>
                    <p className="mt-0.5">Monday – Saturday: 9:00 AM – 7:00 PM IST</p>
                    <p className="text-[11px] text-stone-400">Sunday: Closed for laboratory formulation batching</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Preview Card */}
            <div className="rounded-3xl overflow-hidden border border-[#EAE4DC] shadow-xs relative bg-stone-100">
              <iframe
                title="LUMERA Skin Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.9739458925585!2d77.6384873!3d12.9735048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae16a77519965b%3A0xb3634fcbe4198168!2sIndiranagar%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1689000000000!5m2!1sen!2sin"
                className="w-full h-56 border-0"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right: Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#EAE4DC] shadow-sm">
              <span className="text-xs uppercase font-bold tracking-widest text-[#9E7D58]">Send a Note</span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#1C1917] mt-1 mb-6">
                Direct Skin Consultation & Inquiries
              </h2>

              {isSubmitted && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-800">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                  <div>
                    <p className="font-bold">Thank you for writing to us!</p>
                    <p className="text-emerald-700 mt-0.5">Your message has been logged in our system. A skincare concierge will get back to you shortly.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Pooja Hegde"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#9E7D58]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="pooja@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#9E7D58]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Subject / Concern *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Routine recommendation for barrier repair"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#9E7D58]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your skin goals, sensitivity history, or order inquiries..."
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#9E7D58]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-8 py-3.5 bg-[#1C1917] hover:bg-[#9E7D58] text-white rounded-xl text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
