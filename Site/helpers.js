
function floatToString(float) {
    return float.toFixed(6).replace(/[0\.]+$/, '');
}

function getReadableTime(seconds) {

    var units = [
        [60, 'second'],
        [60, 'minute'],
        [24, 'hour'],
        [7, 'day'],
        [4, 'week'],
        [12, 'month'],
        [1, 'year']
    ];

    function formatAmounts(amount, unit) {
        var rounded = Math.round(amount);
        return '' + rounded + ' ' + unit + (rounded > 1 ? 's' : '');
    }

    var amount = seconds;
    for (var i = 0; i < units.length; i++) {
        if (amount < units[i][0])
            return formatAmounts(amount, units[i][1]);
        amount = amount / units[i][0];
    }
    return formatAmounts(amount, units[units.length - 1][1]);
}

function getReadableCoins(lastStats, coins, digits, withoutSymbol) {
    var amount = (parseInt(coins || 0) / lastStats.config.coinUnits).toFixed(digits || lastStats.config.coinUnits.toString().length - 1);
    return amount + (withoutSymbol ? '' : (' ' + lastStats.config.symbol));
}

function Killize(nb){
    return getReadableHashRateString(nb);
}

function get_time_diff(datetime) {
    var datetime = typeof datetime !== 'undefined' ? datetime : "2014-01-01 01:02:03.123456";

    var datetime = new Date(datetime).getTime();
    var now = new Date().getTime();

    if (isNaN(datetime)) {
        return "never";
    }

    if (datetime < now) {
        var milisec_diff = now - datetime;
    } else {
        var milisec_diff = datetime - now;
    }

    var days = Math.floor(milisec_diff / 1000 / 60 / (60 * 24));

    var date_diff = new Date(milisec_diff);

    var result = "";
    if (days > 0) {
        result = result + days + "Days, ";
    }

    if (days > 0 || date_diff.getHours() > 0) {
        result = result + date_diff.getHours() + " Hours, ";
    }

    if (days > 0 || date_diff.getHours() > 0 || date_diff.getMinutes() > 0) {
        result = result + date_diff.getMinutes() + " Mins, ";
    }



    result = result + date_diff.getSeconds() + " Secs ago.";

    return result;
}


function getReadableTime(seconds) {

    var units = [
        [60, 'second'],
        [60, 'minute'],
        [24, 'hour'],
        [7, 'day'],
        [4, 'week'],
        [12, 'month'],
        [1, 'year']
    ];

    function formatAmounts(amount, unit) {
        var rounded = Math.round(amount);
        return '' + rounded + ' ' + unit + (rounded > 1 ? 's' : '');
    }

    var amount = seconds;
    for (var i = 0; i < units.length; i++) {
        if (amount < units[i][0])
            return formatAmounts(amount, units[i][1]);
        amount = amount / units[i][0];
    }
    return formatAmounts(amount, units[units.length - 1][1]);
}

function getReadableHashRateString(hashrate) {
    var i = 0;
    var byteUnits = [' H', ' KH', ' MH', ' GH', ' TH', ' PH'];
    while (hashrate > 1024) {
        hashrate = hashrate / 1024;
        i++;
    }
    return hashrate.toFixed(2) + byteUnits[i];
}

function parseBlock(height, serializedBlock, lastStats) {
    var parts = serializedBlock.split(':');

    var dt = new Date(parseInt(parts[1]));

    var block = {
        height: parseInt(height),
        hash: parts[0],
        timefound: formatDate(parseInt(parts[1])),
        difficulty: parseInt(parts[2]),
        shares: parseInt(parts[3]),
        orphaned: parts[4],
        reward: parts[5]
    };

    var toGo = lastStats.config.depth - (lastStats.network.height - block.height);
    block.maturity = toGo < 1 ? '' : (toGo + ' to go');

    switch (block.orphaned) {
        case '0':
            block.status = 'unlocked';
            break;
        case '1':
            block.status = 'orphaned';
            break;
        default:
            block.status = 'pending';
            break;
    }

    return block;
}


function formatDate(time) {
    if (!time) return '';
    return new Date(parseInt(time) * 1000).toLocaleString();
}

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

    function parsePayment(time, serializedPayment,lastStats){
        var parts = serializedPayment.split(':');
        return {
            time: formatDate(parseInt(time)),
            hash: parts[0],
            amount: getReadableCoins(lastStats,parseInt(parts[1]),4,true) ,
            fee: parts[2],
            mixin: parts[3],
            recipients: parts[4]
        };
    }

function parsePayments(paymentsData,lastStats)
{

var paymentResults = [];
var pos=0;

        for (var i = 0; i < paymentsData.length; i += 2){

            var payment = parsePayment(paymentsData[i + 1], paymentsData[i],lastStats);

paymentResults[pos] = payment;
            
            pos++;

        }

        return paymentResults;
    
}