proto:
	@echo "--> Generating golang client..."
	@docker run \
		-v `pwd`/api:/api \
		-v `pwd`/deduction:/goclient \
		jfbrandhorst/grpc-web-generators \
		protoc \
			-I=/api \
	  		--go_out=plugins=grpc,paths=source_relative:/goclient \
	 		/api/v1/deduction.proto

build:
	@echo "--> Building services ..."
	@echo "----> Compiling API ..."
	@docker run \
		-v `pwd`/api:/api \
		-v `pwd`/deduction:/goclient \
		jfbrandhorst/grpc-web-generators \
		protoc \
			-I=/api \
	  		--go_out=plugins=grpc,paths=source_relative:/goclient \
	 		/api/v1/deduction.proto
	@echo "----> building frontend and service ..."
	@docker-compose build gen-js-api frontend deduction-server

run:
	@echo "--> Starting services ..."
	@docker-compose up deduction-server envoy frontend -d

shutdown:
	@echo "--> Stopping services ..."
	@docker-compose down