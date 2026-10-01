'use client';

import { useState } from 'react';
import { Sparkles, Loader2, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { AVAILABLE_MODELS } from '@/lib/ai/models';

const SUGGESTED_TOPICS = [
  'Top 10 Amazon Originals You Must Watch This Month',
  'Reacher vs Jack Ryan: Which Prime Show Wins?',
  'Best 4K Movies on Prime Video Right Now',
  'The Boys Season 4 — Everything You Need to Know',
  'How to Make the Most of Your Prime Video Subscription',
  'Best Family Movies on Prime Video in 2025',
];

interface AIGeneratorPanelProps {
  onGenerated: (data: {
    title: string;
    metaDescription: string;
    content: string;
    suggestedTags: string[];
  }) => void;
  disabled?: boolean;
}

export function AIGeneratorPanel({ onGenerated, disabled = false }: AIGeneratorPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0].id);
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Professional & Engaging');
  const [wordCount, setWordCount] = useState(900);
  const [keywords, setKeywords] = useState('');
  const [audience, setAudience] = useState('');

  const selectedModelInfo = AVAILABLE_MODELS.find((m) => m.id === selectedModel) || AVAILABLE_MODELS[0];

  async function handleGenerate() {
    if (!topic.trim()) { setError('Please enter a topic first.'); return; }
    setError(null);
    setIsGenerating(true);

    try {
      const res = await fetch('/api/blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          tone,
          keywords: keywords ? keywords.split(',').map((k) => k.trim()).filter(Boolean) : [],
          wordCount,
          audience: audience.trim() || undefined,
          model: selectedModel,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');

      onGenerated(data);
      setHasGenerated(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div style={{
      background: 'rgba(0,168,225,0.04)',
      border: '1px solid rgba(0,168,225,0.2)',
      borderRadius: '14px',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '16px 20px',
          background: 'rgba(0,168,225,0.08)', border: 'none',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={16} color="#00a8e1" />
          <span style={{ fontWeight: 700, fontSize: '14px', color: '#00a8e1' }}>
            AI Blog Generator
          </span>
          {hasGenerated && (
            <span style={{
              fontSize: '10px', padding: '2px 8px', borderRadius: '4px',
              background: 'rgba(0,200,83,0.15)', color: '#00c853',
              border: '1px solid rgba(0,200,83,0.25)', fontWeight: 700,
            }}>
              ✓ Generated
            </span>
          )}
        </div>
        {isOpen ? <ChevronUp size={14} color="rgba(255,255,255,0.4)" /> : <ChevronDown size={14} color="rgba(255,255,255,0.4)" />}
      </button>

      {isOpen && (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Model Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: '8px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              AI Model
            </label>
            <div className="ai-models-grid">
              {AVAILABLE_MODELS.map((model) => {
                const isSelected = selectedModel === model.id;
                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => setSelectedModel(model.id)}
                    disabled={disabled || isGenerating}
                    style={{
                      padding: '10px 8px', borderRadius: '8px', textAlign: 'left',
                      cursor: 'pointer', border: 'none', transition: 'all 0.15s',
                      background: isSelected ? 'rgba(0,168,225,0.15)' : 'rgba(255,255,255,0.04)',
                      outline: isSelected ? '1px solid rgba(0,168,225,0.5)' : '1px solid rgba(255,255,255,0.06)',
                      opacity: disabled || isGenerating ? 0.5 : 1,
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: 700, color: isSelected ? '#00a8e1' : '#fff', marginBottom: '3px' }}>
                      {model.name}
                    </div>
                    <div style={{ fontSize: '10px', color: isSelected ? '#00a8e1' : 'rgba(255,255,255,0.35)' }}>
                      {model.badge}
                    </div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                      ⏱ {model.speed}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Topic */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: '6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Topic / Title <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Top 10 Amazon Originals to Watch This Weekend"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={disabled || isGenerating}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff', fontSize: '13px', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {/* Quick Suggestions */}
            <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {SUGGESTED_TOPICS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setTopic(s)}
                  disabled={disabled || isGenerating}
                  style={{
                    fontSize: '10px', padding: '3px 8px', borderRadius: '4px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
                    maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Tone + Word Count row */}
          <div className="ai-tone-grid">
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: '6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                disabled={disabled || isGenerating}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                  color: '#fff', fontSize: '12px', cursor: 'pointer',
                }}
              >
                <option value="Professional & Engaging">Professional & Engaging</option>
                <option value="Conversational & Fun">Conversational & Fun</option>
                <option value="Deep Analytical">Deep Analytical</option>
                <option value="Listicle & Punchy">Listicle & Punchy</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: '6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Length
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[600, 900, 1200].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setWordCount(count)}
                    disabled={disabled || isGenerating}
                    style={{
                      flex: 1, padding: '10px 4px', borderRadius: '8px',
                      fontSize: '11px', fontWeight: 700, cursor: 'pointer', border: 'none',
                      background: wordCount === count ? '#00a8e1' : 'rgba(255,255,255,0.05)',
                      color: wordCount === count ? '#fff' : 'rgba(255,255,255,0.4)',
                      outline: wordCount === count ? 'none' : '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    ~{count}w
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: '6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              SEO Keywords (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Amazon Originals, Prime Video 2025, streaming shows"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              disabled={disabled || isGenerating}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff', fontSize: '12px', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Audience */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: '6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Target Audience
            </label>
            <input
              type="text"
              placeholder="e.g. Movie lovers, binge-watchers, Prime subscribers in India"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              disabled={disabled || isGenerating}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff', fontSize: '12px', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: '8px',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
              color: '#fca5a5', fontSize: '12px',
            }}>
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="ai-actions-row">
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
              Using <strong style={{ color: '#00a8e1' }}>{selectedModelInfo.name}</strong> · Generates title, meta, content & tags
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {hasGenerated && (
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={disabled || isGenerating}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '9px 16px', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  {isGenerating ? <Loader2 size={13} className="spin" /> : <RefreshCw size={13} />}
                  Regenerate
                </button>
              )}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={disabled || isGenerating || (!hasGenerated && false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '9px 20px', borderRadius: '8px',
                  background: hasGenerated ? 'rgba(0,168,225,0.15)' : '#00a8e1',
                  border: hasGenerated ? '1px solid rgba(0,168,225,0.3)' : 'none',
                  color: hasGenerated ? '#00a8e1' : '#fff',
                  fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                  opacity: disabled || isGenerating ? 0.6 : 1,
                }}
              >
                {isGenerating ? (
                  <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</>
                ) : hasGenerated ? (
                  <><Sparkles size={13} /> Generate Again</>
                ) : (
                  <><Sparkles size={13} /> Generate Draft</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .ai-models-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        .ai-tone-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .ai-actions-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-top: 4px;
        }
        @media (max-width: 600px) {
          .ai-models-grid {
            grid-template-columns: 1fr;
          }
          .ai-tone-grid {
            grid-template-columns: 1fr;
          }
          .ai-actions-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .ai-actions-row > div {
            width: 100%;
            display: flex;
            flex-direction: column;
          }
          .ai-actions-row button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
