module github.com/yuanbing/paylocity/deduction

go 1.20

require (
	github.com/golang/protobuf v1.5.3
	google.golang.org/grpc v1.54.0
	google.golang.org/protobuf v1.30.0
)

require (
	golang.org/x/net v0.9.0 // indirect
	golang.org/x/sys v0.7.0 // indirect
	golang.org/x/text v0.9.0 // indirect
)

replace github.com/yuanbing/paylocity/deduction/api => ./
