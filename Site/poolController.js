var fetchingLiveStats = false;

var helloApp = angular.module("poolApp", []);
helloApp.controller("PoolCtrl", function($scope, $timeout, $http) {

    $scope.defaultWallet = 'enter address';
    $scope.poolName = poolName;
    $scope.coinName = coin;
    $scope.examplePort = "";
    $scope.exampleHost = poolHost;
    $scope.networkLastBlockFound = "...";
    $scope.walletAddress = $scope.defaultWallet;
    $scope.walletAddressModel = $scope.defaultWallet;
    $scope.coinDetails = coinDetails;
    $scope.coinLogo = coinLogo;
    $scope.currentTab = "";
    $scope.downloads = downloads;
    $scope.walletStats;
    $scope.walletPayments;
    $scope.myLastShare;
    $scope.myHashRate;
    $scope.myHashes = 0;
    $scope.haveFetchedMyStuff=false;
    $scope.poolPayments;
    
    $scope.setPort = function(prt) {
        $scope.examplePort = prt;
    }

    $scope.setWallet = function(){
        var walletHack = document.getElementById('walletaddy').value;
        $scope.walletAddressModel = walletHack;
        window.location.hash="#!#mystats="+$scope.walletAddressModel;
        $scope.walletAddress = $scope.walletAddressModel;
    }

    console.log(window.location.hash);
var hashParts = window.location.hash.split('#');
$scope.currentTab=hashParts[hashParts.length-1];
if ($scope.currentTab.includes("="))
{
    var ting = $scope.currentTab.split("=");
    if (ting.length==2){
    $scope.currentTab = ting[0];
    $scope.walletAddress=ting[1];
    $scope.walletAddressModel=ting[1];
    }else{
        $scope.currentTab = "";
    $scope.walletAddress=ting[0];
    $scope.walletAddressModel=ting[0];
    }

    
}

    var fetching = false;
    $scope.lastStats = null;
    $scope.update = function() {
        
        fetching = true;
        $http.get(api + '/live_stats').then(function(res) {
console.log(res.data);
            $scope.lastStats = res.data;

            if ($scope.walletAddress != $scope.defaultWallet)
            {
                
                $http.get(api + '/stats_address?address=' + $scope.walletAddress+'&longpoll=false').then(function(result){
                    
                    $scope.walletStats = result.data;
                    $scope.myLastShare = new Date(parseInt(result.data.stats.lastShare) * 1000).toISOString();
                    $scope.myHashRate=Killize(parseInt(result.data.stats.hashrate) || 0) + 'H/sec';
                    $scope.myHashes = Killize(result.data.stats.hashes || 0);
                    $scope.myPaid = getReadableCoins($scope.lastStats,result.data.stats.paid,4,true);
                    $scope.myPendingBalance = getReadableCoins($scope.lastStats,result.data.stats.balance,4,true);
                    $scope.walletPayments = parsePayments(result.data.payments,$scope.lastStats);
                    $scope.haveFetchedMyStuff=true;
                });

            }

            fetching = false;
            $timeout(function() {
                $scope.update();
            }, 1000);
        });


        if ($scope.lastStats != null) {

            $scope.blockData = [];

            var p = 0;
            for (var i = 0; i < $scope.lastStats.pool.blocks.length; i += 2) {
                var block = parseBlock($scope.lastStats.pool.blocks[i + 1], $scope.lastStats.pool.blocks[i], $scope.lastStats);
                $scope.blockData[p] = block;
                p++;
            }

$scope.poolPayments = parsePayments($scope.lastStats.pool.payments,$scope.lastStats);
            $scope.networkLastBlockFound = get_time_diff(new Date($scope.lastStats.network.timestamp * 1000).toISOString());
            $scope.networkHashRate = getReadableHashRateString($scope.lastStats.network.difficulty / $scope.lastStats.config.coinDifficultyTarget) + '/sec';
            $scope.difficulty = $scope.lastStats.network.difficulty.toString();
            $scope.blockchainHeight = $scope.lastStats.network.height.toString();
            $scope.networkLastReward = getReadableCoins($scope.lastStats, $scope.lastStats.network.reward, 4);
            $scope.networkLastHash = $scope.lastStats.network.hash.substr(0, 13) + '...';

            $scope.poolHashRate = getReadableHashRateString($scope.lastStats.pool.hashrate) + '/sec';
            $scope.poolMinerCount = $scope.lastStats.pool.miners.toString();

            $scope.ports = $scope.lastStats.config.ports;

if ($scope.examplePort==""){
    $scope.examplePort = $scope.ports[0].port;
}

            if ($scope.lastStats.pool.lastBlockFound) {
                var d = new Date(parseInt($scope.lastStats.pool.lastBlockFound)).toISOString();
                $scope.poolLastBlockFound = get_time_diff(d);
            }

            var totalFee = $scope.lastStats.config.fee;
            if (Object.keys($scope.lastStats.config.donation).length) {
                var totalDonation = 0;
                for (var i in $scope.lastStats.config.donation) {
                    totalDonation += $scope.lastStats.config.donation[i];
                }

                totalFee += totalDonation;
                $scope.poolDonations = floatToString(totalDonation) + '% to open-source devs';
            } else {
                $scope.poolDonations = "";
            }

            $scope.poolFee = floatToString(totalFee) + '%';


            $scope.blockSolvedTime = getReadableTime($scope.lastStats.network.difficulty / $scope.lastStats.pool.hashrate);
            $scope.calcHashSymbol = $scope.lastStats.config.symbol;
        }


    }

    $scope.update();
});
