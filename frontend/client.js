const {ComputeDeductionRequest} = require('./api/deduction_pb.js');
const {DeductionServiceClient} = require('./api/deduction_grpc_web_pb.js');
const {DeductApp} = require('./deductapp.js');
const grpc = {};
grpc.web = require('grpc-web');



var deductService = new DeductionServiceClient('http://'+window.location.hostname+':8080', null,null);

var app = new DeductApp(
  deductService,
  {
    ComputeDeductionRequest: ComputeDeductionRequest,

    Dependent: ComputeDeductionRequest.dependent
  }
);

console.log("Loading deduct app...");

app.load();