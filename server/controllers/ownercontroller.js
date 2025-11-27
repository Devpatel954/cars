import fs from "fs";
import User from "../models/User.js";
import Car from "../models/Car.js";

export const changeroletoowner = async(req,res)=>{
    try {
        const {_id} = req.user;
        await User.findByIdAndUpdate(_id,{role:'owner'});
        res.json({success:true,message:"now you can list cars"});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

export const addCar = async(req,res)=>{
    try {
        const {_id} = req.user;
        const imageFile = req.file;
        
        if (!imageFile) {
            return res.status(400).json({ success: false, message: 'No image file uploaded' });
        }

        // Read image file as base64
        const fileBuffer = fs.readFileSync(imageFile.path);
        const base64Image = fileBuffer.toString('base64');
        const imageDataUrl = `data:${imageFile.mimetype};base64,${base64Image}`;

        // Parse form fields
        const carData = {
            brand: req.body.brand || '',
            model: req.body.model || '',
            year: Number(req.body.year) || 0,
            category: req.body.category || '',
            seating_capacity: Number(req.body.seats) || 0,
            fuel_type: req.body.fuelType || '',
            transmission_type: req.body.transmission || '',
            price_pday: Number(req.body.pricePerDay) || 0,
            location: req.body.location || '',
            description: req.body.description || '',
            image: imageDataUrl
        };

        const car = await Car.create({ ...carData, owner: _id });
        res.json({success:true,message:"car listed successfully",car});
        
        // Clean up temp file
        fs.unlinkSync(imageFile.path);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

export const getCars = async(req,res)=>{
    try {
        const cars = await Car.find().populate('owner','name email');
        res.json({success:true,cars});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

export const getCarById = async(req,res)=>{
    try {
        const {id} = req.params;
        const car = await Car.findById(id).populate('owner','name email');
        if (!car) {
            return res.status(404).json({success:false,message:'Car not found'});
        }
        res.json({success:true,car});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

export const deletecar = async(req,res)=>{
    try {
        const {id} = req.params;
        const car = await Car.findById(id);
        if (!car) {
            return res.status(404).json({success:false,message:'Car not found'});
        }
        if (car.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({success:false,message:'Not authorized'});
        }
        await Car.findByIdAndDelete(id);
        res.json({success:true,message:'Car deleted'});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server error' });
    }
}





