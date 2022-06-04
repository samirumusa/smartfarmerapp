let model;
let class_indices;
let fileUpload
let img 
let boxResult 
let confidence 
let pconf


        let progressBar

        async function fetchData(){
            let response = await fetch('./class_indices.json');
            let data = await response.json();
            data = JSON.stringify(data);
            data = JSON.parse(data);
            return data;
        }

         // here the data will be return.
        

        // Initialize/Load model
        async function initialize() {
            let status 
            model = await tf.loadLayersModel('./tensorflowjs-model/model.json');
            
        }

        async function predict() {
            // Function for invoking prediction
            let img = document.getElementById('image')
            let offset = tf.scalar(255)
            let tensorImg =   tf.browser.fromPixels(img).resizeNearestNeighbor([224,224]).toFloat().expandDims();
            let tensorImg_scaled = tensorImg.div(offset)
            prediction = await model.predict(tensorImg_scaled).data();
           
            fetchData().then((data)=> 
                {
                    predicted_class = tf.argMax(prediction)
                    
                    class_idx = Array.from(predicted_class.dataSync())[0]
                    `${parseFloat(prediction[class_idx]*100).toFixed(2)}% SURE`
                    Math.round(prediction[class_idx]*100)
  
                }
            );
            
        }

        predict()

        