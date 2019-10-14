/*
to do
disable add button 
add messagebox for confirm delete and popup for each button
add design to edit screen
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'text!../config.json', 'ojs/ojmodel', 'ojs/ojarraydataprovider', 'ojs/ojtable',
  'ojs/ojknockout',
  'ojs/ojknockout-model',
  'ojs/ojformlayout',
  'ojs/ojtoolbar',
  'ojs/ojarraydataprovider',
  'ojs/ojselectcombobox', 'ojs/ojbutton',
  'ojs/ojinputnumber', 'ojs/ojinputtext', 'ojs/ojbutton',
  'ojs/ojmessages', 'ojs/ojmessage', 'ojs/ojdialog', 'ojs/ojswitch', 'ojs/ojpopup'
],
  function (oj, ko, $, config) {

    function EditEmployeeViewModel() {
      var self = this;
      self.servername = JSON.parse(config).server;
      self.saveMethod = 'put';

      self.deptsList = ko.observableArray();
      self.deptSearch = ko.observable();
      self.deptIconCode = ko.observable('far fa-building');

      self.deptId = ko.observable();
      self.deptName = ko.observable();
      self.deptDescr = ko.observable();
      self.deptCountEmployees = ko.observable(1000);
      self.deptSalary = ko.observable();
      

      var salOptions = { style: 'currency', currency: 'EUR' };
      var salaryConverter = oj.Validation.converterFactory("number").createConverter(salOptions);
      self.filterEmpArray = [];

      self.isChecked = ko.observable();

      /*
            oj.Router.sync().then(
              function () {
                console.log('edit employee departmentId  = ' + departmentId);
                if (typeof(myVariable) == "undefined")
                  console.log ('its undefined');
                else
                  console.log ('its noe undefined');
              },
              function (error) {
                console.log('Error when starting the router: ' + error.message);
              }
            );
      */
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


      self.deptSearchFnc = function (event) {
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

        deptSearch = self.deptSearch();

        var xmlhttp = new XMLHttpRequest();
        var url = self.servername + 'dept/' + deptSearch;

        xmlhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            var deptJSON = JSON.parse(this.responseText);

            var iconCode = deptJSON[0].deptIconCode;

            if (iconCode == null){
              iconCode = 'far fa-building';
            }
            console.log('iconCode=' + iconCode);

            self.deptId(deptJSON[0].deptNo);
            self.deptName(deptJSON[0].deptName);
            self.deptDescr(deptJSON[0].deptDescr);
            self.deptCountEmployees(deptJSON[0].deptCountEmployees);
            self.deptSalary(salaryConverter.format(deptJSON[0].deptSalary));
            $('#deptIconCode').removeClass();
            $('#deptIconCode').addClass(iconCode);
          }
        };
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

    this.openPicture = function (event)
    {
      var popup = document.getElementById('popupMockup');
      popup.open('#btnGo');   
    }.bind(this);


    this.closePopuplListener = function (event)
    {
      var popup = document.getElementById('popupMockup');
      popup.close();   
    }.bind(this);

    self.cancelButtonClick = function () {
      document.getElementById('dialogForm').close();
    }

    self.deleteButton = function () {
      document.getElementById('dialogForm').open();
    }

    this.startAnimationListener = function(event)
    {
      var ui = event.detail;
      if (event.target.id !== "popupMockup")
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
        var selectedDept;
        selectedDept = sessionStorage.getItem("deptId");
        try
        {
        if(selectedDept != ''){
          self.servername = JSON.parse(config).server;
          console.log('self.servername =' + self.servername);
          console.log('### selectedDept=' + selectedDept);
          self.deptSearch(selectedDept);
        }
      }
      catch (err){

      }

      console.log('selectedDept='+selectedDept);
      if (selectedDept != null)
      {
        var xmlhttp = new XMLHttpRequest();
        var url = self.servername + 'dept/' + selectedDept;

        xmlhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            var deptJSON = JSON.parse(this.responseText);

            var iconCode = deptJSON[0].deptIconCode;

            console.log('descr=' + deptJSON[0].deptDescr);
            if (iconCode == null){
              iconCode = 'far fa-building';
            }

            self.deptId(deptJSON[0].deptNo);
            self.deptName(deptJSON[0].deptName);
            self.deptDescr(deptJSON[0].deptDescr);
            self.deptCountEmployees(deptJSON[0].deptCountEmployees);
            self.deptSalary(salaryConverter.format(deptJSON[0].deptSalary));
            $('#deptIconCode').addClass(iconCode);

          }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
      }
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function () {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      self.transitionCompleted = function () {
        // Implement if needed
      };
    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new EditEmployeeViewModel();
  }
);
