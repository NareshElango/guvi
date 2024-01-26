const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const EmployeeSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    dob: String,
    bloodGroup: String,
    address: String,
    phoneNumber: String,
    age: Number, 
    gender: String 
});

const Employee = mongoose.model('Employees', EmployeeSchema);

mongoose.connect("mongodb+srv://naresh123:naresh123@cluster0.0fmw67g.mongodb.net/?retryWrites=true&w=majority")
    .then(() => {
        app.listen(3000, () => {
            console.log("Connection established to DB\nListening to port 3000:)");
        });
    })
    .catch(err => {
        console.error("Error connecting to MongoDB:", err);
    });

app.post('/register', (req, res) => {
    Employee.create(req.body)
        .then(employee => res.json(employee))
        .catch(err => res.json(err));
});


app.post("/login", (req, res) => {
    const { email, password } = req.body;
    Employee.findOne({ email: email }).then(user => {
        if (user) {
            if (user.password === password) {
                res.json({message:"Success", id:user._id});
            } else {
                res.json("Incorrect password");
            }
        } else {
            res.json("No record exists");
        }
    });
});

app.post("/:id/updateprofile", (req, res) => {
    const { dob, bloodGroup, address, phoneNumber, age, gender } = req.body;
    const id = req.params.id;
    console.log(id);

    Employee.findByIdAndUpdate(id, { dob, bloodGroup, address, phoneNumber, age, gender }, { new: true })
    .exec()
    .then(updatedEmployee => {
        if (updatedEmployee) {
            console.log('Updated employee:', updatedEmployee);
            res.json(updatedEmployee);
        } else {
            res.status(404).json({ error: "Employee not found" });
        }
    })
    .catch(err => {
        console.error('Error updating employee:', err);
        res.status(500).json({ error: "Error updating employee" });
    });
});

app.get('/home/:id', (req, res) => {
    const id = req.params.id;
    Employee.findById(id)
        .then(employee => {
            if (employee) {
                res.json(employee);
            } else {
                res.status(404).json({ error: "Employee not found" });
            }
        })
        .catch(err => {
            console.error("Error fetching employee:", err);
            res.status(500).json({ error: "Error fetching employee" });
        });
});
module.exports = app;