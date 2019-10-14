define(['ojs/ojcore', 'knockout', 'jquery', 'text!../config.json', 'ojs/ojmodel', 'ojs/ojarraydataprovider', 'ojs/ojtable',
  'ojs/ojknockout',
  'ojs/ojknockout-model',
  'ojs/ojformlayout',
  'ojs/ojtoolbar',
  'ojs/ojarraydataprovider',
  'ojs/ojselectcombobox',
  'ojs/ojinputnumber', 'ojs/ojinputtext', 'ojs/ojbutton', 'ojs/ojdatetimepicker', 'ojs/ojselectcombobox',
  'ojs/ojmessages', 'ojs/ojmessage', 'ojs/ojdialog', 'ojs/ojswitch', 'ojs/ojpopup'
],
  function (oj, ko, $, config) {

    function EditDepartmentViewModel() {
      var self = this;
      self.servername = JSON.parse(config).server;
      self.saveMethod = 'put';

      self.empList = ko.observableArray();
      self.empSearch = ko.observable();

      self.deptsList = ko.observableArray();
      self.deptSearch = ko.observable();
      self.deptIconCode = ko.observable('far fa-building');

      self.deptId = ko.observable();
      self.deptName = ko.observable();
      self.empId = ko.observable();
      self.firstName = ko.observable();
      self.lastName = ko.observable();
      self.birthDate = ko.observable();
      self.gender = ko.observable();
      self.hireDate = ko.observable();
      self.salary = ko.observable();
      self.avatarImage = ko.observable();

      var salOptions = { style: 'currency', currency: 'EUR' };
      var salaryConverter = oj.Validation.converterFactory("number").createConverter(salOptions);
      self.filterEmpArray = [];

      self.isChecked = ko.observable();

      $.getJSON(self.servername + "dept/").
        then(function (depts) {
          var deptArray = [];
          $.each(depts, function () {
            deptArray.push({
              value: this.deptNo,
              label: this.deptNo + ' - ' + this.deptName
            });
          });
          self.deptsList(deptArray);
        });


      self.deptListDataProvider = new oj.ArrayDataProvider(self.deptsList, { keyAttributes: 'value' });

      $.getJSON(self.servername + "employee/").
        then(function (emps) {
          var empArray = [];
          $.each(emps, function () {
            empArray.push({
              value: this.emp_no,
              label: this.emp_no + ' - ' + this.first_name + ' ' + this.last_name
            });
          });
          self.empList(empArray);
        });



      self.empListDataProvider = new oj.ArrayDataProvider(self.empList, { keyAttributes: 'value' });


      self.deptSearchFnc = function (event) {
        //search even
      };

      self.empSearchFnc = function (event) {
        //search even
      };

      self.okButtonClick = function () {
        var deleteUrl = self.servername + 'dept/';

        var deleteData;
        //console.log(self.deptId());
        deleteData = {
          deptNo: self.deptId()
        }
        deleteJson = JSON.stringify(deleteData);

        fetch(deleteUrl, {
          method: 'delete'
          , headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
          , body: deleteJson
        }).then(function (response) {
          if (response.status !== 200) {
            return;
          }
          else {
            self.deptId('');
            self.deptName('');
            self.deptDescr('');
            self.deptCountEmployees(0);
            document.getElementById("deleteMessage").style.visibility = "visible";

          }
        }).then(function (data) {
        }).catch(error => console.log(error))

        document.getElementById('dialogForm').close();
      }

      self.addButton = function (event) {
        //search even
        $("#addButton").disabled = true;
        //change to post for insert
        self.saveMethod = 'post';

        self.deptId('');
        self.deptName('');
        self.deptDescr('');
        self.deptCountEmployees(0);

        document.getElementById("saveDiv").style.display = "block";
      };

      self.searchButtonClick = function (event) {
        empSearch = self.empSearch();
        var url = self.servername + 'employee/' + empSearch;
  
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            var empJSON = JSON.parse(this.responseText);
            console.log(empJSON);

            self.deptId(empJSON[0].deptNo);
            self.deptName(empJSON[0].deptName);
            self.empId(empJSON[0].empNo);
            self.firstName(empJSON[0].firstName);
            self.lastName(empJSON[0].lastName);
            self.birthDate(empJSON[0].birthDate);
            self.gender(empJSON[0].gender);
            self.hireDate(empJSON[0].hireDate);
            self.salary(empJSON[0].salary);
            self.avatarImage(empJSON[0].avatarImage);
            var avatarImageSrc = empJSON[0].avatarImage;

            $('#avatarImage').attr('src', avatarImageSrc);
          }
        }
        console.log(url);
        xmlhttp.open("GET", url, true);
        xmlhttp.send();

      }

      self.saveButtonClick = function (event) {
        console.log(self.saveMethod);
        url = self.servername + 'dept/'
        var addDeptData = {
          deptNo: self.deptId(),
          deptName: self.deptName(),
          deptDescr: self.deptDescr()
        }
        var addDeptJson = JSON.stringify(addDeptData);
        console.log(addDeptJson)

        fetch(self.servername + 'dept/', {
          method: self.saveMethod
          , headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
          , body: addDeptJson
        }).then(function (response) {
          console.log('response then');
          console.log(response);
          if (response.status == 200) {
            document.getElementById("saveMessage").style.visibility = "visible";
          }
          return response.json();
        }).catch(error => console.log(error))

        //change to post for insert
        self.saveMethod = 'put';
        document.getElementById("saveDiv").style.display = "none";

      }

      self.switchClick = function (event) {
        console.log('switch click isChecked=' + self.isChecked());
        if (self.isChecked()) {
          //document.getElementById("hideDiv").style.display = "block";
          $(".hideDiv").show();
        }
        else {
          //document.getElementById("hideDiv").style.display = "none";
          $(".hideDiv").hide();
        }
      }

      this.openPicture = function (event) {
        var popup = document.getElementById('popupMockup');
        popup.open('#btnGo');
      }.bind(this);


      this.closePopuplListener = function (event) {
        var popup = document.getElementById('popupMockup');
        popup.close();
      }.bind(this);

      self.cancelButtonClick = function () {
        document.getElementById('dialogForm').close();
      }

      self.deleteButton = function () {
        document.getElementById('dialogForm').open();
      }

      this.startAnimationListener = function (event) {
        var ui = event.detail;
        if (event.target.id !== "popupMockup")
          return;

        if ("open" === ui.action) {
          event.preventDefault();
          var options = { "duration": "200ms" };
          oj.AnimationUtils.fadeIn(ui.element, options).then(ui.endCallback);
        }
        else if ("close" === ui.action) {
          event.preventDefault();
          ui.endCallback();
        }
      }.bind(this);


      self.connected = function () {
        var selectedEmp = '';
        selectedEmp = sessionStorage.getItem("empId");
        console.log('getItem selectedEmp=' + selectedEmp);
        try {
          if (selectedEmp != '') {
            self.servername = JSON.parse(config).server;
            self.empSearch(selectedDept);
          }
        }
        catch (err) {
        }

        selectedEmp = (selectedEmp == null) ? '' : selectedEmp;

        if (selectedEmp != '') {
          var xmlhttp = new XMLHttpRequest();
          var url = self.servername + 'employee/' + selectedEmp;
          console.log(url);
          xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
              console.log(this.responseText);
              var empJSON = JSON.parse(this.responseText);
              console.log(empJSON[0]);

              self.deptId(empJSON[0].deptNo);
              self.deptName(empJSON[0].deptName);
              self.empId(empJSON[0].empNo);
              self.firstName(empJSON[0].firstName);
              self.lastName(empJSON[0].lastName);
              self.birthDate(empJSON[0].birthDate);
              self.gender(empJSON[0].gender);
              self.hireDate(empJSON[0].hireDate);
              self.salary(empJSON[0].salary);
              self.avatarImage(empJSON[0].avatarImage);
              var avatarImageSrc = empJSON[0].avatarImage;

              $('#avatarImage').attr('src', avatarImageSrc);

              }
          };
          xmlhttp.open("GET", url, true);
          xmlhttp.send();
        }

      };

      self.disconnected = function () {
      };

      self.transitionCompleted = function () {
      };
    }

    return new EditDepartmentViewModel();
  }
);
