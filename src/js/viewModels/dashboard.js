/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'text!../config.json', 'ojs/ojknockout', 'ojs/ojarraydataprovider',
    'ojs/ojtable', 'ojs/ojtoolbar', 'ojs/ojbutton', 'ojs/ojchart', 'ojs/ojinputtext', 'ojs/ojavatar', 'ojs/ojswitch', 'ojs/ojpopup'],
    function (oj, ko, $, config) {

        function DashboardViewModel() {
            //self = this;

            var servername = JSON.parse(config).server;

            self.deptArray = ko.observableArray();
            self.empArray = ko.observableArray();
            self.filterEmpArray = [];
            var deptChartArray = [];
            self.currentRowIndex = ko.observable();
            this.scrollPos = ko.observable({ rowIndex: 1 });
            self.pieSeriesValue = ko.observableArray();
            self.selectedDeptNo = 0;
            self.isChecked = ko.observable();
            self.chartType = ko.observable('pie');
            var selectedDept;
            var selectedEmp;
            self.departmentId = '';

            //self.avatarImage= ko.observable('');
            //var avatarImage = '';
/*
            oj.Router.sync().then(
                function () {
                    self.departmentId = oj.Router.rootInstance.retrieve();
                    console.log('self.departmentId  = ' + self.departmentId);
                },
                function (error) {
                    console.log('Error when starting the router: ' + error.message);
                }
            );
*/

            self.columnArray = [{
                "headerText": "Avatar",
                "renderer": oj.KnockoutTemplateUtils.getRenderer("avatar_image", true),
                "field": "avatarImage",
                "headerClassName": "oj-sm-only-hide",
                "className": "oj-sm-only-hide",
                "resizable": "enabled",
                "sortable": "disabled"
            },
                , {
                "headerText": "Number",
                "field": "empNo",
                "headerClassName": "oj-sm-only-hide",
                "className": "oj-sm-only-hide",
                "resizable": "enabled"
            },
            {
                "headerText": "First Name",
                "field": "firstName",
                "resizable": "enabled"
            },
            {
                "headerText": "Last Name",
                "field": "lastName",
                "resizable": "enabled"
            }];


            //var servername = 'http://conorsapps.com:4567/';
            //var servername = 'http://localhost:4567/';

            var salOptions = { style: 'decimal' };
            var salaryConverter = oj.Validation.converterFactory("number").createConverter(salOptions);

            self.pieSeriesValue = ko.observableArray();
            $.getJSON(servername + "dept/detail/").
                then(function (depts) {
                    var tempArray = [];
                    $.each(depts, function () {

                        self.countEmployees = ko.observable(salaryConverter.format(this.countEmployees));

                        tempArray.push({
                            deptNo: this.deptNo,
                            deptName: this.deptName,
                            countEmployees: self.countEmployees
                        });

                        deptChartArray.push({
                            name: this.deptName,
                            items: [this.countEmployees]
                        });

                    });
                    self.deptArray(tempArray);
                    self.pieSeriesValue(deptChartArray);
                });
            self.deptDataprovider = new oj.ArrayDataProvider(self.deptArray);


            $.getJSON(servername + "employee/dept/").
                then(function (emps) {
                    var tempArray = [];
                    $.each(emps, function () {

                        tempArray.push({
                            empNo: this.empNo,
                            firstName: this.firstName,
                            lastName: this.lastName,
                            avatarImage: this.avatarImage
                        });

                    });
                    empArray(tempArray);
                    filterEmpArray = tempArray;
                });
            self.empDataprovider = new oj.ArrayDataProvider(empArray);

            self.editDepartment = function (event) {

                sessionStorage.setItem("deptId", selectedDept);

                console.log('store selectedDept = ' + selectedDept);
                oj.Router.rootInstance.store(selectedDept);
                oj.Router.rootInstance.go("departments");
            }

            self.editEmployee = function (event) {

                sessionStorage.setItem("empId", selectedEmp);

                console.log('store selectedEmp = ' + selectedEmp);
                oj.Router.rootInstance.store(selectedEmp);
                oj.Router.rootInstance.go("employees");
            }


            self.deptSelectionListener = function (event) {
                console.log('deptSelectionListener');

                //retrieve previously selected department                
                oj.Router.sync().then(
                    function () {
                        self.departmentId = oj.Router.rootInstance.retrieve();
                        console.log('self.departmentId  = ' + self.departmentId);
                    },
                    function (error) {
                        console.log('Error when starting the router: ' + error.message);
                    }
                );

                self.clearClick();
                var data = event.detail;

                if (event.type == 'selectionChanged' && data['value'][0] != null) {
                    //get current selected row
                    var rowIndex = data['value'][0]['startIndex'].row;
                    console.log(self.deptArray()[rowIndex].deptNo);
                    selectedDept = self.deptArray()[rowIndex].deptNo;
                    console.log('selectedDept = ' + selectedDept);


                    self.selectedDeptNo = self.deptArray()[rowIndex].deptNo;

                    $.getJSON(servername + "employee/dept/" + selectedDeptNo).
                        then(function (emps) {
                            var a;
                            var tempArray = [];
                            self.inputAvatarImage = ko.observable();
                            $.each(emps, function () {
                                /*
            
                            if(this.imageid == '')
                                this.avatarImage('');
                            else if (this.gender == 'M')
                            {
                                console.log(this.gender + ' this.imageId='+this.imageId + ' '+a);
                                this.avatarImage('css/images/men/' + this.imageId + '.jpg');
                                a = 'css/images/men/' + this.imageId + '.jpg';
                            }
                            else if (this.gender == 'F')
                            {
                                console.log(this.gender + ' this.imageId='+this.imageId + ' '+a);
                                this.avatarImage('css/images/women/' + this.imageId + '.jpg');
                            }
                            else
                            {
                                this.avatarImage('');
                            }
                            */
                                tempArray.push({
                                    empNo: this.empNo,
                                    firstName: this.firstName,
                                    lastName: this.lastName,
                                    avatarImage: this.avatarImage
                                });
                            });
                            empArray(tempArray);
                            console.log(tempArray);
                            filterEmpArray = tempArray;
                        });
                        
                };
            };

            self.empSelectionListener = function (event) {
                console.log('empSelectionListener');

                /*
                oj.Router.sync().then(
                    function () {
                        self.departmentId = oj.Router.rootInstance.retrieve();
                        console.log('self.departmentId  = ' + self.departmentId);
                    },
                    function (error) {
                        console.log('Error when starting the router: ' + error.message);
                    }
                );
                */

                self.clearClick();
                var data = event.detail;

                if (event.type == 'selectionChanged' && data['value'][0] != null) {
                    //get current selected row
                    var rowIndex = data['value'][0]['startIndex'].row;
                    console.log(self.empArray()[rowIndex].empNo);
                    selectedEmp = self.empArray()[rowIndex].empNo;
                    console.log('selectedEmp = ' + selectedEmp);
                        
                };
            };


            self.switchClick = function (event) {
                if (self.isChecked()) {
                    //document.getElementById("hideDiv").style.display = "block";
                    $(".hideDiv").show();
                }
                else {
                    //document.getElementById("hideDiv").style.display = "none";
                    $(".hideDiv").hide();
                }
            }
/*
            self.switchAction = function (event) {
            }
*/

            this.openPicture = function (event)
            {
              var popup = document.getElementById('popup1');
              popup.open('#btnGo');   
            }.bind(this);
            
            this.closePopuplListener = function (event)
            {
              var popup = document.getElementById('popup1');
              popup.close();   
            }.bind(this);

            this.startAnimationListener = function(event)
            {
              var ui = event.detail;
              if (event.target.id !== "popup1")
                return;
               
              if ("open" === ui.action)
              {
                event.preventDefault();
                var options = {"duration": "200ms"};
                oj.AnimationUtils.fadeIn(ui.element, options).then(ui.endCallback);
              }
              else if ("close" === ui.action)
              {
                event.preventDefault();
                ui.endCallback();
              }
            }.bind(this);

            self.connected = function () {
            };

            self.disconnected = function () {
            };

            self.transitionCompleted = function () {
            };


            self.filter = ko.observable();
            self.empDataprovider = new ko.observable(new oj.ArrayDataProvider(empArray, { keyAttributes: 'empNo' }));
            self.highlightChars = [];

            self.handleValueChanged = function () {
                var myfilter = self.filter();
                //self.selectedDeptNo = self.deptArray()[rowIndex].deptNo;

                $.getJSON(servername + "employee/emplike/" + self.selectedDeptNo + "/" + myfilter).

                    then(function (emps) {
                        var tempArray = [];
                        $.each(emps, function () {

                            tempArray.push({
                                empNo: this.empNo,
                                firstName: this.firstName,
                                lastName: this.lastName,
                                avatarImage: this.avatarImage
                            });

                        });
                        empArray(tempArray);
                        //self.filterEmpArray = tempArray;
                    });
                /*
                          self.highlightChars = [];
                          var filter = document.getElementById('filter').rawValue;
                          if (filter.length == 0)
                          {
                              self.clearClick();
                              return;
                          }
                          
                          //var empArray = [];
                          //var filterEmpArray = empArray();
                          var localEmpArray = [];
                          var i, id;
                
                
                          for (i = self.filterEmpArray.length - 1; i >= 0; i--)
                          {
                              id = self.filterEmpArray[i].empNo;
                              Object.keys(self.filterEmpArray[i]).forEach(function(field) 
                              {
                                  if (self.filterEmpArray[i][field].toString().toLowerCase().indexOf(filter.toLowerCase()) >= 0)
                                  //if (self.filterEmpArray[i][field].toString().indexOf(filter.toLowerCase()) >= 0)
                                  {
                                      self.highlightChars[id] = self.highlightChars[id] || {};
                                      self.highlightChars[id][field] = getHighlightCharIndexes(filter, self.filterEmpArray[i][field]);
                                      if (localEmpArray.indexOf(self.filterEmpArray[i]) < 0)
                                      {
                                        localEmpArray.push(self.filterEmpArray[i]);
                                      }
                                  }
                              });
                          }
                          
                         for (i = self.filterEmpArray.length - 1; i >= 0; i--)
                         {
                             localEmpArray.push(self.filterEmpArray[i]);
                         }
                
                         localEmpArray.reverse();
                          self.empDataprovider(new oj.ArrayDataProvider(localEmpArray, {keyAttributes: 'empNo'}));
                          
                          function getHighlightCharIndexes(highlightChars, text)
                          {
                              var highlightCharStartIndex = text.toString().toLowerCase().indexOf(highlightChars.toString().toLowerCase());
                              return {startIndex: highlightCharStartIndex, length: highlightChars.length};
                          };
                          */

            };

            self.clearClick = function (event) {
                console.log('clearClick called');
                self.filter('');
                self.empDataprovider(new oj.ArrayDataProvider(empArray, { keyAttributes: 'empNo' }));
                self.highlightChars = [];
                document.getElementById('filter').value = "";
                return true;

            }

            self.highlightingCellRenderer = function (context) {
                var id = context.row.empNo;
                var startIndex = null;
                var length = null;
                var field = null;
                if (context.columnIndex === 0) {
                    field = 'empNo';
                }
                else if (context.columnIndex === 1) {
                    field = 'firstName';
                }
                else if (context.columnIndex === 2) {
                    field = 'lastName';
                }
                /*
                else if (context.columnIndex === 3)
                {    
                    field = 'hireDate';
                }
                */

                var data = context.row[field].toString();
                if (self.highlightChars[id] != null &&
                    self.highlightChars[id][field] != null) {
                    startIndex = self.highlightChars[id][field].startIndex;
                    length = self.highlightChars[id][field].length;
                }
                if (startIndex != null &&
                    length != null) {
                    var highlightedSegment = data.substr(startIndex, length);
                    data = data.substr(0, startIndex) + '<b>' + highlightedSegment + '</b>' + data.substr(startIndex + length, data.length - 1);
                }
                $(context.cellContext.parentElement).append(data);
            };


        }

        return new DashboardViewModel();
    }
);
