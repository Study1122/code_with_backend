//const asyncHandler = ()=>{}

export { asyncHandler };

// higher order function
//const asyncHandler = () => {};
//or
//const asyncHandler = (fun) => { () => {}};
// remove curly brackets

/*
const asyncHandler = (fn) => async (req, res, next) => {
  try{
    await fn(req, res, next)
  }catch(err){
    res.status(err.code || 500).json({
      success: false,
      message: err.message
    })
    console.log("ERROR:", `"Connection failed!!" ${err}`)
  }
};
*/