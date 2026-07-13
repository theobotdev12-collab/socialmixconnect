import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://ogzgimhnunkdhhkpwqbm.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nemdpbWhudW5rZGhoa3B3cWJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2Mjc3NDEsImV4cCI6MjA4ODIwMzc0MX0.PMuv-YKKvmE_vtWxw4CCjoy8qHzLjHo-dgM0StFdkKQ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DEFAULT_TITLE = 'SocialMix';
const DEFAULT_DESC = 'Connecting you to the content...';

// Simple HTML template builder
function renderHtml(ogTitle, ogDesc, ogImage, path) {
  // Use a fallback image if none provided
  const imageTag = ogImage ? `<meta property="og:image" content="${ogImage}">\n    <meta name="twitter:image" content="${ogImage}">` : '';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${ogTitle}</title>
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://socialmixconnect.vercel.app${path}">
    <meta property="og:title" content="${ogTitle}">
    <meta property="og:description" content="${ogDesc}">
    ${imageTag}

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="https://socialmixconnect.vercel.app${path}">
    <meta name="twitter:title" content="${ogTitle}">
    <meta name="twitter:description" content="${ogDesc}">

    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background-color: #f9fafb;
            color: #1f2937;
            text-align: center;
            padding: 20px;
        }
        .container {
            max-width: 400px;
            background: white;
            padding: 40px 30px;
            border-radius: 24px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
        }
        .logo-container {
            width: 88px;
            height: 88px;
            background-color: #8B5CF6; /* SocialMix Purple */
            border-radius: 22px;
            margin: 0 auto 24px auto;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 16px rgba(139, 92, 246, 0.3);
        }
        .logo-text {
            color: white;
            font-size: 40px;
            font-weight: bold;
            font-family: serif;
        }
        h1 {
            font-size: 24px;
            margin-bottom: 8px;
            font-weight: 700;
        }
        p {
            font-size: 15px;
            color: #6b7280;
            margin-bottom: 32px;
            line-height: 1.5;
        }
        .btn {
            display: block;
            background-color: #8B5CF6;
            color: white;
            text-decoration: none;
            padding: 16px 20px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            margin-bottom: 16px;
            transition: opacity 0.2s;
        }
        .btn:active {
            opacity: 0.8;
        }
        .fallback-btn {
            background-color: transparent;
            color: #4b5563;
            border: 2px solid #e5e7eb;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo-container">
            <span class="logo-text">S</span>
        </div>
        <h1>SocialMix</h1>
        <p>Connecting you to the content...</p>
        
        <a id="open-app-btn" href="#" class="btn">Open App</a>
        <a id="play-store-btn" href="https://play.google.com/store/apps/details?id=com.socialmix.app" class="btn fallback-btn">Get it on Google Play</a>
    </div>

    <script>
        // 1. Get the path (e.g. /property/123)
        const path = window.location.pathname + window.location.search;
        
        // 2. Play Store URL with deferred referrer
        const playStoreUrl = \`https://play.google.com/store/apps/details?id=com.socialmix.app&referrer=\${encodeURIComponent(path)}\`;
        document.getElementById('play-store-btn').href = playStoreUrl;

        // 3. Android Intent URI
        // This attempts to open the app directly. If it fails, S.browser_fallback_url redirects to Play Store.
        const pathNoSlash = path.startsWith('/') ? path.substring(1) : path;
        const intentLink = \`intent://\${pathNoSlash}#Intent;scheme=socialmix;package=com.socialmix.app;S.browser_fallback_url=\${encodeURIComponent(playStoreUrl)};end;\`;
        document.getElementById('open-app-btn').href = intentLink;

        // 4. Auto-redirect logic for mobile devices
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            setTimeout(() => {
                window.location.href = intentLink;
            }, 300);
        }
    </script>
</body>
</html>`;
}

export default async function handler(req, res) {
  const path = req.url || '/';
  
  let title = DEFAULT_TITLE;
  let description = DEFAULT_DESC;
  let image = null;

  try {
    const parts = path.split('/').filter(Boolean);
    const type = parts[0];
    const id = parts[1];

    if (type && id) {
      if (type === 'group') {
        const { data } = await supabase.from('groups').select('name, description, avatar').eq('id', id).single();
        if (data) {
          title = data.name ? \`Join "\${data.name}" on SocialMix!\` : title;
          description = data.description || description;
          image = data.avatar || image;
        }
      } else if (type === 'food') {
        const { data } = await supabase.from('food_businesses').select('name, description, logo_url, images').eq('id', id).single();
        if (data) {
          title = data.name || title;
          description = data.description || description;
          image = data.logo_url || (data.images && data.images.length > 0 ? data.images[0] : image);
        }
      } else if (type === 'property') {
        const { data } = await supabase.from('properties').select('title, description, images').eq('id', id).single();
        if (data) {
          title = data.title || title;
          description = data.description || description;
          image = data.images && data.images.length > 0 ? data.images[0] : image;
        }
      } else if (type === 'product') {
        const { data } = await supabase.from('products').select('title, description, images').eq('id', id).single();
        if (data) {
          title = data.title || title;
          description = data.description || description;
          image = data.images && data.images.length > 0 ? data.images[0] : image;
        }
      } else if (type === 'tour') {
        const { data } = await supabase.from('virtual_tours').select('property_title, description, thumbnail_url').eq('id', id).single();
        if (data) {
          title = data.property_title || title;
          description = data.description || description;
          image = data.thumbnail_url || image;
        }
      } else if (type === 'reel') {
        const { data } = await supabase.from('doorbell_dreams').select('title, description').eq('id', id).single();
        if (data) {
          title = \`🔔 \${data.title}\` || title;
          description = data.description || description;
        }
      }
    }
  } catch (error) {
    console.error('Error fetching OG data:', error);
  }

  const html = renderHtml(title, description, image, path);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300'); // Edge cache for 1 minute
  res.status(200).send(html);
}
