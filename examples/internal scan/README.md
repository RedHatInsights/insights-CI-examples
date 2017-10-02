This project illustrates how to perform an insights scan from within a container.

The project is a simple node.js "hello world!" server.  The included gulpfile has a 'test'
task, which shows how to invoke the insights client and process the response.

To build the example image from this directory, use:
```
# docker build -t example .
``` 
Run the insights scan inside a container by:
```
# docker run --rm -it -e INSIGHTS_USERNAME=my_username -e INSIGHTS_PASSWORD=my_password example npm test
```
To run the server normally, use:
```
# docker run --rm -it -p 9000:9000 example
```