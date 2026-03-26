const fs = require('fs');

const modules = JSON.parse(fs.readFileSync('src/data/modules.json', 'utf8'));
const ids = {
  '106': 'wY4KbkI7LU0',
  '107': 'uTPTVgJW2YA',
  '108': '7HJWdECB3gY',
  '109': 'OTDzwOKMFhk',
  '110': 'sws8N8NKxVc',
  '111': 'HqvjSZl1FX0',
  '112': 'jSxgVS9k2qI',
  '113': 'v6Kdv0l414w',
  '114': 'e48aG_-T6fM',
  '115': 'eHYQIufJZF4'
};

let out = '';
for (const [modId, ytId] of Object.entries(ids)) {
  const mod = modules.find(m => m.id === modId);
  if (!mod) continue;
  
  // Clean up markdown and extract first few meaningful lines
  const lines = mod.content
    .replace(/---/g, '')
    .replace(/#/g, '')
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);
    
  // Get top 8 lines
  const desc = lines.slice(0, 8).join('\n\n');
  
  out += `\n==========\nVIDEO ID: ${ytId}\nMODULE: ${modId}\nTITLE: ${mod.title}\nEDIT URL: https://studio.youtube.com/video/${ytId}/edit\nDESCRIPTION TO PASTE:\n${desc}\n`;
}

fs.writeFileSync('youtube-descriptions.txt', out);
console.log('Descriptions generated in youtube-descriptions.txt');
