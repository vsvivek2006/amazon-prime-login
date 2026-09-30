'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function PrimeFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is Amazon Prime Video and what is included with membership?',
      a: 'Prime Video is a premium streaming entertainment service offering thousands of movies, TV episodes, live sports, and award-winning Amazon Originals such as The Boys, Fallout, The Lord of the Rings: The Rings of Power, Reacher, and Citadel. It also includes fast, free delivery on Amazon shopping and ad-free music with Amazon Music Prime.',
    },
    {
      q: 'How much does Amazon Prime Video cost?',
      a: 'You can enjoy Prime Video as part of an Amazon Prime membership. New subscribers can get started with a 30-day free trial. After the trial, membership plans start at ₹299 per month or ₹1,499 per year, with full access to Prime Video, Prime Shopping benefits, and Prime Music.',
    },
    {
      q: 'How many devices can stream Prime Video at the same time?',
      a: 'You can stream up to three titles at the same time using the same Amazon account, and you can stream the same title to no more than two devices concurrently.',
    },
    {
      q: 'Can I download movies and TV shows to watch offline?',
      a: 'Yes! With the Download and Go feature on iOS, iPadOS, Android, and Windows 10/11 Prime Video apps, you can easily download select movies and full TV seasons to watch offline on flights, road trips, or wherever you lack internet access.',
    },
    {
      q: 'What are Prime Video Channels and how do they work?',
      a: 'Prime Video Channels allows Prime members to add specialty subscriptions (such as Lionsgate Play, Discovery+, SonyLIV, and more) directly into their Prime Video app without needing separate apps or logins. You only pay for the channels you want and can cancel anytime.',
    },
    {
      q: 'How do I cancel my Prime Video subscription?',
      a: 'You can easily cancel your membership online at any time by visiting Your Account > Prime Membership and selecting End Membership. You will retain access until the end of your billing cycle.',
    },
  ];

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="pv-faq-section" id="faq">
      <div className="pv-container">
        <h2 className="pv-faq-title">Frequently Asked Questions</h2>

        <div className="pv-faq-list">
          {faqs.map((faq, i) => (
            <div key={i} className="pv-faq-item">
              <button
                type="button"
                className="pv-faq-question"
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
              >
                <span>{faq.q}</span>
                {openIndex === i ? <ChevronUp size={20} color="#00a8e1" /> : <ChevronDown size={20} />}
              </button>
              {openIndex === i && <div className="pv-faq-answer">{faq.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
