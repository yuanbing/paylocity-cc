FROM yuanbing/gen-js-api
ADD . /src

WORKDIR /src

RUN mkdir api && \
	cp /proto/jsclient/*.js /src/api/


RUN npm install && \
  npm link grpc-web && \
  npx webpack && \
  cp index.html /var/www/html && \
  cp dist/main.js /var/www/html/dist

WORKDIR /var/www/html

EXPOSE 8081
CMD ["python", "-m", "SimpleHTTPServer", "8081"]
