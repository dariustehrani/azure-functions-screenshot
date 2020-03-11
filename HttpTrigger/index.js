const os = require('os');
const puppeteer = require('puppeteer');
const fs = require('fs');

module.exports = async function (context, req) {

    let tempDir = os.tmpdir();
    let tempFile = `${tempDir}/screenshot.png`;
    if (req.query.name || (req.body && req.body.name)) {
 
        await (async () => {
            const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
            const page = await browser.newPage();
            await page.setViewport({width: 1920, height: 1080, deviceScaleFactor: 1});
            
            await page.goto('https://github.com/'+ req.query.name || (req.body && req.body.name), {waitUntil: 'networkidle2'});
            await page.screenshot({path: tempFile});            
            await browser.close();
    
            var data = fs.readFileSync(tempFile);
           
            context.res = {
                isRaw: true,
                body: data
            };
            context.done();
    
    })(); 


    }


}

