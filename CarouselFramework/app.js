
$('.carousel').carousel({
    interval: false
});

function myFunction() {
    document.getElementById("demo").innerHTML = "testing";
}

function dFunction() {
    document.getElementById("date").innerHTML = Date();
}

function pasteName() {
    event.preventDefault();
     var cryptoname = $('#crypto-name').val().trim();
     var coinnumber = $('#coin-number').val().trim();
     
    $.get('https://api.binance.com/api/v1/ticker/24hr')
        .then(function (response) {
            console.log(response);
            var btcprice = response[11].lastPrice
            response.forEach(Mname => {
                if (Mname.symbol === cryptoname) {
                    var dollarprice = Mname.lastPrice * btcprice;
                    var holding = coinnumber * dollarprice;

                    $('.marketTable2').append(
                        `
                        <tr>    
                            <td>${Mname.symbol}</td>
                            <td>${holding.toString()}</td>
                            <td>${Mname.lastPrice}</td>
                            <td>${dollarprice.toString()}</td>
                            <td>${Mname.priceChangePercent}</td>
                            <td><button class="edit-btn">Edit</button></td>
                            <td><button class="remove-btn">Remove</button></td>
                        <tr>
                `
                    )
                }
            })

        })

}

$('.marketTable2').on('click', '.remove-btn',function(){
    // $('#')
    console.log($(this).parent().parent().remove())
})
function searchPage() {
    $("#carouselExampleIndicators").carousel(2);
}
