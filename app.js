const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

mongoose.connect("mongodb+srv://sample:readonly@cluster0.qmayr.mongodb.net/riddlesDB?retryWrites=true&w=majority",
    { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });

const riddleSchema = new mongoose.Schema({
    riddle: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\w+$/, "Category should be a word with no spaces"]
    },
    source: String,
    seed: Boolean // don't expose this parameter to users
});

const Riddle = mongoose.model("Riddle", riddleSchema);

// landing page
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/README.md.html")
});

app.route("/riddles")
    .get(function(req, res) {
        // GET riddles?id={id} (returns specific riddle)
        const riddleId = req.query.id;
        if (riddleId) {
            Riddle.findOne({_id: riddleId}, function(err, foundRiddle) {
                if (!err) {
                    if (foundRiddle) {
                        res.json(foundRiddle);
                    } else {
                        res.status(404).json({message: "No riddle with the id '" + riddleId + "' was found"});
                    }
                } else if (err.name = "CastError") {
                    res.status(404).json({message: "No riddle with the id '" + riddleId + "' was found"});
                } else {
                    res.status(500).json({error: err});
                }
            }).select("-__v").select("-seed"); //don't display mongoose versionKey or seed data flag in response
        } else {
            // GET riddles (returns all riddles)
            Riddle.find(function(err, riddles) {
                if (!err) {
                    if (riddles) {
                        res.json(riddles);
                    } else {
                        res.status(404).json({message: "No riddles were not found"});
                    }
                } else {
                    res.status(500).json({error: err});
                }
            }).select("-__v").select("-seed");
        }
    })
    // POST riddles (adds one new riddle)
    .post(function(req, res) {
        const riddle = new Riddle({
            riddle: req.body.riddle,
            answer: req.body.answer,
            category: req.body.category,
            source: req.body.source
        });
    
        riddle.save(function(err) {
            if (!err) {
                res.status(201).json({message: "Successfully added new riddle", content: riddle});
            } else if (err.name == "ValidationError") {
                res.status(400).json({error: err});
            } else {
                res.status(500).json({error: err});
            }
        });
    })
    // PUT riddles?id={id} (updates a specific riddle)      
    .put(function(req, res) {
        Riddle.findByIdAndUpdate(
            req.query.id, 
            {riddle: req.body.riddle, answer: req.body.answer, category: req.body.category, source: req.body.source},
            function(err, foundRiddle) {
                if (!err) {
                    if (foundRiddle) {
                        if (foundRiddle.seed) {
                            // don't allow users to change the server seed data
                            res.status(403).json({message: "Cannot modify seed data"});
                        } else {
                            res.json({message: "Successfully updated riddle", content: req.body});
                        }
                    } else {
                        res.status(404).json({message: "No riddle with the id '" + req.query.id + "' was found"});
                    }
                } else if (err.name = "CastError") {
                    res.status(404).json({message: "No riddle with the id '" + req.query.id + "' was found"});
                } else if (err.name == "ValidationError") {
                    res.status(400).json({error: err});
                } else {
                    res.status(500).json({error: err});
                }
            });
    })
    // PATCH riddles?id={id} (updates an element of a specific riddle)
    .patch(function(req, res) {
        Riddle.findByIdAndUpdate(
            req.query.id, 
            {$set: req.body},
            function(err, foundRiddle) {
                if (!err) {
                    if (foundRiddle) {
                        if (foundRiddle.seed) {
                            // don't allow users to change the server seed data
                            res.status(403).json({message: "Cannot modify seed data"});
                        } else {
                            res.json({message: "Successfully updated riddle", content: req.body});
                        }
                    } else {
                        res.status(404).json({message: "No riddle with the id '" + req.query.id + "' was found"});
                    }
                } else if (err.name = "CastError") {
                    res.status(404).json({message: "No riddle with the id '" + req.query.id + "' was found"});
                } else if (err.name == "ValidationError") {
                    res.status(400).json({error: err});
                } else {
                    res.status(500).json({error: err});
                }
            });
    })
    // DELETE riddles?id={id} (deletes a specific riddle)
    .delete(function(req, res) {
        Riddle.findByIdAndDelete(req.query.id, function(err, foundRiddle) {
            if (!err) {
                if (foundRiddle) {
                    if (foundRiddle.seed) {
                        // don't allow users to delete the server seed data
                        res.status(403).json({message: "Cannot delete seed data"});
                    } else {
                        res.json({message: "Successfully deleted riddle"});
                    }
                } else {
                    res.status(404).json({message: "No riddle with the id '" + req.query.id + "' was found"});
                }
            } else if (err.name = "CastError") {
                res.status(404).json({message: "No riddle with the id '" + req.query.id + "' was found"});
            } else {
                res.status(500).json({error: err});
            }
        });
    });

// GET riddles/random (returns one random riddle)
app.get("/riddles/random", function(req, res) {
    Riddle.countDocuments().exec(function(err, count) {
        if (!err) {
            let random = Math.floor(Math.random() * count);
            Riddle.findOne().select("-__v").select("-seed").skip(random).exec(function(err, riddle) {
                if (!err) {
                    if (riddle) {
                        res.json(riddle);
                    } else {
                        res.status(404).json({message: "No riddle was found"});
                    }
                } else {
                    res.status(500).json({error: err});
                }
            });
        } else {
            res.status(500).json({error: err});
        }
    });
});

// GET riddles/{category} (returns all riddles from category)
app.get("/riddles/:riddleCategory", function(req, res) {
        Riddle.find({category: req.params.riddleCategory}, function(err, foundRiddles) {
            if (!err) {
                if (foundRiddles.length != 0) {
                    res.json(foundRiddles);
                } else {
                    res.status(404).json({message: "No riddles with the category '" + req.params.riddleCategory + "' were found"});
                }
            } else {
                res.status(500).json({error: err});
            }
        }).select("-__v").select("-seed");
    });

// GET riddles/{category}/random (returns one random riddle from category)
app.get("/riddles/:riddleCategory/random", function(req, res) {
    Riddle.countDocuments({category: req.params.riddleCategory}).exec(function(err, count) {
        let random = Math.floor(Math.random() * count);
        Riddle.findOne().select("-__v").select("-seed").skip(random).exec(function(err, riddle) {
            if (!err) {
                if (riddle) {
                    res.json(riddle);
                } else {
                    res.status(404).json({message: "No riddle was found"});
                }
            } else {
                res.status(500).json({error: err});
            }
        });
    });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
    console.log("Server started on port " + port);
});