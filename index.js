const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
require('dotenv').config()

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.user,
    pass: process.env.pass
  }
});

const kabumUrl = "https://www.kabum.com.br/produto/128560/console-microsoft-xbox-series-x-1tb-preto-rrt-00006";
const kabumProduct = "img[alt=produto_indisponivel]";
const americanasUrl = "https://www.americanas.com.br/produto/3018329621?loja=37337877000182&epar=bp_pl_00_go_todos-os-produtos_geral_gmv&WT.srch=1&opn=YSMESP&acc=e789ea56094489dffd798f86ff51c7a9&i=5f20f4c049f937f62541da9d&o=604c6393f8e95eac3d6fd73a&gclid=CjwKCAiAhbeCBhBcEiwAkv2cY_MyI3miK-LE3GeQowqpVJny6_KH-LjJbH6AR6c8Iq8ot0VBqjXR-hoCsnQQAvD_BwE";
const americanasProduct = "#root > div > div.src__Container-dda50e-0.ihwNf > div.product-offer__ProductOfferContainer-sc-1xm718r-1.kUzvQh > div.src__Container-sc-1awhmon-1.izGEiD > form > button";
const submarinoUrl = "https://www.submarino.com.br/produto/3018329621/console-xbox-series-x-microsoft?WT.srch=1&acc=d47a04c6f99456bc289220d5d0ff208d&epar=bp_pl_00_go_g35169&gclid=CjwKCAiAhbeCBhBcEiwAkv2cY6Li7rJeil2Rix0rMzYP2epXstKq5BXUQ2HxSOVfUKi5Vlu9QXs6txoC9WsQAvD_BwE&i=5f21112049f937f62568ab73&o=604be468f8e95eac3d6ad95a&opn=XMLGOOGLE&sellerId=37337877000182";
const submarinoProduct = "#content > div > div > div.GridUI-wcbvwm-0.jjjQOQ.ViewUI-sc-1ijittn-6.iXIDWU > div > section > div > div.product-main-area__ProductMainAreaUI-wc8uq1-0.eAJbgq.ViewUI-sc-1ijittn-6.iXIDWU > div.product-main-area__OfferBox-wc8uq1-3.jnbife.ViewUI-sc-1ijittn-6.iXIDWU > div > div > section > div.GridUI-wcbvwm-0.ereXJY.ViewUI-sc-1ijittn-6.iXIDWU > div.GridUI-wcbvwm-0.iQqmnd.ViewUI-sc-1ijittn-6.iXIDWU > div > button > div";
var numberOfEmailsSent = 0;

(async () => {

  do{
    //Search in Kabum
    await openSiteSearchProduct(kabumUrl, kabumProduct);
    
    //Search in Americanas
    await openSiteSearchProduct(americanasUrl, americanasProduct);

    //Search in Submarino
    await openSiteSearchProduct(submarinoUrl, submarinoProduct);

    console.log('Produto não disponivel');

    await sleep(180000); // 3 min

  }while (numberOfEmailsSent < 5);
  
  console.log('Processo parou por excesso de emails');
  process.exit(1);

})();

async function openSiteSearchProduct(url,produto) {
  const mailOptions = {
    from: process.env.user,
    to: process.env.destination,
    subject: 'Series X Disponivel!!!',
    text: 'URL: ' + url
  };
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);
  const unavailableProductIsPresent = await page.$(produto);
  if (!unavailableProductIsPresent){
    //Send email
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        numberOfEmailsSent++;
      }
    });
  }
  await browser.close();
}
