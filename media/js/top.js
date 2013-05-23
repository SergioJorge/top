/*global $, PrettyJSON */

var Top = {
    init: function() {
        this.bindEvents();
    },
    bindEvents: function () {
        var run = $("#run");
        var addButton = $("#addButton");

        run.click(function(){
            var url = $("#url").val();
            var query = $("#query").val();
            Top.run(url, query);
        });
        
        addButton.click(function(){
            Top.addButton();
        });
        
    },
    run: function(url, query){
        $.post(url, query).done(function(data){
            Top.prettyJson("#response", data);
            var chart = $("#chart");
            chart.show();
            Top.createChart(data);
        }).fail(function(data){
            var chart = $("#chart");
            chart.hide();
            Top.prettyJson("#response", data);
        });
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
    createChart: function(data){
        var chart = $('#chart');
        var explain = this.explainQuery(data);
        chart.highcharts({
                    chart: {
                        type: 'line',
                        marginRight: 130,
                        marginBottom: 25
                    },
                    title: {
                        text: 'Query',
                        x: -20 //center
                    },
                    xAxis: {
                        categories: []
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
                    series: [{
                        name: 'Primeira Query',
                        data: explain
                    }]
                });
    },
    addButton: function(){
        var textarea = $("#first-query");
        if ($(".query").length < 2){
            textarea.after('<textarea  rows="8" cols="40", class="query"></textarea>');
        }
    }
};


Top.init();
