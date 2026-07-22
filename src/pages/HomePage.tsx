import { Link } from 'react-router-dom'
import { PlusCircle, Search, Settings, ShieldCheck, Clock, Mail, Wrench, Network, Monitor, KeyRound, HelpCircle } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="container fade-in">
      {/* Hero */}
      <section style={{
        textAlign: 'center',
        padding: '64px 0 48px',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          padding: '6px 16px',
          borderRadius: '100px',
          fontSize: '13px',
          fontWeight: '600',
          marginBottom: '24px',
        }}>
          <ShieldCheck size={14} /> Trusted by 500+ teams
        </div>
        <h1 style={{ fontSize: '48px', fontWeight: 700, color: 'var(--neutral-900)', marginBottom: '16px', letterSpacing: '-1px' }}>
          Tech problems?<br />We've got you covered.
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--neutral-500)', maxWidth: '560px', margin: '0 auto 32px' }}>
          Submit a support ticket in under two minutes. Track its progress in real time and get notified when it's resolved.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/create">
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PlusCircle size={18} /> Create a Ticket
            </button>
          </Link>
          <Link to="/track">
            <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Search size={18} /> Track a Ticket
            </button>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '64px',
      }}>
        {[
          { icon: Clock, label: 'Avg Response', value: '< 2 hours' },
          { icon: ShieldCheck, label: 'Resolution Rate', value: '98.5%' },
          { icon: Mail, label: 'Tickets Solved', value: '12,000+' },
          { icon: Settings, label: 'Support Agents', value: '24/7' },
        ].map((stat) => (
          <div key={stat.label} className="card" style={{ textAlign: 'center', padding: '28px 20px' }}>
            <stat.icon size={28} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--neutral-900)' }}>{stat.value}</div>
            <div style={{ fontSize: '13px', color: 'var(--neutral-500)', marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section style={{ marginBottom: '64px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--neutral-900)', marginBottom: '8px' }}>What can we help with?</h2>
        <p style={{ color: 'var(--neutral-500)', marginBottom: '32px' }}>We troubleshoot a wide range of technical issues across five categories.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {[
            { icon: Monitor, title: 'Hardware', desc: 'Laptops, servers, peripherals, and device failures.' },
            { icon: Wrench, title: 'Software', desc: 'App crashes, installation issues, and software bugs.' },
            { icon: Network, title: 'Network', desc: 'Connectivity, VPN, firewall, and internet problems.' },
            { icon: KeyRound, title: 'Account', desc: 'Login issues, password resets, and access management.' },
            { icon: HelpCircle, title: 'Other', desc: 'Anything else tech-related that needs troubleshooting.' },
          ].map((cat) => (
            <div key={cat.title} className="card" style={{ transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '10px',
                background: 'var(--primary-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <cat.icon size={22} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 600, marginBottom: '6px' }}>{cat.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--neutral-500)' }}>{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ marginBottom: '64px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--neutral-900)', marginBottom: '32px' }}>How it works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          {[
            { step: '1', title: 'Submit a Ticket', desc: 'Describe your issue, pick a category and priority, and share your contact info.' },
            { step: '2', title: 'We Investigate', desc: 'Our team reviews your ticket, updates the status, and starts troubleshooting.' },
            { step: '3', title: 'Track Progress', desc: 'Check your ticket status anytime using your ticket number and email.' },
            { step: '4', title: 'Get Notified', desc: 'Receive an email notification when your ticket is resolved or updated.' },
          ].map((item) => (
            <div key={item.step} style={{ display: 'flex', gap: '16px' }}>
              <div style={{
                flexShrink: 0,
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'var(--primary)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', fontWeight: 700,
              }}>
                {item.step}
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--neutral-500)' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
