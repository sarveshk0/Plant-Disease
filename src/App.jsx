import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [result, setResult] = useState(null);
  const [diseaseDetail, setdiseaseDetail]=useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   if (!selectedFile || !latitude || !longitude) {
      alert('Please provide all inputs');
     
      return;
    }
    

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);

    reader.onload = async () => {
      const base64Image = reader.result.split(',')[1];  // Extract base64 data

      // Ensure latitude and longitude are numbers
       const latitudeNumber = parseFloat(latitude);
       const longitudeNumber = parseFloat(longitude);
      // Prepare the data to be sent to the API
      const data = JSON.stringify({
        images: [base64Image],
        latitude: latitudeNumber,
        longitude: longitudeNumber,
        similar_images: true
      });

      // console.log('data',data);
      console.log('diseasedeatil',diseaseDetail);

      // Configure the API call using the provided config
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://plant.id/api/v3/health_assessment?details=local_name,description,url,treatment,classification,common_names,cause',
        headers: { 
          'Api-Key': 'jCKC6cmbSYNDNmIsvoA6YLF1q1Ht7eQEdufEnU8PYdrqZjoGg7',  // Replace with your actual API key
          'Content-Type': 'application/json'
        },
        data: data
      };

      try {
        const response = await axios(config);
        setResult(response.data);
        setdiseaseDetail(response.data.result.disease);
        console.log('diseaseDeatil',diseaseDetail);
        
        console.log("result", result);
        
      
      } catch (error) {
        console.error("Error:", error);
      }
    };
  };

  return (
    <div>
      <h2>Plant Disease Identification</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Upload Image:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <div>
          <label>Latitude:</label>
          <input
            type="text"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Longitude:</label>
          <input
            type="text"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>

      {result && (
        <div>
          <h3>Results:</h3>
          Input Img :
             <img src={result.input.images} alt="" width={100} />

             <h3>Disease Suggestions</h3>

             <div>
              <div>Name = {diseaseDetail.suggestions[0].name}</div>
              <div>Probability={diseaseDetail.suggestions[0].probability}</div>
              <div>Similar_img= <img src={diseaseDetail.suggestions[0].similar_images[0].url} alt="" width={100} /></div>
              <div>Image_Similarity= {diseaseDetail.suggestions[0].similar_images[0].similarity} </div>
              <div>Local Name={diseaseDetail.suggestions[0].details.local_name}</div>
              <div>description= {diseaseDetail.suggestions[0].details.description}</div> <br/>
             <div>Treatement= {diseaseDetail.suggestions[0].details.treatment.prevention}</div> <br/>
             <div> Biological Treatement={diseaseDetail.suggestions[0].details.treatment.biological}</div>
            


                {/* {
                diseaseDetail &&diseaseDetail.suggestions.map((id,suggestion)=>(
                  <div key={id}>
                     <li>{suggestion.details.local_name}</li>
                     <li>{suggestion.probability}</li>
                  </div>
                ))
               }  */}
           
              </div>

        </div>

           

      )}
    </div>
  );
};

export default App;
