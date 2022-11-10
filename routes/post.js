const router = require("express").Router();
const User = require("../model/user");
//routes
router.get("/computer", async (req, res) => {
  try {
    let data = await User.find();
    res.status(200).send(data);
  } catch (error) {
    console.log(`Error...${error}`);
  }
});
router.get("/getSingleComputer/:id", (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }
  const id = req.params.id;
  User.findById(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot find song with id=${id}`,
        });
      } else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error finding song with id=" + id,
      });
    });
});
router.post("/addComputer", async (req, res) => {
   try {
    const computers = new User({
      computer: req.body.computer,
      description:req.body.description,
     
    });
    
    let newComputer = await computers.save();
    res.status(200).send({ message: " computer added" });
  } catch (error) {
    console.log(`Error..${error}`);
  } 

});
router.put("/updateComputer/:id", (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }
  const id = req.params.id;
  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update song with id=${id}`,
        });
      } else res.send({ message: "Computer was updated!" });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating song with id=" + id,
      });
    });
});
router.delete("/deleteCourse/:id", (req, res) => {
  const id = req.params.id;

  User.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Course with id=${id}`,
        });
      } else {
        res.send({
          message: "course was deleted!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete course with id=" + id,
      });
    });
});
//export router
module.exports = router;
