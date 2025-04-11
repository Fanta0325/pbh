const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;
const externalScriptURL = 'https://raw.githubusercontent.com/SuperHackz/blooket-cheats/refs/heads/main/gui.min.js';

app.get('*', async (req, res) => {
  try {
    const targetUrl = 'https://play.blooket.com' + req.originalUrl;

    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://play.blooket.com/',
        'Cookie': req.headers['cookie'] || '',
      }
    });

    // 자동 삽입될 스크립트
    const injectedScript = `<script src="${externalScriptURL}"></script>`;

    // HTML에 삽입
    const modifiedHTML = response.data.replace('</body>', `${injectedScript}</body>`);

    res.send(modifiedHTML);
  } catch (err) {
    res.status(500).send('에러 발생: ' + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`프록시 서버가 http://localhost:${PORT} 에서 실행 중`);
});
