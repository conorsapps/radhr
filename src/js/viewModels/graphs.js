define(['ojs/ojcore', 'knockout', 'jquery', 'text!../config.json', 'ojs/ojarraydataprovider', 'ojs/ojknockout', 
  'ojs/ojchart', 'ojs/ojbutton'],
  function (oj, ko, $, config, ArrayDataProvider) {

    function AboutViewModel() {
      var self = this;

      var servername = JSON.parse(config).server;


      self.genderChartData = ko.observableArray();

      self.pieSeriesValue = ko.observableArray();
      self.chartType = ko.observable('pie');

      var deptChartArray = [];
      var salaryChartArray = [];


      var salOptions = { style: 'decimal' };
      var salaryConverter = oj.Validation.converterFactory("number").createConverter(salOptions);

      self.salaryPieSeriesValue = ko.observableArray();
      self.salaryChartType = ko.observable('bar');


      self.pieSeriesValue = ko.observableArray();
      var graphUrl = servername + "dept/detail/";
      console.log(graphUrl);

      $.getJSON(graphUrl).
        then(function (depts) {
          $.each(depts, function () {

            self.countEmployees = ko.observable(salaryConverter.format(this.countEmployees));

            deptChartArray.push({
              name: this.deptName,
              items: [this.countEmployees]
            });

          });
          self.pieSeriesValue(deptChartArray);
        });

      var salaryGraphUrl = servername + "employee/salarySum";

      $.getJSON(salaryGraphUrl).
        then(function (depts) {
          var tempArray = [];
          $.each(depts, function () {

            self.salary = ko.observable(salaryConverter.format(this.salary));

            salaryChartArray.push({
              name: this.deptName,
              items: [this.salary]
            });

          });
          //self.deptArray(tempArray);
          self.salaryPieSeriesValue(salaryChartArray);
        });

        var genderData = '[{"id": 0,"series": "Male","group": "Group A","value": 45},{"id": 1,"series": "Female","group": "Group A","value": 55}]';

        self.genderChartData = ko.observableArray(JSON.parse(genderData));
        this.dataProvider = new ArrayDataProvider(self.genderChartData, {keyAttributes: 'id'});


      self.connected = function () {
      };

      self.disconnected = function () {
      };

      self.transitionCompleted = function () {
      };
    }

    return new AboutViewModel();
  }
);
