const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;

// 외부에서 불러올 자동 스크립트 URL
const externalScriptURL = 'https://raw.githubusercontent.com/SuperHackz/blooket-cheats/refs/heads/main/gui.min.js';

app.get('*', async (req, res) => {
  try {
    const targetUrl = 'https://play.blooket.com' + req.originalUrl;
    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent': req.headers['user-agent'],
      }
    });

    // <script> 태그로 외부 스크립트 자동 삽입
    const injectedScript = `
      <script src="${externalScriptURL}"></script>
    `;

    const modifiedHTML = response.data.replace('</body>', `${injectedScript}</body>`);

    res.send(modifiedHTML);
  } catch (err) {
    res.status(500).send('에러 발생: ' + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`프록시 서버가 http://localhost:${PORT} 에서 실행 중`);
});
