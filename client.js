const grpc = require("@grpc/grpc-js");
//to compile the proto files to javascript
const protoLoader = require("@grpc/proto-loader");

//This loads and parses the .proto file.
const packageDef = protoLoader.loadSync("todo.proto");
//Loading into gRPC: The grpc.loadPackageDefinition() function converts the loaded .proto object into a gRPC-specific object that the server or client can use to interact with the service.
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;


const client = new todoPackage.Todo("localhost:40000", grpc.credentials.createInsecure())

client.createTodo({
    "id": -1,
    "text": "洗衣服"
}, (err, response) => {
    //gRPC automatically deserializes that binary data into a JavaScript object when it reaches the client.
    //So we need call json.stringify to convert javascript object to json
    console.log("recieved from server" + JSON.stringify(response))
})

client.readTodos({

}, (err, response) => {
    console.log("todos list are " + JSON.stringify(response))
})

//returns a call object which u can liste to events
const call = client.readTodoStream();
//when server sends data, do smth
call.on("data", item => {
    console.log("received item fro mserver" + JSON.stringify(item))
})

call.on("end", e => console.log("server is done"))