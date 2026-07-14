import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://ogzgimhnunkdhhkpwqbm.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nemdpbWhudW5rZGhoa3B3cWJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2Mjc3NDEsImV4cCI6MjA4ODIwMzc0MX0.PMuv-YKKvmE_vtWxw4CCjoy8qHzLjHo-dgM0StFdkKQ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DEFAULT_TITLE = 'SocialMix';
const DEFAULT_DESC = 'Connecting you to the content...';

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

// Premium HTML template builder
function renderHtml(ogTitle, ogDesc, ogImage, path, contentType) {
  const imageTag = ogImage
    ? `<meta property="og:image" content="${ogImage}">\n    <meta name="twitter:image" content="${ogImage}">`
    : '';

  const primaryLabel = getPrimaryLabel(contentType);

  // Sanitise text to prevent XSS via OG data
  const safe = (str) => String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

  const heroSection = ogImage
    ? `<div class="hero"><img src="${safe(ogImage)}" alt="${safe(ogTitle)}" /></div>`
    : `<div class="hero-placeholder"><span>S</span></div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${safe(ogTitle)} · SocialMix</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://socialmixconnect.vercel.app${path}">
    <meta property="og:title" content="${safe(ogTitle)}">
    <meta property="og:description" content="${safe(ogDesc)}">
    <meta property="og:site_name" content="SocialMix">
    ${imageTag}

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${safe(ogTitle)}">
    <meta name="twitter:description" content="${safe(ogDesc)}">

    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #1a0533 0%, #2d0a6b 50%, #1a0533 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .card {
            background: white;
            border-radius: 28px;
            max-width: 420px;
            width: 100%;
            overflow: hidden;
            box-shadow: 0 32px 80px rgba(0,0,0,0.4);
            animation: slideUp 0.4s ease;
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Hero image ── */
        .hero {
            width: 100%;
            height: 220px;
            overflow: hidden;
            background: #1a0533;
        }
        .hero img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .hero-placeholder {
            width: 100%;
            height: 180px;
            background: linear-gradient(135deg, #7c3aed, #8b5cf6);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 72px;
            font-weight: 900;
            color: white;
            font-family: serif;
        }

        /* ── Content body ── */
        .body {
            padding: 28px 28px 32px;
        }

        .badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #f3f0ff;
            color: #7c3aed;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            padding: 5px 12px;
            border-radius: 20px;
            margin-bottom: 14px;
        }

        .badge img {
            width: 16px;
            height: 16px;
            border-radius: 4px;
        }

        h1 {
            font-size: 22px;
            font-weight: 700;
            color: #111827;
            line-height: 1.3;
            margin-bottom: 10px;
        }

        .desc {
            font-size: 14px;
            color: #6b7280;
            line-height: 1.6;
            margin-bottom: 28px;
        }

        /* ── Buttons ── */
        .btn-primary {
            display: block;
            width: 100%;
            background: linear-gradient(135deg, #7c3aed, #9333ea);
            color: white;
            text-decoration: none;
            text-align: center;
            padding: 17px 20px;
            border-radius: 14px;
            font-weight: 700;
            font-size: 16px;
            margin-bottom: 12px;
            box-shadow: 0 8px 20px rgba(124, 58, 237, 0.35);
            transition: transform 0.15s, box-shadow 0.15s;
            letter-spacing: 0.2px;
        }
        .btn-primary:active {
            transform: scale(0.97);
            box-shadow: 0 4px 10px rgba(124,58,237,0.25);
        }

        .btn-secondary {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            border: 2px solid #e5e7eb;
            color: #374151;
            text-decoration: none;
            text-align: center;
            padding: 15px 20px;
            border-radius: 14px;
            font-weight: 600;
            font-size: 15px;
            transition: background 0.15s;
        }
        .btn-secondary:hover { background: #f9fafb; }

        .playstore-logo {
            width: 22px;
            height: 22px;
        }

        /* ── Footer ── */
        .footer {
            text-align: center;
            padding: 14px 28px 20px;
            border-top: 1px solid #f3f4f6;
            font-size: 12px;
            color: #9ca3af;
        }
        .footer strong { color: #7c3aed; }
    </style>
</head>
<body>
    <div class="card">
        ${heroSection}

        <div class="body">
            <div class="badge">
                <img src="https://ui-avatars.com/api/?name=S&background=7c3aed&color=fff&size=32&bold=true" alt="S">
                SocialMix
            </div>

            <h1>${safe(ogTitle)}</h1>
            <p class="desc">${safe(ogDesc)}</p>

            <a id="open-app-btn" href="#" class="btn-primary">${primaryLabel}</a>

            <a id="play-store-btn"
               href="https://play.google.com/store/apps/details?id=com.socialmix.app"
               class="btn-secondary">
                <!-- Google Play icon -->
                <svg class="playstore-logo" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                  <path d="M48 59.5L288 256 48 452.5V59.5z" fill="#34a853"/>
                  <path d="M336 208l-53 48 53 48 96-48-96-48z" fill="#fbbc04"/>
                  <path d="M48 59.5l240 196.5-53 48L48 59.5z" fill="#4285f4"/>
                  <path d="M48 452.5l187-245 53 48L48 452.5z" fill="#ea4335"/>
                </svg>
                Download SocialMix on Play Store
            </a>
        </div>

        <div class="footer">
            <strong>socialmixconnect.vercel.app</strong> · Connect. Discover. Share.
        </div>
    </div>

    <script>
        const path = window.location.pathname + window.location.search;
        const playStoreUrl = \`https://play.google.com/store/apps/details?id=com.socialmix.app&referrer=\${encodeURIComponent(path)}\`;
        document.getElementById('play-store-btn').href = playStoreUrl;

        const pathNoSlash = path.startsWith('/') ? path.substring(1) : path;
        const intentLink = \`intent://\${pathNoSlash}#Intent;scheme=socialmix;package=com.socialmix.app;S.browser_fallback_url=\${encodeURIComponent(playStoreUrl)};end;\`;
        document.getElementById('open-app-btn').href = intentLink;

        const isAndroid = /Android/i.test(navigator.userAgent);
        if (isAndroid) {
            setTimeout(() => { window.location.href = intentLink; }, 500);
        }
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
