/*global $, PrettyJSON */

var Top = {
    listResultQueries: [],
    listExplain: [],

    init: function(){
        this.bindEvents();
    },
    bindEvents: function(){
        var run = $("#run");
        var addButton = $("#addButton");
        
        $(".container").on("click", ".removeButton", function(){
            this.parentElement.remove();
        });

        run.click(function(){
            Top.url = $("#url").val();
            Top.run();
        });
        
        addButton.click(function(){
            Top.addQuery();
        });
    },    
    clearLists: function(){
        this.listResultQueries = [];
        this.listExplain = [];
        $('#response').hide();
        
    },
    run: function(){
        var url = $("#url");
        if (url.val()){
            this.clearLists();
            this.makeQueries();
        }
    },
    prettyJson: function(selector, data){
        new PrettyJSON.view.Node({
          el:$(selector),
          data:data
        });
    },
    explainQuery: function(data){
        var list = [];
        for (var i=0; i < data.hits.hits.length; i++) {
            list.push(data.hits.hits[i]._score);
        }
        return list;
    },
    makeSeries: function(numberOfQuery, explain){
        this.listExplain.push({ name: 'Query' + (numberOfQuery + 1), data: explain});
    },
    createChart: function(){
        var chart = $('#chart');
        for (var i=0; i < this.listResultQueries.length; i++){
            var explain = this.explainQuery(this.listResultQueries[i]);
            this.makeSeries(i, explain);
        }
        chart.highcharts({
                    chart: {
                        type: 'line',
                        marginRight: 130,
                        marginBottom: 50
                    },
                    title: {
                        text: 'Query',
                        x: -20 //center
                    },
                    credits: {
                        enabled: false
                    },
                    xAxis: {
                        categories: [],
                        title: {
                            text: "Number of Documents"
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Score of document'
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },
                    tooltip: {
                        valueSuffix: ' score'
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        x: -10,
                        y: 100,
                        borderWidth: 0
                    },
                    series: this.listExplain
                });
    },
    addQuery: function(){
        var textareas = $(".queries");
        this.numberQueries = $(".query").length + 1;
        textareas.append('<div id="aggregator-'+this.numberQueries+'" class="aggregator"></div>');
        var aggregator = $('#aggregator-'+this.numberQueries);
        aggregator.append('<textarea  rows="8" cols="40", class="query" id="query-'+this.numberQueries+'"></textarea>');
        aggregator.append('<button type="button" class="removeButton btn close">&times;</button>');
    },
    makeQueries: function(){
        var queries = $(".query");
        this.postEsearch(queries);
        if(this.listResultQueries.length >= 1){
            this.createChart();
        }
    },
    postEsearch: function(queries){
        for(var i=0; i < queries.length; i++){
            var query = $(queries[i]).val();
            $.ajax({
              type: 'POST',
              url: this.url,
              data: query,
              error: function(data){$('#response').show();Top.prettyJson("#response", JSON.parse(data.responseText));},
              success: function(data){Top.listResultQueries.push(data);},
              async:false
            });
        }
    }
};


Top.init();
