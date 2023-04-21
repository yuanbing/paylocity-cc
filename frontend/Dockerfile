FROM grpcweb/prereqs

ADD . /src

WORKDIR /src

RUN mkdir api

RUN protoc -I=. deduction.proto \
--js_out=import_style=commonjs:./api \
--grpc-web_out=import_style=commonjs,mode=grpcwebtext:./api


RUN npm install && \
  npm link grpc-web && \
  npx webpack && \
  cp index.html /var/www/html && \
  cp dist/main.js /var/www/html/dist

WORKDIR /var/www/html

EXPOSE 8081
CMD ["python", "-m", "SimpleHTTPServer", "8081"]
