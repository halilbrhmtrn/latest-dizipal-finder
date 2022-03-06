const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs');
const path = require('path');

// read the latest suffix
let storedLatestSuffix;
try {
  storedLatestSuffix = fs.readFileSync(path.join(process.cwd(), 'latestSuffix.txt'), 'utf8');

} catch (err) {
  if (!storedLatestSuffix) {
    console.log('No latestSuffix.txt found. Creating one.');
    fs.writeFileSync(path.join(process.cwd(), 'latestSuffix.txt'), '178');
    storedLatestSuffix = 178;
  }
}
const findUrl = async (latestSuffix) => {
  let resultUrl = ''
  while (true) {
    let url = `https://dizipal${latestSuffix}.com/dizi/gibi/`
    try {
      console.log(`making request to ${url}`);
      const res = await axios.get(url)
      const $ = cheerio.load(res.data);
      const description = $('.description').html()
      const result = description && description.includes(`altüst edecek bir şeyler yapmayı her zaman becermek. Küçücük olayları inanılmaz bir ustalıkla büyütüyor`);
      if (result) {
        console.log(`matched description with value ${description} at url ${url}`)
        resultUrl = url;
        storedLatestSuffix = latestSuffix;
        break;
      }
    } catch (error) {

    } finally {
      latestSuffix++;
    }
  }
  fs.writeFileSync(path.join(process.cwd(), 'latestSuffix.txt'), storedLatestSuffix.toString());
  const childProc = require('child_process');
  childProc.exec(`open -a "Google Chrome" ${resultUrl}`, () => console.log('Opened chrome!')); return resultUrl;
}

console.log(findUrl(storedLatestSuffix));
