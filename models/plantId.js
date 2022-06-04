const router = require('express').Router();
const fs =  require('fs')
const axios = require('axios')
const formidable = require('formidable')
const path = require('path')


              var result = null
              var top  = ""
              var details =null
              var similar = null
async function searchId(url){
      console.log('this is the path ',url)
       const path = ""+url
      const imageEncoded= await fs.readFileSync(path, 'base64')// base64.encode(imageURL, options);

      return [imageEncoded]
  }
  

//searchId('blob:http://localhost:3000/75c2678d-13f8-4e19-b08c-fac0ec5bde07').then((d)=>{console.log(d)})
async function getData(req,res){
   console.log('this is the other path',req.query.id)

  await searchId(req.query.id).then( async (base64files)=>{
    //console.log(base64files)
  const data = {
    api_key: "sKchyk9T3TmRlUpxBQlP4ImMe7VGBk4gzJRjZ4XwAPL3xGtLKQ",
    images: base64files,
    /* modifiers docs: https://github.com/flowerchecker/Plant-id-API/wiki/Modifiers */
    modifiers: ["crops_fast", "similar_images"],
    plant_language: "en",
    /* plant details docs: https://github.com/flowerchecker/Plant-id-API/wiki/Plant-details */
    plant_details: ["common_names",
        "url",
        "name_authority",
        "wiki_description",
        "taxonomy",
        "synonyms"],
        };

   await axios.post('https://api.plant.id/v2/identify', data).then(resp => {
            console.log('Success:', resp.data);
              result = resp.data
              top  = resp.data.suggestions[0].plant_name
              details =resp.data.suggestions[0].plant_details
              similar = resp.data.suggestions[0].similar_images

        }).catch(error => {
            console.error('Error: ', error)
        })
           res.json({

              'result':result,
              'top':top,
              'details':details,
              'similar':similar,

            })
        }).catch((err) =>{

           console.log(err)
        })

}

const isFileValid = (file) => {
  const type = file.mimetype.split("/").pop();
  const validTypes = ["jpg", "jpeg", "png", "pdf"];
  if (validTypes.indexOf(type) === -1) {
    return false;
  }
  return true;
};
router.route('/upload').post((req, res) => { 
  //console.log(req.files)

  const uploader = path.join(__dirname,"../../","public/images")
  console.log(uploader)
  const form =  formidable()
  form.multiples=true
  form.maxFileSize= 50 * 1024 * 1024
  form.uploadDir = uploader

  form.parse(req, async (err, fields,files)=>{
    if (err) {

      console.log("Error parsing the files");
      return res.status(400).json({

        status: "Fail",
        message: "There was an error parsing the files",
        error: err,
      });
    }

    //console.log(files.file)
    const file = files.file;
    
      // checks if the file is valid
      const isValid = isFileValid(file);

       const fileName = encodeURIComponent(file.newFilename.replace(/\s/g, "-"));
       
      if (!isValid) {
        // throes error if file isn't valid
        return res.status(400).json({
          status: "Fail",
          message: "The file type is not a valid type",
        });
      }
      try {
        console.log(path.join(uploader, fileName))
        // renames the file in the directory
        fs.renameSync(file.filepath, path.join(uploader, fileName));

        res.json({
          'path':path.join(uploader, fileName) ,
      });
        

      } catch (error) {
        console.log(error);
      }
    
      /* try {
        // stores the fileName in the database
        const newFile = await File.create({
          name: `files/${fileName}`,
        });
        return res.status(200).json({
          status: "success",
          message: "File created successfully!!",
        });
      } catch (error) {
        res.json({
          error,
        });
      } */
    
    /* if (!files.file.size) {
      //Single file
    
      const file = files.file;
    
      // checks if the file is valid
      const isValid = isFileValid(file);
    
      // creates a valid name by removing spaces
     
     */


   
    })
     
 

  /*  */
})
router.route('/').post((req, response) => {

   getData(req,response)
  }); 
  
  module.exports = router;
