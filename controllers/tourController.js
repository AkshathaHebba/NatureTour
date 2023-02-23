// handlers are call controller in model view architecture
const fs = require('fs');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

exports.checkID = (req,res,next,val) =>{
    if(req.params.id * 1 > tours.length){
        return res.status(404).json({
            status: 'fail',
            message:'Invalid ID'
        })
    }
    next();
}
exports.checkBody = (req,res,next) =>{
    if(!req.body.name || !req.body.price){
        return res.status(400).json({
            status:'fail',
            message: 'Missing name or price'
        })
    }
    next();
}

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    })
}


exports.getTour = (req, res) => {
    const id = req.params.id * 1;
    //removing repeated code - Is checked in checkID middleware
    const tour = tours.find(el => el.id === id)
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
}
exports.createTours = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({id: newId}, req.body)
    tours.push(newTour);
    // Include a middle to make a post request
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    })
}
exports.updateTour = (req, res) => {
    //removed repeated code
    res.status(200).json({
        status: 'success',
        data: {
            tour: "Update tour here..."
        }
    })
}
exports.deleteTour = (req, res) => {
   //rempved repeated code
    res.status(200).json({
        status: 'success',
        data: null
    })
}
