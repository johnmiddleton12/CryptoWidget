// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: magic;

const accessToken = '';
const farmId = '';
const workerId = '';
const minerId = '';


const baseUrl = `https://api2.hiveos.farm/api/v2`;
const baseUrlEthermine = "https://api.ethermine.org";
const minerUrl = `${baseUrlEthermine}/miner/${minerId}/currentStats`;

let fm = FileManager.iCloud();
let greenIcon = fm.readImage(fm.documentsDirectory() + "/GreenIcon.png");
let redIcon = fm.readImage(fm.documentsDirectory() + "/RedIcon.png");

const ethData = new Request(`${baseUrlEthermine}/poolStats`);
const ethRes = await ethData.loadJSON();
const priceEth = ethRes["data"]["price"]["usd"];

const minerData = new Request(minerUrl);
const minerRes = await minerData.loadJSON();
var unpaid = minerRes["data"]["unpaid"];
unpaid = unpaid / 1e18;
unpaid = unpaid * priceEth;
unpaid = Number(unpaid).toFixed(2);

const req = new Request(`${baseUrl}/farms/${farmId}/workers/${workedId}`);
req.method = "GET";
req.headers = {"Authorization": `Bearer ${accessToken}`, };

const req1 = new Request(`${baseUrl}/farms/${farmId}/metrics`);
req1.method = "GET";
req1.headers = {"Authorization": `Bearer ${accessToken}`, };

const res = await req.loadJSON();
const res1 = await req1.loadJSON();
const widget = new ListWidget();
const stacker = widget.addStack();

widget.backgroundColor = new Color("#161616");

online = stacker.addText("Miner Status");
online.textColor = Color.white();
online.font = Font.title3();
const isOnline = String(res["stats"]["online"]);
stacker.addSpacer(25);
if (isOnline) {
    let imageStyle = stacker.addImage(greenIcon);
    imageStyle.imageSize = new Size(50, 50);
} else {
    let imageStyle = stacker.addImage(redIcon);
    imageStyle.imageSize = new Size(50, 50);
}

widget.addSpacer(5);
const gpuTemp = String(res['gpu_stats'][0]['temp']);
const gpuTempText = widget.addText('GPU Temp: ' + `${gpuTemp}` + '\u00B0 C');
gpuTempText.textColor = Color.white();
gpuTempText.font = new Font("Helvetica-Light ", 14);

widget.addSpacer(5);
var hashRate = String(res1['data'][0]["hashrates"][0]["value"] / 1e6);
hashRate = Number(hashRate).toFixed(3);
const hashRateText = widget.addText('Hashrate: ' + String(hashRate) + " MH/s");
hashRateText.textColor = Color.white();
hashRateText.font = new Font("Helvetiva-Light ", 11);

widget.addSpacer(5);
const profitText = widget.addText('Current Profit: $' + String(unpaid));
profitText.textColor = Color.white()
profitText.font = new Font("Helvetiva-Light ", 11);

widget.addSpacer(5);
const date = new Date();
var hours = date.getHours();
var minutes = date.getMinutes();
var ampm = hours >= 12 ? 'pm' : 'am';
hours = hours % 12
hours = hours ? hours : 12;
minutes = minutes < 10 ? '0' + minutes : minutes;
var currentTime = hours + ':' + minutes + ' ' + ampm;
const lastUpdate = widget.addText(`Last Update: ${currentTime}`);
lastUpdate.textColor = Color.white();
lastUpdate.font = new Font("Helvetica-Light", 10);


if (config.runsInWidget) {
    Script.setWidget(widget);
    Script.complete();
}
