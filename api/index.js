import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://ogzgimhnunkdhhkpwqbm.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nemdpbWhudW5rZGhoa3B3cWJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2Mjc3NDEsImV4cCI6MjA4ODIwMzc0MX0.PMuv-YKKvmE_vtWxw4CCjoy8qHzLjHo-dgM0StFdkKQ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DEFAULT_TITLE = 'SocialMix';
const DEFAULT_DESC = 'Connecting you to the content...';
const APP_HOST = 'socialmixconnect.vercel.app';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.socialmix.app';

// Button label per content type — mirrors WhatsApp's "Join Group" pattern
function getPrimaryLabel(type) {
  const labels = {
    group:    '👥 Join Group on SocialMix',
    food:     '🍽️ View Restaurant on SocialMix',
    property: '🏠 View Property on SocialMix',
    product:  '🛍️ View Product on SocialMix',
    agro:     '🌿 View Listing on SocialMix',
    tour:     '🎥 View Virtual Tour on SocialMix',
    reel:     '▶️ Watch Reel on SocialMix',
    user:     '👤 View Profile on SocialMix',
    chat:     '💬 Open Chat on SocialMix',
  };
  return labels[type] || '📱 View on SocialMix';
}

// Sanitise text to prevent XSS via OG data
const safe = (str) => String(str || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

// WhatsApp chat wallpaper doodle (subtle, no external asset)
const WALLPAPER = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cg fill='none' stroke='%234C1D95' stroke-opacity='0.07' stroke-width='1.3' stroke-linecap='round'%3E%3Ccircle cx='22' cy='22' r='7'/%3E%3Cpath d='M64 15v14M57 22h14'/%3E%3Cpath d='M96 26c7-9 16-4 11 5'/%3E%3Ccircle cx='34' cy='86' r='4.5'/%3E%3Cpath d='M76 74l10 10M86 74l-10 10'/%3E%3Cpath d='M112 96c-9 0-9-11 0-11s9 11 0 11'/%3E%3Cpath d='M12 116h16'/%3E%3Cpath d='M60 120a9 9 0 0118 0'/%3E%3Cpath d='M104 34v10M100 39h8'/%3E%3Cpath d='M20 58c5-6 12-2 8 4'/%3E%3C/g%3E%3C/svg%3E\")";

// WhatsApp-style landing page builder
function renderHtml(ogTitle, ogDesc, ogImage, path, contentType) {
  const safeTitle = safe(ogTitle);
  const safeDesc = safe(ogDesc);
  const safeImage = ogImage ? safe(ogImage) : '';
  const storeUrl = `${PLAY_STORE_URL}&referrer=${encodeURIComponent(path)}`;
  const primaryLabel = getPrimaryLabel(contentType);

  const imageTag = safeImage
    ? `<meta property="og:image" content="${safeImage}">\n    <meta name="twitter:image" content="${safeImage}">\n    <meta property="og:image:alt" content="${safeTitle}">`
    : '';

  const previewMedia = safeImage
    ? `<img class="lc-img" src="${safeImage}" alt="${safeTitle}" loading="eager" decoding="async">`
    : `<div class="lc-img lc-img-ph"><span>S</span></div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>${safeTitle} · SocialMix</title>
    <meta name="theme-color" content="#4C1D95">
    <meta name="description" content="${safeDesc}">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://${APP_HOST}${path}">
    <meta property="og:title" content="${safeTitle}">
    <meta property="og:description" content="${safeDesc}">
    <meta property="og:site_name" content="SocialMix">
    ${imageTag}

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${safeTitle}">
    <meta name="twitter:description" content="${safeDesc}">

    <style>
        /* SocialMix brand palette, mapped onto WhatsApp's UI roles */
        :root {
            --sm-header: #4C1D95;      /* deep violet app bar */
            --sm-header-deep: #3B1478;
            --sm-brand: #8B5CF6;
            --sm-action: #7C3AED;      /* primary CTA */
            --sm-action-press: #6D28D9;
            --sm-in: #FFFFFF;          /* incoming bubble */
            --sm-out: #EDE4FF;         /* outgoing bubble (lavender) */
            --sm-wall: #F3EFFB;        /* chat wallpaper */
            --sm-text: #1A1033;
            --sm-muted: #6B6482;
            --sm-hair: #E9E3F5;
            --sm-tick: #7C3AED;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html { -webkit-text-size-adjust: 100%; }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background: radial-gradient(120% 120% at 50% 0%, #F8F5FE 0%, #EDE6F9 55%, #DCD1EF 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            color: var(--sm-text);
            -webkit-font-smoothing: antialiased;
        }

        /* ── Device shell ── */
        .phone {
            width: 100%;
            max-width: 392px;
            height: min(844px, calc(100vh - 48px));
            display: flex;
            flex-direction: column;
            background: var(--sm-wall);
            border-radius: 40px;
            overflow: hidden;
            box-shadow:
                0 44px 90px -24px rgba(43, 22, 82, 0.42),
                0 12px 28px -12px rgba(43, 22, 82, 0.26),
                0 0 0 1px rgba(43, 22, 82, 0.08);
            animation: rise 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }

        @keyframes rise {
            from { opacity: 0; transform: translateY(26px) scale(0.985); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── Status bar ── */
        .statusbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            height: 30px;
            padding: 0 20px;
            background: var(--sm-header);
            color: #fff;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 0.2px;
            flex: 0 0 auto;
        }
        .statusbar .sb-right { display: flex; align-items: center; gap: 6px; }
        .statusbar svg { display: block; }

        /* ── WhatsApp header ── */
        .wa-header {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 8px 10px 4px;
            background: var(--sm-header);
            color: #fff;
            flex: 0 0 auto;
            position: relative;
            z-index: 3;
        }
        .icon-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 34px;
            height: 34px;
            border: 0;
            background: transparent;
            color: #fff;
            border-radius: 50%;
            flex: 0 0 auto;
            opacity: 0.95;
        }
        .avatar {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: linear-gradient(140deg, #C4B5FD 0%, #8B5CF6 45%, #7C3AED 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 18px;
            color: #fff;
            flex: 0 0 auto;
            box-shadow: inset 0 0 0 1.5px rgba(255, 255, 255, 0.35);
            letter-spacing: -0.5px;
        }
        .hdr-text { min-width: 0; flex: 1; }
        .hdr-name {
            font-size: 16.5px;
            font-weight: 600;
            line-height: 1.25;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .hdr-sub {
            font-size: 12.5px;
            color: rgba(255, 255, 255, 0.82);
            line-height: 1.3;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .hdr-sub .dot {
            width: 6px; height: 6px; border-radius: 50%;
            background: #6EE7A8;
            box-shadow: 0 0 0 2px rgba(110, 231, 168, 0.25);
        }
        .hdr-actions { display: flex; align-items: center; gap: 2px; flex: 0 0 auto; }

        /* ── Chat area ── */
        .chat {
            flex: 1 1 auto;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 12px 10px 16px;
            background-color: var(--sm-wall);
            background-image: ${WALLPAPER};
            background-size: 140px 140px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
        }
        .chat::-webkit-scrollbar { display: none; }

        .date-chip {
            align-self: center;
            background: #fff;
            color: #5F5A73;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.7px;
            text-transform: uppercase;
            padding: 5px 12px;
            border-radius: 8px;
            box-shadow: 0 1px 0.5px rgba(11, 20, 26, 0.13);
            margin-top: auto; /* bottom-anchor the conversation like WhatsApp */
            margin-bottom: 2px;
            flex: 0 0 auto;
        }

        .row { display: flex; }
        .row.in { justify-content: flex-start; }
        .row.out { justify-content: flex-end; }

        .bubble {
            position: relative;
            max-width: 88%;
            border-radius: 9px;
            box-shadow: 0 1px 0.5px rgba(11, 20, 26, 0.13);
            animation: pop 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes pop {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        .bubble.in {
            background: var(--sm-in);
            border-top-left-radius: 2px;
            text-decoration: none;
            color: inherit;
            display: block;
        }
        .bubble.in::before {
            content: "";
            position: absolute;
            top: 0;
            left: -7px;
            width: 8px;
            height: 12px;
            background: var(--sm-in);
            clip-path: polygon(0 0, 100% 0, 100% 100%);
        }

        /* ── Link preview card (the marketplace preview) ── */
        .lc-img {
            display: block;
            width: 100%;
            aspect-ratio: 16 / 10;
            object-fit: cover;
            background: #F0F2F5;
            border-top-left-radius: 2px;
            border-top-right-radius: 9px;
        }
        .lc-img-ph {
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(140deg, #8B5CF6 0%, #7C3AED 45%, #4C1D95 100%);
        }
        .lc-img-ph span {
            width: 62px;
            height: 62px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.16);
            border: 1.5px solid rgba(255, 255, 255, 0.55);
            color: #fff;
            font-size: 30px;
            font-weight: 800;
            letter-spacing: -0.5px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 24px -10px rgba(23, 8, 48, 0.7);
        }

        .lc-body { padding: 8px 11px 2px; }

        .lc-title {
            font-size: 15px;
            font-weight: 600;
            line-height: 1.32;
            color: var(--sm-text);
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            margin-bottom: 3px;
        }

        .lc-desc {
            font-size: 13.5px;
            line-height: 1.42;
            color: var(--sm-muted);
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .lc-domain {
            display: flex;
            align-items: center;
            gap: 5px;
            margin-top: 6px;
            font-size: 12.5px;
            color: var(--sm-muted);
            letter-spacing: 0.1px;
        }
        .lc-domain svg { flex: 0 0 auto; opacity: 0.85; }

        .lc-meta {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 4px;
            padding: 1px 11px 6px;
            font-size: 11px;
            color: var(--sm-muted);
        }
        .lc-meta .tick { color: var(--sm-tick); display: flex; }

        /* ── System notice (WhatsApp style) ── */
        .sys-note {
            align-self: center;
            max-width: 84%;
            text-align: center;
            background: #FFFFFF;
            color: #6B6482;
            font-size: 12.5px;
            line-height: 1.4;
            padding: 6px 12px;
            border-radius: 8px;
            border: 1px solid var(--sm-hair);
            box-shadow: 0 1px 0.5px rgba(43, 22, 82, 0.08);
            margin-top: 4px;
        }

        .bubble.out {
            background: var(--sm-out);
            border-top-right-radius: 2px;
            padding: 6px 10px 5px;
            font-size: 14.5px;
            line-height: 1.38;
            display: flex;
            align-items: flex-end;
            gap: 8px;
            flex-wrap: wrap;
            justify-content: flex-end;
        }
        .bubble.out .msg { flex: 0 1 auto; }
        .bubble.out .stamp {
            margin-left: auto;
            display: flex;
            align-items: center;
            gap: 3px;
            font-size: 11px;
            color: #6B6482;
            white-space: nowrap;
            position: relative;
            top: 3px;
        }
        .bubble.out::before {
            content: "";
            position: absolute;
            top: 0;
            right: -7px;
            width: 8px;
            height: 12px;
            background: var(--sm-out);
            clip-path: polygon(0 0, 100% 0, 0 100%);
        }

        /* ── Action bar ── */
        .cta-bar {
            flex: 0 0 auto;
            background: #fff;
            padding: 12px 16px 8px;
            border-top: 1px solid var(--sm-hair);
            box-shadow: 0 -8px 22px rgba(11, 20, 26, 0.06);
            position: relative;
            z-index: 4;
        }

        .btn-primary {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            min-height: 50px;
            padding: 13px 18px;
            border-radius: 26px;
            background: var(--sm-action);
            color: #fff;
            font-size: 16px;
            font-weight: 600;
            text-decoration: none;
            letter-spacing: 0.1px;
            transition: transform 0.14s ease, background 0.14s ease;
        }
        .btn-primary:hover { background: #6D28D9; }
        .btn-primary:active { transform: scale(0.975); background: var(--sm-action-press); }

        .btn-secondary {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 7px;
            margin: 10px auto 2px;
            padding: 4px 6px;
            font-size: 13.5px;
            font-weight: 500;
            color: var(--sm-header);
            text-decoration: none;
        }
        .btn-secondary svg { flex: 0 0 auto; }

        /* ── Composer (WhatsApp input row) ── */
        .composer {
            flex: 0 0 auto;
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 8px;
            padding-bottom: calc(6px + env(safe-area-inset-bottom));
            background: #fff;
            border-top: 1px solid var(--sm-hair);
        }
        .composer .field {
            flex: 1 1 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            height: 42px;
            padding: 0 12px 0 16px;
            background: #fff;
            border: 1px solid var(--sm-hair);
            border-radius: 22px;
            color: #8B85A0;
            font-size: 15.5px;
            box-shadow: 0 1px 2px rgba(11, 20, 26, 0.05);
        }
        .composer .field svg { color: #8B85A0; flex: 0 0 auto; }
        .mic {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            background: var(--sm-action);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 0 0 auto;
            box-shadow: 0 2px 6px rgba(124, 58, 237, 0.35);
        }

        /* ── Small screens: full-bleed app feel ── */
        @media (max-width: 560px) {
            body {
                padding: 0;
                background: var(--sm-wall);
                align-items: stretch;
                min-height: 100dvh;
            }
            .phone {
                max-width: none;
                height: 100vh;
                height: 100dvh;
                border-radius: 0;
                box-shadow: none;
                animation: none;
            }
            .statusbar { display: none; }
            .wa-header { padding-top: calc(10px + env(safe-area-inset-top)); }
        }

        @media (prefers-reduced-motion: reduce) {
            .phone, .bubble { animation: none !important; }
            .btn-primary { transition: none; }
        }
    </style>
</head>
<body>
    <div class="phone">
        <div class="statusbar">
            <span data-live-time>9:41</span>
            <span class="sb-right">
                <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor" aria-hidden="true">
                    <rect x="0" y="7.5" width="3" height="3.5" rx="1"/>
                    <rect x="4.7" y="5" width="3" height="6" rx="1"/>
                    <rect x="9.4" y="2.5" width="3" height="8.5" rx="1"/>
                    <rect x="14.1" y="0" width="3" height="11" rx="1"/>
                </svg>
                <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" aria-hidden="true">
                    <path d="M8 11.2 1.1 4.3a9.8 9.8 0 0 1 13.8 0L8 11.2Z" opacity=".95"/>
                </svg>
                <svg width="25" height="12" viewBox="0 0 25 12" fill="none" aria-hidden="true">
                    <rect x="0.6" y="0.6" width="20.8" height="10.8" rx="3" stroke="currentColor" stroke-opacity=".55"/>
                    <rect x="2.2" y="2.2" width="15.6" height="7.6" rx="1.8" fill="currentColor"/>
                    <path d="M23.2 4.1v3.8c1.1-.35 1.6-.95 1.6-1.9s-.5-1.55-1.6-1.9Z" fill="currentColor" fill-opacity=".55"/>
                </svg>
            </span>
        </div>

        <header class="wa-header">
            <span class="icon-btn" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M15 4 7 12l8 8"/>
                </svg>
            </span>
            <div class="avatar">S</div>
            <div class="hdr-text">
                <div class="hdr-name">SocialMix</div>
                <div class="hdr-sub"><span class="dot"></span>online</div>
            </div>
            <div class="hdr-actions">
                <span class="icon-btn" aria-hidden="true">
                    <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h5A2.5 2.5 0 0 1 14 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-5A2.5 2.5 0 0 1 4 16.5v-9Zm11.4 2.2 3.9-2.6c.7-.5 1.7 0 1.7.9v8c0 .9-1 1.4-1.7.9l-3.9-2.6v-4.6Z"/>
                    </svg>
                </span>
                <span class="icon-btn" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6.7 3.3c.5-.5 1.3-.5 1.8 0l2 2c.5.5.5 1.3 0 1.8l-1 1c-.2.2-.2.5 0 .7a12 12 0 0 0 3.9 3.9c.2.2.5.2.7 0l1-1c.5-.5 1.3-.5 1.8 0l2 2c.5.5.5 1.3 0 1.8l-1.2 1.2c-.9.9-2.2 1.3-3.4.9a18.5 18.5 0 0 1-10.7-10.7c-.4-1.2 0-2.5.9-3.4l1.2-1.2Z"/>
                    </svg>
                </span>
                <span class="icon-btn" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="5" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="12" cy="19" r="1.9"/>
                    </svg>
                </span>
            </div>
        </header>

        <main class="chat">
            <div class="date-chip">Today</div>

            <div class="row in">
                <a class="bubble in" data-open-app href="${storeUrl}">
                    ${previewMedia}
                    <div class="lc-body">
                        <div class="lc-title">${safeTitle}</div>
                        <div class="lc-desc">${safeDesc}</div>
                        <div class="lc-domain">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M10.5 13.5a4 4 0 0 0 5.7 0l2.6-2.6a4 4 0 0 0-5.7-5.7l-1.5 1.5"/>
                                <path d="M13.5 10.5a4 4 0 0 0-5.7 0l-2.6 2.6a4 4 0 0 0 5.7 5.7l1.5-1.5"/>
                            </svg>
                            ${APP_HOST}
                        </div>
                    </div>
                    <div class="lc-meta">
                        <span data-live-time>10:24</span>
                    </div>
                </a>
            </div>

            <div class="sys-note">This link opens in the SocialMix app</div>

            <div class="row out">
                <div class="bubble out">
                    <span class="msg">Saw this on SocialMix 👀</span>
                    <span class="stamp">
                        <span data-live-time>10:24</span>
                        <svg class="tick" width="16" height="11" viewBox="0 0 18 12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M1.5 6.6 4.6 9.7 11.2 2.6"/>
                            <path d="M7 6.6 10.1 9.7 16.7 2.6"/>
                        </svg>
                    </span>
                </div>
            </div>
        </main>

        <div class="cta-bar">
            <a class="btn-primary" id="open-app-btn" data-open-app href="${storeUrl}">${primaryLabel}</a>
            <a class="btn-secondary" id="play-store-btn" href="${storeUrl}">
                <svg width="16" height="16" viewBox="0 0 512 512" aria-hidden="true">
                    <path d="M48 59.5 288 256 48 452.5V59.5z" fill="#34a853"/>
                    <path d="M336 208l-53 48 53 48 96-48-96-48z" fill="#fbbc04"/>
                    <path d="M48 59.5l240 196.5-53 48L48 59.5z" fill="#4285f4"/>
                    <path d="M48 452.5l187-245 53 48L48 452.5z" fill="#ea4335"/>
                </svg>
                Get it on Google Play
            </a>
        </div>

        <div class="composer" aria-hidden="true">
            <div class="field">
                <span>Message</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round">
                    <circle cx="12" cy="12" r="9"/>
                    <path d="M8.6 14.4c1.9 1.6 4.9 1.6 6.8 0"/>
                    <circle cx="9.2" cy="9.8" r="1.1" fill="currentColor" stroke="none"/>
                    <circle cx="14.8" cy="9.8" r="1.1" fill="currentColor" stroke="none"/>
                </svg>
            </div>
            <div class="mic">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <rect x="9" y="2.6" width="6" height="11" rx="3" fill="currentColor" stroke="none"/>
                    <path d="M6 11.6a6 6 0 0 0 12 0"/>
                    <path d="M12 17.8V21"/>
                </svg>
            </div>
        </div>
    </div>

    <script>
        (function () {
            var path = window.location.pathname + window.location.search;
            var playStoreUrl = '${PLAY_STORE_URL}&referrer=' + encodeURIComponent(path);

            var playBtn = document.getElementById('play-store-btn');
            if (playBtn) playBtn.href = playStoreUrl;

            var pathNoSlash = path.charAt(0) === '/' ? path.slice(1) : path;
            var intentLink = 'intent://' + pathNoSlash +
                '#Intent;scheme=socialmix;package=com.socialmix.app;S.browser_fallback_url=' +
                encodeURIComponent(playStoreUrl) + ';end;';

            var openers = document.querySelectorAll('[data-open-app]');
            for (var i = 0; i < openers.length; i++) openers[i].href = intentLink;

            function pad(n) { return n < 10 ? '0' + n : '' + n; }
            function tick() {
                var d = new Date();
                var t = pad(d.getHours()) + ':' + pad(d.getMinutes());
                var nodes = document.querySelectorAll('[data-live-time]');
                for (var j = 0; j < nodes.length; j++) nodes[j].textContent = t;
            }
            tick();
            setInterval(tick, 30000);

            if (/Android/i.test(navigator.userAgent)) {
                setTimeout(function () { window.location.href = intentLink; }, 500);
            }
        })();
    </script>
</body>
</html>`;
}


export default async function handler(req, res) {
  let path = req.url || '/';
  
  let title = DEFAULT_TITLE;
  let description = DEFAULT_DESC;
  let image = null;
  let debugError = '';

  try {
    const cleanPath = path.split('?')[0];
    const parts = cleanPath.split('/').filter(Boolean);
    const type = parts[0];
    const id = parts[1];

    if (type && id) {
      if (type === 'group') {
        const { data, error } = await supabase.from('groups').select('name, description, avatar').eq('id', id).single();
        if (error) throw error;
        if (data) {
          title = data.name ? `Join "${data.name}" on SocialMix!` : title;
          description = data.description || description;
          image = data.avatar || image;
        }
      } else if (type === 'food') {
        const { data, error } = await supabase.from('food_businesses').select('name, description, logo_url, images, features, operating_hours, menu_items').eq('id', id).single();
        if (error) throw error;
        if (data) {
          title = data.name || title;
          
          let richDesc = data.description ? data.description + ' ' : '';
          
          if (data.features && data.features.length > 0) {
            richDesc += '✨ ' + data.features.join(', ') + '. ';
          }
          
          if (data.operating_hours && typeof data.operating_hours === 'object') {
            const hoursStr = Object.entries(data.operating_hours)
              .filter(([_, time]) => time && time.toLowerCase() !== 'closed')
              .map(([day, time]) => `${day.charAt(0).toUpperCase() + day.slice(1)}: ${time}`)
              .join(' | ');
            if (hoursStr) richDesc += '🕒 ' + hoursStr + '. ';
          }
          
          if (data.menu_items && data.menu_items.length > 0) {
            const topMenu = data.menu_items.slice(0, 3).map(m => `${m.name}`).join(', ');
            richDesc += '🍽️ Menu: ' + topMenu + (data.menu_items.length > 3 ? '...' : '.');
          }
          
          description = richDesc.trim() || description;
          image = data.logo_url || (data.images && data.images.length > 0 ? data.images[0] : image);
        }
      } else if (type === 'property') {
        const { data, error } = await supabase.from('properties').select('title, description, images').eq('id', id).single();
        if (error) throw error;
        if (data) {
          title = data.title || title;
          description = data.description || description;
          image = data.images && data.images.length > 0 ? data.images[0] : image;
        }
      } else if (type === 'product') {
        const { data, error } = await supabase.from('products').select('title, description, images').eq('id', id).single();
        if (error) throw error;
        if (data) {
          title = data.title || title;
          description = data.description || description;
          image = data.images && data.images.length > 0 ? data.images[0] : image;
        }
      } else if (type === 'tour') {
        const { data, error } = await supabase.from('virtual_tours').select('property_title, description, thumbnail_url').eq('id', id).single();
        if (error) throw error;
        if (data) {
          title = data.property_title || title;
          description = data.description || description;
          image = data.thumbnail_url || image;
        }
      } else if (type === 'reel') {
        const { data, error } = await supabase.from('doorbell_dreams').select('title, description').eq('id', id).single();
        if (error) throw error;
        if (data) {
          title = `🔔 ${data.title}` || title;
          description = data.description || description;
        }
      }
    }
  } catch (error) {
    console.error('Error fetching OG data:', error);
    debugError = String(error.message || error);
  }

  // Inject debug info into description if we hit an error so we can see it in testing
  if (debugError) {
    description = `Error: ${debugError}`;
  }

  const contentType = (req.url || '/').split('?')[0].split('/').filter(Boolean)[0] || '';
  const html = renderHtml(title, description, image, path, contentType);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300'); // Edge cache for 1 minute
  res.status(200).send(html);
}
