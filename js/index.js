
  console.log("i am a hoopy frood")
  let censusData = dl.csv('states.csv')
  console.log("raw", censusData)

  let xyData = censusData.map( row => {
    row.x = row.year
    row.y = row.population
    return row
  })

  let iaData = xyData.filter(row => row.state == "Iowa")
  console.log("ia", iaData)

  let neData = xyData.filter(row => row.state == "Nebraska")
  console.log("ne", neData)

  let ksData = xyData.filter(row => row.state == "Kansas")
  console.log("ks", ksData)

  let data2000 = xyData.filter(row => row.year == 2000)
  console.log(2000, data2000)

  let data2005 = xyData.filter(row => row.year == 2005)
  console.log(2005, data2005)

  let data2010 = xyData.filter(row => row.year == 2010)
  console.log(2010, data2010)







  let lineChartConfig = {
    type: 'line',
    data: {
      labels: [2000,2005,2010],
      datasets: [{ 
          data: iaData,
          label: "Iowa",
          borderColor: "#3e95cd",
          backgroundColor:  "#3e95cd",
          fill: false
        }, { 
          data: ksData,
          label: "Kansas",
          borderColor: "#3cba9f",
          backgroundColor:  "#3cba9f",
          fill: false
        }, { 
          data: neData,
          label: "Nebraska",
          borderColor: "#8e5ea2",
          backgroundColor:  "#8e5ea2",
          fill: false
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'State population'
      },
      scales: {
        yAxes: [
          {ticks: {
            min: 0,
            callback: dl.format.number(",") // if it was a $ you'd use dl.format.number("$,") 
          }
        }
      ]},
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => dl.format.number(",")(tooltipItem.yLabel) // if it was a $ you'd use dl.format.number("$,")(tooltipItem.yLabel) 
        }
      }
    }
  }


  let lineCtx = document.getElementById('lineChart')
  let lineChart = new Chart(lineCtx, lineChartConfig)

  let barChartConfig = {
    type: 'bar',
    data: {
      labels: data2010.map(row => row.state),
      datasets: [{ 
        data: data2000.map(row => row.population),
        label: "2000",
        borderColor: "#3e95cd",
        backgroundColor:  "#3e95cd",
        fill: false
      },
      {
        data: data2005.map(row => row.population),
        label: "2005",
        borderColor: "#8e5ea2",
        backgroundColor:  "#8e5ea2",
        fill: false
      },
      {
        data: data2010.map(row => row.population),
        label: "2010",
        borderColor: "#3cba9f",
        backgroundColor:  "#3cba9f",
        fill: false
      },
    ]},
    options: {
      title: {
        display: true,
        text: 'State population'
      },
      scales: {yAxes: [
        { ticks: {
            min: 0,
            callback: dl.format.number(",") // if it was a $ you'd use dl.format.number("$,") 
          }
        }
      ]},
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => dl.format.number(",")(tooltipItem.yLabel) // if it was a $ you'd use dl.format.number("$,")(tooltipItem.yLabel) 
        }
      }
    }
  }

  let barCtx = document.getElementById('barChart')
  let barChart = new Chart(barCtx, barChartConfig)



  // make the leaflet map
  let myMap = L.map('map').setView([41.2565, -95.9345], 5);

  // requires a mapbox account. see mapbox.com
  let mapboxLayer =   L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoibGF0aHJvcGQiLCJhIjoiY2p2MnVnZHN3MWQ2bjRlbW5hZ2Uya3RybCJ9.z467PnsR1dCqYsPeZKmHVg'
  })

  // find more like this at https://leaflet-extras.github.io/leaflet-providers/preview/
  let watercolorLayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 1,
    maxZoom: 16,
    ext: 'jpg'
  })

  let terrainLayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 18,
    ext: 'png'
  })

  let tonerLayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
  })

  tonerLayer.addTo(myMap)


  let colors = {
    Iowa: "#FFCD00",
    Nebraska: "#D00000",
    Kansas: "#0051ba"

  }

  function makeMarkers(row) {
    console.log(row)
    let options = {
      radius: Math.sqrt(row.population)/25,
      color: colors[row.state]
  }
    let marker = L.circleMarker([row.lat, row.lng], options)
      .bindPopup(row.state + " (" + row.year + ")<br>Population: " + dl.format.number(",")(row.population))
    return marker
  }

  let points2000 = data2000.map(makeMarkers)
  let points2005 = data2005.map(makeMarkers)
  let points2010 = data2010.map(makeMarkers)
  
  console.log(points2000)

  let layer2000 = L.layerGroup(points2000)
  let layer2005 = L.layerGroup(points2005)
  let layer2010 = L.layerGroup(points2010)
  let groupControl = L.control.layers(null, null, {collapsed: false})
    .addBaseLayer(layer2000, "2000")
    .addBaseLayer(layer2005, "2005")
    .addBaseLayer(layer2010, "2010")
    .addTo(myMap)
    layer2000.addTo(myMap)
    groupControl.expand()


  console.log(layer2000, layer2005, layer2010)

  //   document.getElementById("button-2000").onclick =  (e) => {
  //     console.log("FF")
  //     layer2000.remove()
  //     layer2005.remove()
  //     layer2010.remove()
  //     layer2000.addTo(myMap)
  //     document.getElementById("button-2000").className = "selected"
  //     document.getElementById("button-2005").className = ""
  //     document.getElementById("button-2010").className = ""
  //     return false
  //   }

  //   document.getElementById("button-2005").onclick = (e) => {
  //     console.log(1)
  //     layer2000.remove()
  //     layer2005.remove()
  //     layer2010.remove()
  //     layer2005.addTo(myMap)
  //     document.getElementById("button-2000").className = ""
  //     document.getElementById("button-2005").className = "selected"
  //     document.getElementById("button-2010").className = ""
  //     return false
  //   }

  //   document.getElementById("button-2010").onclick = (e) => {
  //     layer2000.remove()
  //     layer2005.remove()
  //     layer2010.remove()
  //     layer2010.addTo(myMap)
  //     document.getElementById("button-2000").className = ""
  //     document.getElementById("button-2005").className = ""
  //     document.getElementById("button-2010").className = "selected"
  //     return false
  //   }

