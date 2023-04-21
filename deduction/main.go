package main

import (
	"context"
	"errors"
	"log"
	"math"
	"net"
	"strings"

	pb "github.com/yuanbing/paylocity/deduction/api/v1"
	"google.golang.org/grpc"
)

const (
	listenAddress = "0.0.0.0:9090"
	GrossPayPerPaycheck = 2000.0
	EmployeeDeduction = 1000.0
	DependentDeduction = 500.0
	TotalPaychecks = 26
	Discount = 0.10
)

func applyDiscount(name string, cost float64) float64 {
	lname := strings.ToLower(name)
	if strings.HasPrefix(lname, "a") {
		log.Printf("applied discount to %s\n", name)
		return cost*(1.0-Discount)
	} else {
		log.Printf("no discount applied to %s\n", name)
		return cost
	}
}

type deductionService struct {

}

func (t *deductionService) ComputeDeduction(ctx context.Context, req *pb.ComputeDeductionRequest) (*pb.ComputeDeductionResponse, error) {
	log.Println("Got deduction computation request")

	employeeName := strings.Trim(req.EmployeeName, " ")

	if employeeName == "" {
		return nil, errors.New("Empty employee name")
	}

	log.Printf("start compute deduction for %s\n", employeeName)

	var totalDeduct float64
	totalDeduct += applyDiscount(employeeName, EmployeeDeduction)

	// go through the list of dependents
	for i := 0; i < len(req.Dependents); i++ {
		depName := strings.Trim(req.Dependents[i].Name, " ")
		if depName == "" {
			return nil, errors.New("Empty dependent name")
		}
		totalDeduct += applyDiscount(depName, DependentDeduction)
	}

	if GrossPayPerPaycheck*float64(TotalPaychecks) <= totalDeduct {
		// being super paranoid here, in reality this should never happen!
		log.Printf("Too much deduct: %v\n", totalDeduct)
		return nil, errors.New("Too much deduct")
	}

	avgDeduct := math.Floor((totalDeduct/float64(TotalPaychecks))*100/100)
	var detail [TotalPaychecks]*pb.ComputeDeductionResponseDeduction 
	var currentDeduct float64
	for i := 0; i < TotalPaychecks-1; i++ {
		currentDeduct += avgDeduct
		detail[i] = new(pb.ComputeDeductionResponseDeduction)
		detail[i].PaycheckNo = int32(i+1)
		detail[i].DeductionAmount = avgDeduct
	}
	detail[TotalPaychecks-1] = new(pb.ComputeDeductionResponseDeduction)
	detail[TotalPaychecks-1].PaycheckNo = TotalPaychecks
	detail[TotalPaychecks-1].DeductionAmount = totalDeduct-currentDeduct


	resp := new(pb.ComputeDeductionResponse)
	resp.TotalCost = totalDeduct
	resp.Detail = detail[:]
	return resp, nil
}

func main() {
	log.Printf("Benefit Deduction service starting on %s", listenAddress)
	lis, err := net.Listen("tcp", listenAddress)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterDeductionServiceServer(s, &deductionService{})

	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}