function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

  var metas = d3.select('#sample-metadata');

  d3.json(`/metadata/${sample}`).then((new_meta) => {

    var data = new_meta;

    metas.html("")*-

    Object.entries(new_meta)

    .forEach(([key,value]) =>  {
      metas

      .append('tr')

      .text(`${key}:${value}`)

    });





    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    

    let gauges = {

      domain: {
        x: [0,1],
        y: [0,1],
      },
    
      value: data.WFREQ,
      title: {
        text: 'Belly Button Washing Frequency' ,
      },
    
      type: 'indicator',
      mode:'gauge+number+delta',
      delta: {
        reference: 4
      },

      gauge: {

        axis: {
          range: [null,9]
        },
        steps: [
          {range: [0,1], color: "white"},
          {range: [1,2], color: "beige"},
          {range: [2,3], color: "aliceblue"},
          {range: [3,4], color: "azure"},
          {range: [4,5], color: "ivory"},
          {range: [5,6], color: "cornsilk"},
          {range: [6,7], color: "skyblue"},
          {range: [7,8], color: "blue"},
          {range: [8,9], color: "brown"},

        ]

      }
    
    };
    
    let extra = [gauges];
    
    Plotly.newPlot('gauge',extra)
    
  });
}



function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

  let build_url = `/samples/${sample}`;

  
  
  d3.json(build_url).then((data) =>  {

  // @TODO: Build a Bubble Chart using the sample data

    let bubbles = {

      x: data.otu_ids,
      y: data.sample_values,
      mode: `markers`,
      text: data.otu_labels,
      marker: {
        size: data.sample_values,
        color: data.otu_ids
      }
    };

  let bubble = [bubbles];  

  let bLayout = {

    title: 'Belly Bacteria',
    xaxis: {
      title: 'otu_ids'
    }

   
  };

  Plotly.newPlot('bubble', bubble,bLayout);


  // @TODO: Build a Pie Chart

    let pies = {

      labels: data.otu_ids.slice(0,10),
      values: data.sample_values.slice(0,10),
      hovertext: data.otu_labels.slice(0,10),
      type: 'pie'
      
    }

  let piers = [pies];  

  let PLayout = {

    title: 'Belly Bacteria'
  
  };

  Plotly.newPlot('pie', piers,PLayout);

  
  

    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).


});

};


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {

    //console.log(sampleNames[0]);
    let datas = sampleNames

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
        
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
