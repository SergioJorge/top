/*global describe, it, spyOn, expect, Top, beforeEach, $, afterEach, document*/
/*jshint multistr: true */

describe("Top", function() {

    beforeEach(function() {
        var markup = '<div class="span2" id="helper">\
            <ul class="nav nav-tabs nav-stacked">\
                <li>\
                    <a id="addQuery">New Query</a>\
                </li>\
                <li>\
                    <a id="run">Run</a>\
                </li>\
            </ul>\
        </div>\
        <div class="container" id="test">\
            <div class="row">\
                <div class="offset1 span9">\
                    <label for="url">Url :</label>\
                    <input type="text" value="" id="url">\
                    <br />\
                    <label for="first-query">Query :</label>\
                    <fieldset class="queries">\
                        <textarea name="Query" rows="8" cols="40" class="query" id="first-query"></textarea>\
                    </fieldset>\
                    <br />\
                    <br />\
                    <div id="response">\
                    </div><br />\
                    <div id="chart">\
                    </div>\
                </div>\
                <div id="response"></div><br />\
                <div id="chart"></div>\
            </div>\
        </div>';
        $('body').prepend(markup);
    });

    afterEach(function() {
        document.querySelector('#helper').remove();
        document.querySelector('#test').remove();
    });

    it("should call method run", function(){
        var spy = spyOn(Top, 'run').andCallThrough();
        $("#run").click();
        expect(spy).toHaveBeenCalled();
    });

    it("should click in new query button and create a new textarea", function(){
        $("#addQuery").click();
        var lengthQueries = $('.queries textarea').length;
        expect(lengthQueries).toBe(2);
    });

    it("should click in new query and remove the same ", function(){
        $("#addQuery").click();
        var lengthQueries = $('.queries textarea').length;
        expect(lengthQueries).toBe(2);
        $(".queries .removeButton").click();
        lengthQueries = $('.queries textarea').length;
        expect(lengthQueries).toBe(1);
    });

    describe("requests", function(){
        beforeEach(function(){
          spyOn($, 'ajax');
        });

        describe("valid json", function() {
          var chart, data;

          beforeEach(function(){
            chart = $("#chart");
            $("#url").val("http://localhost:1980/admin/_search");
            $("#first-query").val("{}");
            data = {hits:{hits:[{_score:0.057534903}]}}
          });


          it("should make query and create a chart", function(){
              var chartEmpty = chart.height();
              expect(chartEmpty).toEqual(0);
              $.ajax.andCallFake(function(args) {
                args.success(data);
              });
              $("#run").click();
              var chartHeigth = chart.height();
              expect(chartHeigth).not.toEqual(0);
          });
        });


        describe("invalid json", function(){
          var failMessage = 'Fail!';

          beforeEach(function(){
            $("#url").val("http://localhost:1980/admin/_search");
            $("#first-query").val("INVALID JSON");
            spyOn(PrettyJSON.view,'Node').andReturn(null);
          });

          it("should make a query with invalid json and return a error response", function(){
              $("#run").click();
              $.ajax.mostRecentCall.args[0].error({responseText: JSON.stringify(failMessage)})
              expect(PrettyJSON.view.Node).toHaveBeenCalled();
              expect(PrettyJSON.view.Node.mostRecentCall.args[0].el).toEqual($("#response"));
              expect(PrettyJSON.view.Node.mostRecentCall.args[0].data).toEqual(failMessage);
          });
      });
    });
});
