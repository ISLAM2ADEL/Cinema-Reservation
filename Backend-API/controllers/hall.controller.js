import Hall from '../models/hall.model.js';


export const createHall = async (req, res) => {
  try {
    const hall = await Hall.create(req.body);
    
    res.status(201).json({
      success: true,
      data: hall
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getAllHalls = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const halls = await Hall.find().skip(skip).limit(limit);
    
    const total = await Hall.countDocuments(); 

    res.status(200).json({
      success: true,
      count: halls.length,
      pagination: { 
        currentPage: page, 
        totalPages: Math.ceil(total / limit),
        totalItems: total       },
      data: halls
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteHall=async(req,res)=>{
    try{
        const hall=await Hall.findByIdAndDelete(req.params.id);
        if(!hall){
            return res.status(404).json({success:false,message:'Hall not found'});
        }
        res.status(200).json({success:true,message:'Hall deleted successfully', data:{}});
    }
    catch(error){
        res.status(500).json({success:false,message:error.message});
    }
}