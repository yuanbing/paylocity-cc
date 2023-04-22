#generate API for JS
FROM grpcweb/prereqs

ADD ./v1 /proto

WORKDIR /proto

RUN mkdir jsclient

RUN protoc -I=. deduction.proto \
--js_out=import_style=commonjs:./jsclient \
--grpc-web_out=import_style=commonjs,mode=grpcwebtext:./jsclient
