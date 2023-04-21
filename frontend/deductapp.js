/**
 *
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

const deductapp = {};

/**
 * @param {Object} deductService
 * @param {Object} ctors
 */
deductapp.DeductApp = function(deductService, ctors) {
  this.deductService = deductService;
  this.ctors = ctors;
};

deductapp.DeductApp.INTERVAL = 500; // ms


deductapp.DeductApp.showCost = function(cost) {
  $("#cost").text(cost);
}

/**
 * @param {string} msg
 */
deductapp.DeductApp.prototype.computeDeduction = function(employee, deps) {
  console.log('computing deduction...');
  var request = new this.ctors.ComputeDeductionRequest();
  request.setEmployeeName(employee);

  let dependents = [];

  deps.forEach(dep => {
    let dependent = new this.ctors.Dependent();
    dependent.setName(dep);
    dependents.push(dependent);
  });

  request.setDependentsList(dependents);

  var call = this.deductService.computeDeduction(request,
                                   {"custom-header-1": "value1"},
                                   function(err, response) {
    if (err) {
      console.error('Error: ' + '"' + err.message + '"' + err.message+'"');
    } else {
      setTimeout(function () {
        deductapp.DeductApp.showCost(response.getTotalCost());
      }, deductapp.DeductApp.INTERVAL);
    }
  });
  call.on('status', function(status) {
    if (status.metadata) {
      console.log("Received metadata");
      console.log(status.metadata);
    }
  });
};

/**
 * @param {Object} e event
 * @return {boolean} status
 */
deductapp.DeductApp.prototype.compute = function(e) {
  var employee = $("#employee").val().trim();
  //$("#msg").val(''); // clear the text box
  if (!employee) return false;

  var dv = $("#dependents").val().trim();
  deps = [];
  if (dv.length > 0) {
    deps = dv.split(',');
  }

  this.computeDeduction(employee, deps);

  return false;
};

/**
 * Load the app
 */
deductapp.DeductApp.prototype.load = function() {
  console.log("binding compute button");
  var self = this;
  $(document).ready(function() {
    // event handlers
    $("#compute").click(self.compute.bind(self));
    $("#employee").focus();
  });
};

module.exports = deductapp;
