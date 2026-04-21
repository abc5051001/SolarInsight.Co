import { useState } from "react";
import { motion } from "motion/react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function BookAuditModal({ open, onClose }: Props) {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", address: "", panels: "", message: "",
  });
  const [formSent, setFormSent] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        className="absolute inset-0 bg-black/70 backdrop-blur-sm w-full cursor-default"
        onClick={onClose}
        aria-label="Close modal"
      />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-white/8 backdrop-blur-[80px] border border-white/15 rounded-2xl w-full max-w-lg p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/40 hover:text-white text-xl leading-none"
        >
          ✕
        </button>
        <div>
          <p className="font-mono text-xs text-[#4ADE80] tracking-widest">FREE AUDIT</p>
          <h3 className="mt-2 text-2xl font-medium text-white">Book your free solar audit</h3>
          <p className="mt-1 text-[13px] text-white/50">
            We'll assess your system and soiling exposure — no cost, no commitment.
          </p>
        </div>

        {formSent ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <span className="text-4xl">☀️</span>
            <p className="text-white font-medium">Request received!</p>
            <p className="text-white/50 text-sm">We'll be in touch within one business day.</p>
          </div>
        ) : (
          <form
            className="flex flex-col gap-4"
            onSubmit={e => { e.preventDefault(); setFormSent(true); }}
          >
            {[
              { id: "name",    label: "Full Name",                    type: "text",  placeholder: "Jane Smith" },
              { id: "email",   label: "Email",                        type: "email", placeholder: "jane@example.com" },
              { id: "phone",   label: "Phone",                        type: "tel",   placeholder: "(703) 555-0100" },
              { id: "address", label: "Property Address",             type: "text",  placeholder: "1234 Oak St, Arlington, VA" },
              { id: "panels",  label: "Approx. Panel Count (optional)", type: "text", placeholder: "e.g. 24" },
            ].map(({ id, label, type, placeholder }) => (
              <div key={id} className="flex flex-col gap-1">
                <label className="font-mono text-[10px] text-white/40 tracking-widest uppercase">{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={formData[id as keyof typeof formData]}
                  onChange={e => setFormData(d => ({ ...d, [id]: e.target.value }))}
                  className="bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors"
                  required={id !== "panels"}
                />
              </div>
            ))}
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[10px] text-white/40 tracking-widest uppercase">Message (optional)</label>
              <textarea
                rows={3}
                placeholder="Any details about your system or concerns..."
                value={formData.message}
                onChange={e => setFormData(d => ({ ...d, message: e.target.value }))}
                className="bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="mt-2 bg-[#4ADE80] text-black font-mono text-xs font-bold tracking-widest py-4 rounded-lg hover:bg-[#22c55e] transition-colors"
            >
              SUBMIT REQUEST
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
