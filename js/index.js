async function main() {
  console.log("i am a hoopy frood")
  var mymap = L.map('map').setView([51.505, -0.09], 13);

  let lineCtx = document.getElementById('lineChart')
  let lineChart = new Chart(ctx,{type:'line'})

  let barCtx = document.getElementById('barChart')
  let barChart = new Chart(ctx,{type:'bar'})

}
