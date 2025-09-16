
// app/lib/EventClient.js — tries SSE then falls back to polling
export class EventClient {
  constructor(baseUrl, jobId, { pollIntervalMs=1500, mode='auto' } = {}){
    this.baseUrl = (baseUrl || '').replace(/\/$/, '');
    this.jobId = jobId;
    this.pollIntervalMs = pollIntervalMs;
    this.mode = mode;
    this.cursor = 0;
    this.es = undefined;
    this.timer = undefined;
    this.listeners = new Set();
  }
  on(fn){ this.listeners.add(fn); return ()=>this.listeners.delete(fn); }
  emit(e){ this.listeners.forEach(fn => fn(e)); }

  async start(){
    if (this.mode === 'poll') return this.startPoll();
    try { await this.startSse(); } catch { await this.startPoll(); }
  }
  async startSse(){
    return new Promise((resolve, reject) => {
      const url = `${this.baseUrl}/api/jobs/${this.jobId}/stream`;
      const es = new EventSource(url);
      this.es = es;
      let opened = false;
      es.onopen = () => { opened = true; resolve(); };
      es.onerror = () => { this.stop(); if (!opened) reject(new Error('SSE not available')); };
      es.onmessage = (ev) => {
        if (!ev.data || ev.data.startsWith(':')) return;
        try {
          const obj = JSON.parse(ev.data);
          if (obj.seq) this.cursor = Math.max(this.cursor, obj.seq);
          this.emit(obj);
        } catch {}
      };
    });
  }
  async startPoll(){
    const tick = async () => {
      try {
        const res = await fetch(`${this.baseUrl}/api/jobs/${this.jobId}/events?cursor=${this.cursor}`, { cache: 'no-store' });
        const data = await res.json();
        const items = data.items || [];
        for (const it of items) {
          this.cursor = Math.max(this.cursor, it.seq);
          this.emit(it);
        }
      } catch {}
    };
    await tick();
    this.timer = setInterval(tick, this.pollIntervalMs);
  }
  stop(){
    if (this.es) { this.es.close(); this.es = undefined; }
    if (this.timer) { clearInterval(this.timer); this.timer = undefined; }
  }
}
