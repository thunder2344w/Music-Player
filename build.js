const fs = require('fs');
const path = require('path');

const songsDir = path.join(__dirname, 'songs');
const songsJsonPath = path.join(__dirname, 'songs.json');

try {
  const files = fs.readdirSync(songsDir);
  const mp3Files = files.filter(file => file.endsWith('.mp3'));

  // Save as JSON
  fs.writeFileSync(songsJsonPath, JSON.stringify(mp3Files, null, 2));
  console.log('Successfully generated songs.json with', mp3Files.length, 'songs.');
} catch (error) {
  console.error('Error generating songs.json:', error);
}
