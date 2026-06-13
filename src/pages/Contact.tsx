import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const Contact: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Info Cards */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
          {[
            { icon: <Phone />, title: "Call Us", val: "+1 234 567 890" },
            { icon: <Mail />, title: "Email Us", val: "support@nexusstore.com" },
            { icon: <MapPin />, title: "Visit Us", val: "123 Commerce St, NY 10001" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-5 p-6 bg-white border rounded-2xl shadow-sm">
              <div className="p-3 bg-blue-50 text-[#0d6efd] rounded-lg">{item.icon}</div>
              <div>
                <h4 className="font-bold text-gray-900">{item.title}</h4>
                <p className="text-gray-500 text-sm">{item.val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="lg:col-span-2 bg-white p-8 md:p-12 border rounded-3xl shadow-sm">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Full Name" placeholder="Your name" />
            <Input label="Email Address" placeholder="Your email" />
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Message</label>
              <textarea 
                rows={5} 
                className="w-full px-4 py-3 border rounded-lg outline-none focus:border-[#0d6efd] focus:ring-4 focus:ring-blue-50 transition-all"
                placeholder="How can we help you?"
              />
            </div>
            <Button className="md:w-fit flex items-center justify-center gap-2">
              <Send size={18} /> Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};