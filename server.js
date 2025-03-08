const grpc = require("@grpc/grpc-js");
//to compile the proto files to javascript
const protoLoader = require("@grpc/proto-loader");

//This loads and parses the .proto file.
const packageDef = protoLoader.loadSync("todo.proto");
//Loading into gRPC: The grpc.loadPackageDefinition() function converts the loaded .proto object into a gRPC-specific object that the server or client can use to interact with the service.
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server();
//http2 by default need credentials authentication. createInsecure means comunication not encrypted
server.bindAsync("0.0.0.0:40000", grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
        console.error("Server binding failed:", error);
        return;
    }
    console.log(`Server running at http://0.0.0.0:${port}`);
});

const todos = []

//Tell our server to use this service inside our proto file
server.addService(todoPackage.Todo.service, 
    {
        //Service name : function name
        "createTodo": createTodo,
        "readTodos": readTodos,
        "readTodoStream": readTodoStream
    }
)


//func in grpc always take 2 params call, callback
// The call object represents the incoming request and data from the client
// The callback function is used to send the response back to the client after processing the request.
function createTodo (call, callback) {
    const todoItem = {
        "id": call.request.id + 1,
        "text": call.request.text
    }
    todos.push(todoItem)
    callback(null, todoItem)
}

function readTodos (call, callback) {
    callback(null, {
        "items": todos
    })
}

//Why not send the entire array in one shot? Why use streaming?
//When you send the entire array at once, you load the entire data into memory
//  and send it over the network all at once, which might cause memory issues for large datasets and less scalable. Also client can start displaying todos one by one instaed of waiting for whole array
function readTodoStream (call, callback) {
    todos.forEach(t => call.write(t));
    call.end();
}